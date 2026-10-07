import { createRequire as __vendorCreateRequire } from "node:module";
import { fileURLToPath as __vendorFileURLToPath } from "node:url";
import { dirname as __vendorDirname } from "node:path";
const require = __vendorCreateRequire(import.meta.url);
const __filename = __vendorFileURLToPath(import.meta.url);
const __dirname = __vendorDirname(__filename);
import {
  regex_default as regex_default4
} from "./chunk-KNKVIYLI.mjs";
import {
  regex_default
} from "./chunk-QCWCWXTF.mjs";
import {
  regex_default as regex_default2
} from "./chunk-7YHDYY5Z.mjs";
import {
  regex_default as regex_default3
} from "./chunk-R3ELOAJE.mjs";

// node_modules/linkify-it/lib/re.mjs
function re_default(opts) {
  const re = {};
  opts = opts || {};
  re.src_Any = regex_default.source;
  re.src_Cc = regex_default2.source;
  re.src_Z = regex_default4.source;
  re.src_P = regex_default3.source;
  re.src_ZPCc = [re.src_Z, re.src_P, re.src_Cc].join("|");
  re.src_ZCc = [re.src_Z, re.src_Cc].join("|");
  const text_separators = "[><\uFF5C]";
  re.src_pseudo_letter = "(?:(?!".concat(text_separators, "|").concat(re.src_ZPCc, ")").concat(re.src_Any, ")");
  re.src_ip4 = "(?:(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)";
  re.src_auth = "(?:(?:(?!".concat(re.src_ZCc, "|[@/\\[\\]()]).){1,50}@)?");
  re.src_port = "(?::(?:6(?:[0-4]\\d{3}|5(?:[0-4]\\d{2}|5(?:[0-2]\\d|3[0-5])))|[1-5]?\\d{1,4}))?";
  re.src_host_terminator = "(?=$|".concat(text_separators, "|").concat(re.src_ZPCc, ")") + "(?!".concat(opts["---"] ? "-(?!--)|" : "-|", "_|:\\d|\\.-|\\.(?!$|").concat(re.src_ZPCc, "))");
  re.src_path = "(?:[/?#](?:" + "(?!".concat(re.src_ZCc, "|").concat(text_separators, "|[()[\\]{}.,\"'?!\\-;]).|") + "\\[(?:(?!".concat(re.src_ZCc, "|\\]).)*\\]|") + "\\((?:(?!".concat(re.src_ZCc, "|[)]).)*\\)|") + "\\{(?:(?!".concat(re.src_ZCc, "|[}]).)*\\}|") + '\\"(?:(?!'.concat(re.src_ZCc, '|["]).)+\\"|') + "\\'(?:(?!".concat(re.src_ZCc, "|[']).)+\\'|") + // allow `I'm_king` if no pair found
  "\\'(?=".concat(re.src_pseudo_letter, "|[-])|") + // google has many dots in "google search" links (#66, #81).
  // github has ... in commit range links,
  // Restrict to
  // - english
  // - percent-encoded
  // - parts of file path
  // - params separator
  // until more examples found.
  "\\.{2,}[a-zA-Z0-9%/&]|" + "\\.(?!".concat(re.src_ZCc, "|[.]|$)|") + (opts["---"] ? "\\-(?!--(?:[^-]|$))(?:-*)|" : "\\-+|") + // allow `,,,` in paths
  ",(?!".concat(re.src_ZCc, "|$)|") + // allow `;` if not followed by space-like char
  ";(?!".concat(re.src_ZCc, "|$)|") + // allow `!!!` in paths, but not at the end
  "\\!+(?!".concat(re.src_ZCc, "|[!]|$)|") + "\\?(?!".concat(re.src_ZCc, "|[?]|$)") + ")+|\\/)?";
  re.src_email_name = '[\\-;:&=\\+\\$,\\.a-zA-Z0-9_][\\-;:&=\\+\\$,\\"\\.a-zA-Z0-9_]{0,63}';
  re.src_xn = "xn--[a-z0-9\\-]{1,59}";
  re.src_domain_root = // Allow letters & digits (http://test1)
  "(?:" + re.src_xn + "|" + "".concat(re.src_pseudo_letter, "{1,63}") + ")";
  re.src_domain = "(?:" + re.src_xn + "|" + "(?:".concat(re.src_pseudo_letter, ")") + "|" + "(?:".concat(re.src_pseudo_letter, "(?:-|").concat(re.src_pseudo_letter, "){0,61}").concat(re.src_pseudo_letter, ")") + ")";
  re.src_host = "(?:" + // Don't need IP check, because digits are already allowed in normal domain names
  //   src_ip4 +
  // '|' +
  "(?:(?:(?:".concat(re.src_domain, ")\\.)*").concat(re.src_domain, ")") + ")";
  re.tpl_host_fuzzy = "(?:" + re.src_ip4 + "|" + "(?:(?:(?:".concat(re.src_domain, ")\\.)+(?:%TLDS%))") + ")";
  re.tpl_host_no_ip_fuzzy = "(?:(?:(?:".concat(re.src_domain, ")\\.)+(?:%TLDS%))");
  re.src_host_strict = re.src_host + re.src_host_terminator;
  re.tpl_host_fuzzy_strict = re.tpl_host_fuzzy + re.src_host_terminator;
  re.src_host_port_strict = re.src_host + re.src_port + re.src_host_terminator;
  re.tpl_host_port_fuzzy_strict = re.tpl_host_fuzzy + re.src_port + re.src_host_terminator;
  re.tpl_host_port_no_ip_fuzzy_strict = re.tpl_host_no_ip_fuzzy + re.src_port + re.src_host_terminator;
  re.tpl_host_fuzzy_test = "localhost|www\\.|\\.\\d{1,3}\\.|(?:\\.(?:%TLDS%)(?:".concat(re.src_ZPCc, "|>|$))");
  re.tpl_email_fuzzy = "(^|".concat(text_separators, '|"|\\(|').concat(re.src_ZCc, ")") + "(".concat(re.src_email_name, "@").concat(re.tpl_host_fuzzy_strict, ")");
  re.tpl_link_fuzzy = // Fuzzy link can't be prepended with .:/\- and non punctuation.
  // but can start with > (markdown blockquote)
  "(^|(?![.:/\\-_@])(?:[$+<=>^`|\uFF5C]|".concat(re.src_ZPCc, "))") + "((?![$+<=>^`|\uFF5C])".concat(re.tpl_host_port_fuzzy_strict).concat(re.src_path, ")");
  re.tpl_link_no_ip_fuzzy = // Fuzzy link can't be prepended with .:/\- and non punctuation.
  // but can start with > (markdown blockquote)
  "(^|(?![.:/\\-_@])(?:[$+<=>^`|\uFF5C]|".concat(re.src_ZPCc, "))") + "((?![$+<=>^`|\uFF5C])".concat(re.tpl_host_port_no_ip_fuzzy_strict).concat(re.src_path, ")");
  return re;
}

export {
  re_default
};
