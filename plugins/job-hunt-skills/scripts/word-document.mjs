// Focused WordprocessingML package writer for the document exporter.
// Paragraph/run options describe the constrained resume/letter layout, not
// arbitrary Word documents. Sizes are half-points; spacing/margins are twips.
import { deflateRawSync } from "node:zlib";

const XML = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>';
const WORD_NS = "http://schemas.openxmlformats.org/wordprocessingml/2006/main";
const REL_NS = "http://schemas.openxmlformats.org/package/2006/relationships";
const OFFICE_REL_NS = "http://schemas.openxmlformats.org/officeDocument/2006/relationships";

// Characters XML 1.0 forbids (most C0 controls, U+FFFE, U+FFFF). Word refuses
// a package that contains them, so drop them before escaping.
const INVALID_XML_CHARS = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\uFFFE\uFFFF]/g;

function escapeXml(value) {
  return String(value).replace(INVALID_XML_CHARS, "").replaceAll("&", "&amp;").replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&apos;");
}

function attributes(values, prefix = "w:") {
  return Object.entries(values).filter(([, value]) => value !== undefined)
    .map(([name, value]) => ` ${prefix}${name}="${escapeXml(value)}"`).join("");
}

function fontXml(font) {
  return `<w:rFonts${attributes({ ascii: font, hAnsi: font, eastAsia: font, cs: font })}/>`;
}

function runProperties(run, font) {
  return fontXml(font)
    + (run.bold ? "<w:b/><w:bCs/>" : "")
    + (run.italic ? "<w:i/><w:iCs/>" : "")
    + (run.color === undefined ? "" : `<w:color w:val="${escapeXml(run.color)}"/>`)
    + (run.tracking === undefined ? "" : `<w:spacing w:val="${run.tracking}"/>`)
    + (run.size === undefined ? "" : `<w:sz w:val="${run.size}"/><w:szCs w:val="${run.size}"/>`)
    + (run.link == null ? "" : '<w:u w:val="single"/>');
}

function paragraphXml(paragraph, font, hyperlinks) {
  const properties = [];
  if (paragraph.keepNext) properties.push("<w:keepNext/>");
  if (paragraph.bullet) {
    properties.push('<w:numPr><w:ilvl w:val="0"/><w:numId w:val="1"/></w:numPr>');
  }
  if (paragraph.border) {
    properties.push(`<w:pBdr><w:bottom${attributes({ val: "single", sz: paragraph.border.size, space: 1, color: paragraph.border.color })}/></w:pBdr>`);
  }
  if (paragraph.spacing) properties.push(`<w:spacing${attributes(paragraph.spacing)}/>`);
  const runs = paragraph.runs.map((run) => {
    const content = run.break ? "<w:br/>" : `<w:t xml:space="preserve">${escapeXml(run.text)}</w:t>`;
    const xml = `<w:r><w:rPr>${runProperties(run, font)}</w:rPr>${content}</w:r>`;
    if (run.link == null) return xml;
    // Reuse a relationship when adjacent styled runs share a destination.
    if (!hyperlinks.has(run.link)) hyperlinks.set(run.link, `rId${hyperlinks.size + 4}`);
    return `<w:hyperlink r:id="${hyperlinks.get(run.link)}">${xml}</w:hyperlink>`;
  }).join("");
  return `<w:p><w:pPr>${properties.join("")}</w:pPr>${runs}</w:p>`;
}

function relationshipsXml(relationships) {
  return `${XML}<Relationships xmlns="${REL_NS}">`
    + relationships.map((relationship) => `<Relationship${attributes(relationship, "")}/>`).join("")
    + "</Relationships>";
}

const CRC_TABLE = Uint32Array.from({ length: 256 }, (_, byte) => {
  let crc = byte;
  for (let bit = 0; bit < 8; bit += 1) crc = (crc >>> 1) ^ ((crc & 1) ? 0xedb88320 : 0);
  return crc >>> 0;
});

function crc32(bytes) {
  let crc = 0xffffffff;
  for (const byte of bytes) crc = (crc >>> 8) ^ CRC_TABLE[(crc ^ byte) & 0xff];
  return (crc ^ 0xffffffff) >>> 0;
}

// All six entries are known, ASCII package paths. ZIP32 is sufficient for
// these small XML documents. Fixed DOS dates make repeat exports identical.
function zipXmlParts(parts) {
  const files = [];
  const central = [];
  let offset = 0;
  for (const [path, xml] of parts) {
    const name = Buffer.from(path, "utf8");
    const bytes = Buffer.from(xml, "utf8");
    const compressed = deflateRawSync(bytes);
    const checksum = crc32(bytes);
    const header = Buffer.alloc(30);
    header.writeUInt32LE(0x04034b50, 0);
    header.writeUInt16LE(20, 4); // ZIP 2.0
    header.writeUInt16LE(8, 8); // raw DEFLATE
    header.writeUInt16LE(33, 12); // 1980-01-01
    header.writeUInt32LE(checksum, 14);
    header.writeUInt32LE(compressed.length, 18);
    header.writeUInt32LE(bytes.length, 22);
    header.writeUInt16LE(name.length, 26);

    const directory = Buffer.alloc(46);
    directory.writeUInt32LE(0x02014b50, 0);
    directory.writeUInt16LE(20, 4);
    directory.writeUInt16LE(20, 6);
    directory.writeUInt16LE(8, 10);
    directory.writeUInt16LE(33, 14);
    directory.writeUInt32LE(checksum, 16);
    directory.writeUInt32LE(compressed.length, 20);
    directory.writeUInt32LE(bytes.length, 24);
    directory.writeUInt16LE(name.length, 28);
    directory.writeUInt32LE(offset, 42);
    files.push(header, name, compressed);
    central.push(directory, name);
    offset += header.length + name.length + compressed.length;
  }
  const directory = Buffer.concat(central);
  const end = Buffer.alloc(22);
  end.writeUInt32LE(0x06054b50, 0);
  end.writeUInt16LE(parts.length, 8);
  end.writeUInt16LE(parts.length, 10);
  end.writeUInt32LE(directory.length, 12);
  end.writeUInt32LE(offset, 16);
  return Buffer.concat([...files, directory, end]);
}

export function buildWordDocument({ paragraphs, font, size, color, lineSpacing, page, bulletIndent }) {
  const hyperlinks = new Map();
  const body = paragraphs.map((paragraph) => paragraphXml(paragraph, font, hyperlinks)).join("");
  const document = `${XML}<w:document xmlns:w="${WORD_NS}" xmlns:r="${OFFICE_REL_NS}"><w:body>${body}`
    + `<w:sectPr><w:pgSz${attributes({ w: page.width, h: page.height })}/>`
    + `<w:pgMar${attributes({ ...page.margins, header: 720, footer: 720, gutter: 0 })}/>`
    + "</w:sectPr></w:body></w:document>";
  const styles = `${XML}<w:styles xmlns:w="${WORD_NS}"><w:docDefaults>`
    + `<w:rPrDefault><w:rPr>${runProperties({ size, color }, font)}</w:rPr></w:rPrDefault>`
    + `<w:pPrDefault><w:pPr><w:spacing w:before="0" w:after="100" w:line="${lineSpacing}" w:lineRule="auto"/></w:pPr></w:pPrDefault>`
    + '</w:docDefaults><w:style w:type="paragraph" w:default="1" w:styleId="Normal"><w:name w:val="Normal"/></w:style></w:styles>';
  const numbering = `${XML}<w:numbering xmlns:w="${WORD_NS}"><w:abstractNum w:abstractNumId="0">`
    + '<w:multiLevelType w:val="singleLevel"/><w:lvl w:ilvl="0"><w:start w:val="1"/><w:numFmt w:val="bullet"/><w:lvlText w:val="•"/><w:lvlJc w:val="left"/>'
    + `<w:pPr><w:tabs><w:tab w:val="num" w:pos="${bulletIndent.left}"/></w:tabs><w:ind${attributes(bulletIndent)}/></w:pPr>`
    + `<w:rPr>${fontXml(font)}</w:rPr></w:lvl></w:abstractNum><w:num w:numId="1"><w:abstractNumId w:val="0"/></w:num></w:numbering>`;
  // compatibilityMode 15 marks the file as a current Word document; without it
  // Word opens the export in Compatibility Mode.
  const settings = `${XML}<w:settings xmlns:w="${WORD_NS}"><w:compat>`
    + '<w:compatSetting w:name="compatibilityMode" w:uri="http://schemas.microsoft.com/office/word" w:val="15"/>'
    + "</w:compat></w:settings>";
  const documentRelationships = relationshipsXml([
    { Id: "rId1", Type: `${OFFICE_REL_NS}/styles`, Target: "styles.xml" },
    { Id: "rId2", Type: `${OFFICE_REL_NS}/numbering`, Target: "numbering.xml" },
    { Id: "rId3", Type: `${OFFICE_REL_NS}/settings`, Target: "settings.xml" },
    ...[...hyperlinks].map(([Target, Id]) => ({ Id, Type: `${OFFICE_REL_NS}/hyperlink`, Target, TargetMode: "External" })),
  ]);
  const contentTypes = `${XML}<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">`
    + '<Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/>'
    + [ ["document", "document.main"], ["styles", "styles"], ["numbering", "numbering"], ["settings", "settings"] ]
      .map(([name, type]) => `<Override PartName="/word/${name}.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.${type}+xml"/>`).join("")
    + "</Types>";
  return zipXmlParts([
    ["[Content_Types].xml", contentTypes],
    ["_rels/.rels", relationshipsXml([{ Id: "rId1", Type: `${OFFICE_REL_NS}/officeDocument`, Target: "word/document.xml" }])],
    ["word/document.xml", document],
    ["word/styles.xml", styles],
    ["word/numbering.xml", numbering],
    ["word/settings.xml", settings],
    ["word/_rels/document.xml.rels", documentRelationships],
  ]);
}
