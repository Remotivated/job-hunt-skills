import { createRequire as __vendorCreateRequire } from "node:module";
import { fileURLToPath as __vendorFileURLToPath } from "node:url";
import { dirname as __vendorDirname } from "node:path";
const require = __vendorCreateRequire(import.meta.url);
const __filename = __vendorFileURLToPath(import.meta.url);
const __dirname = __vendorDirname(__filename);
import {
  init_svg_measure,
  svg_measure_exports
} from "./chunk-FSMB5DQ7.mjs";
import {
  require_PDFDocument
} from "./chunk-TKNXLAAS.mjs";
import {
  require_Renderer
} from "./chunk-VS4NVQMK.mjs";
import {
  require_LayoutBuilder
} from "./chunk-LTV4DDVQ.mjs";
import {
  require_PageSize
} from "./chunk-2J453HR5.mjs";
import {
  require_tableLayouts
} from "./chunk-VW54MTT7.mjs";
import {
  require_tools
} from "./chunk-HGHQZUV7.mjs";
import {
  require_variableType
} from "./chunk-WLP4UAZF.mjs";
import {
  __commonJS,
  __toCommonJS
} from "./chunk-FDWSCWK2.mjs";

// node_modules/pdfmake/js/Printer.js
var require_Printer = __commonJS({
  "node_modules/pdfmake/js/Printer.js"(exports) {
    exports.__esModule = true;
    exports.default = void 0;
    var _PDFDocument = _interopRequireDefault(require_PDFDocument());
    var _LayoutBuilder = _interopRequireDefault(require_LayoutBuilder());
    var _SVGMeasure = _interopRequireDefault((init_svg_measure(), __toCommonJS(svg_measure_exports)));
    var _PageSize = require_PageSize();
    var _tableLayouts = require_tableLayouts();
    var _Renderer = _interopRequireDefault(require_Renderer());
    var _variableType = require_variableType();
    var _tools = require_tools();
    function _interopRequireDefault(e) {
      return e && e.__esModule ? e : { default: e };
    }
    var PdfPrinter = class {
      /**
       * @param {object} fontDescriptors font definition dictionary
       * @param {object} virtualfs
       * @param {object} urlResolver
       * @param {(path: string) => boolean} localAccessPolicy
       */
      constructor(fontDescriptors, virtualfs, urlResolver, localAccessPolicy) {
        this.fontDescriptors = fontDescriptors;
        this.virtualfs = virtualfs;
        this.urlResolver = urlResolver;
        this.localAccessPolicy = localAccessPolicy;
      }
      /**
       * Executes layout engine for the specified document and renders it into a pdfkit document
       * ready to be saved.
       *
       * @param {object} docDefinition
       * @param {object} options
       * @returns {Promise<PDFDocument>} resolved promise return a pdfkit document
       */
      async createPdfKitDocument(docDefinition, options = {}) {
        await this.resolveUrls(docDefinition);
        docDefinition.version = docDefinition.version || "1.3";
        docDefinition.subset = docDefinition.subset || void 0;
        docDefinition.tagged = typeof docDefinition.tagged === "boolean" ? docDefinition.tagged : false;
        docDefinition.displayTitle = typeof docDefinition.displayTitle === "boolean" ? docDefinition.displayTitle : false;
        docDefinition.compress = typeof docDefinition.compress === "boolean" ? docDefinition.compress : true;
        docDefinition.images = docDefinition.images || {};
        docDefinition.attachments = docDefinition.attachments || {};
        docDefinition.pageMargins = (0, _variableType.isValue)(docDefinition.pageMargins) ? docDefinition.pageMargins : 40;
        docDefinition.patterns = docDefinition.patterns || {};
        if (docDefinition.header && typeof docDefinition.header !== "function") {
          docDefinition.header = (0, _tools.convertToDynamicContent)(docDefinition.header);
        }
        if (docDefinition.footer && typeof docDefinition.footer !== "function") {
          docDefinition.footer = (0, _tools.convertToDynamicContent)(docDefinition.footer);
        }
        let pageSize = (0, _PageSize.normalizePageSize)(docDefinition.pageSize, docDefinition.pageOrientation);
        let pdfOptions = {
          size: [pageSize.width, pageSize.height],
          pdfVersion: docDefinition.version,
          subset: docDefinition.subset,
          tagged: docDefinition.tagged,
          displayTitle: docDefinition.displayTitle,
          compress: docDefinition.compress,
          userPassword: docDefinition.userPassword,
          ownerPassword: docDefinition.ownerPassword,
          permissions: docDefinition.permissions,
          lang: docDefinition.language,
          fontLayoutCache: typeof options.fontLayoutCache === "boolean" ? options.fontLayoutCache : true,
          bufferPages: options.bufferPages || false,
          autoFirstPage: false,
          info: createMetadata(docDefinition),
          font: null
        };
        this.pdfKitDoc = new _PDFDocument.default(this.fontDescriptors, docDefinition.images, docDefinition.patterns, docDefinition.attachments, pdfOptions, this.virtualfs, this.localAccessPolicy);
        embedFiles(docDefinition, this.pdfKitDoc);
        const builder = new _LayoutBuilder.default(pageSize, (0, _PageSize.normalizePageMargin)(docDefinition.pageMargins), new _SVGMeasure.default());
        builder.registerTableLayouts(_tableLayouts.tableLayouts);
        if (options.tableLayouts) {
          builder.registerTableLayouts(options.tableLayouts);
        }
        let pages = builder.layoutDocument(docDefinition.content, this.pdfKitDoc, docDefinition.styles || {}, docDefinition.defaultStyle || {
          fontSize: 12,
          font: "Roboto"
        }, docDefinition.background, docDefinition.header, docDefinition.footer, docDefinition.watermark, docDefinition.pageBreakBefore);
        let maxNumberPages = docDefinition.maxPagesNumber || -1;
        if ((0, _variableType.isNumber)(maxNumberPages) && maxNumberPages > -1) {
          pages = pages.slice(0, maxNumberPages);
        }
        pages.forEach((page) => {
          if (page.pageSize.height === Infinity) {
            page.pageSize.height = calculatePageHeight(page, page.pageMargins);
          }
        });
        const renderer = new _Renderer.default(this.pdfKitDoc, options.progressCallback);
        renderer.renderPages(pages);
        return this.pdfKitDoc;
      }
      /**
       * @param {object} docDefinition
       * @returns {Promise}
       */
      async resolveUrls(docDefinition) {
        const getExtendedUrl = (url) => {
          if (typeof url === "object") {
            return {
              url: url.url,
              headers: url.headers
            };
          }
          return {
            url,
            headers: {}
          };
        };
        for (let font in this.fontDescriptors) {
          if (this.fontDescriptors.hasOwnProperty(font)) {
            if (this.fontDescriptors[font].normal) {
              if (Array.isArray(this.fontDescriptors[font].normal)) {
                let url = getExtendedUrl(this.fontDescriptors[font].normal[0]);
                this.urlResolver.resolve(url.url, url.headers);
                this.fontDescriptors[font].normal[0] = url.url;
              } else {
                let url = getExtendedUrl(this.fontDescriptors[font].normal);
                this.urlResolver.resolve(url.url, url.headers);
                this.fontDescriptors[font].normal = url.url;
              }
            }
            if (this.fontDescriptors[font].bold) {
              if (Array.isArray(this.fontDescriptors[font].bold)) {
                let url = getExtendedUrl(this.fontDescriptors[font].bold[0]);
                this.urlResolver.resolve(url.url, url.headers);
                this.fontDescriptors[font].bold[0] = url.url;
              } else {
                let url = getExtendedUrl(this.fontDescriptors[font].bold);
                this.urlResolver.resolve(url.url, url.headers);
                this.fontDescriptors[font].bold = url.url;
              }
            }
            if (this.fontDescriptors[font].italics) {
              if (Array.isArray(this.fontDescriptors[font].italics)) {
                let url = getExtendedUrl(this.fontDescriptors[font].italics[0]);
                this.urlResolver.resolve(url.url, url.headers);
                this.fontDescriptors[font].italics[0] = url.url;
              } else {
                let url = getExtendedUrl(this.fontDescriptors[font].italics);
                this.urlResolver.resolve(url.url, url.headers);
                this.fontDescriptors[font].italics = url.url;
              }
            }
            if (this.fontDescriptors[font].bolditalics) {
              if (Array.isArray(this.fontDescriptors[font].bolditalics)) {
                let url = getExtendedUrl(this.fontDescriptors[font].bolditalics[0]);
                this.urlResolver.resolve(url.url, url.headers);
                this.fontDescriptors[font].bolditalics[0] = url.url;
              } else {
                let url = getExtendedUrl(this.fontDescriptors[font].bolditalics);
                this.urlResolver.resolve(url.url, url.headers);
                this.fontDescriptors[font].bolditalics = url.url;
              }
            }
          }
        }
        if (docDefinition.images) {
          for (let image in docDefinition.images) {
            if (docDefinition.images.hasOwnProperty(image)) {
              let url = getExtendedUrl(docDefinition.images[image]);
              this.urlResolver.resolve(url.url, url.headers);
              docDefinition.images[image] = url.url;
            }
          }
        }
        if (docDefinition.attachments) {
          for (let attachment in docDefinition.attachments) {
            if (docDefinition.attachments.hasOwnProperty(attachment) && docDefinition.attachments[attachment].src) {
              let url = getExtendedUrl(docDefinition.attachments[attachment].src);
              this.urlResolver.resolve(url.url, url.headers);
              docDefinition.attachments[attachment].src = url.url;
            }
          }
        }
        if (docDefinition.files) {
          for (let file in docDefinition.files) {
            if (docDefinition.files.hasOwnProperty(file) && docDefinition.files[file].src) {
              let url = getExtendedUrl(docDefinition.files[file].src);
              this.urlResolver.resolve(url.url, url.headers);
              docDefinition.files[file].src = url.url;
            }
          }
        }
        await this.urlResolver.resolved();
      }
    };
    function createMetadata(docDefinition) {
      function standardizePropertyKey(key) {
        let standardProperties = ["Title", "Author", "Subject", "Keywords", "Creator", "Producer", "CreationDate", "ModDate", "Trapped"];
        let standardizedKey = key.charAt(0).toUpperCase() + key.slice(1);
        if (standardProperties.includes(standardizedKey)) {
          return standardizedKey;
        }
        return key.replace(/\s+/g, "");
      }
      let info = {
        Producer: "pdfmake",
        Creator: "pdfmake"
      };
      if (docDefinition.info) {
        for (let key in docDefinition.info) {
          let value = docDefinition.info[key];
          if (value) {
            key = standardizePropertyKey(key);
            info[key] = value;
          }
        }
      }
      return info;
    }
    function embedFiles(docDefinition, pdfKitDoc) {
      if (docDefinition.files) {
        for (const key in docDefinition.files) {
          const file = docDefinition.files[key];
          if (!file.src) return;
          if (pdfKitDoc.virtualfs && pdfKitDoc.virtualfs.existsSync(file.src)) {
            file.src = pdfKitDoc.virtualfs.readFileSync(file.src);
          }
          file.name = file.name || key;
          pdfKitDoc.file(file.src, file);
        }
      }
    }
    function calculatePageHeight(page, margins) {
      function getItemHeight(item) {
        if (typeof item.item.getHeight === "function") {
          return item.item.getHeight();
        } else if (item.item._height) {
          return item.item._height;
        } else if (item.type === "vector") {
          if (typeof item.item.y1 !== "undefined") {
            return item.item.y1 > item.item.y2 ? item.item.y1 : item.item.y2;
          } else {
            return item.item.h;
          }
        } else {
          return 0;
        }
      }
      function getBottomPosition(item) {
        let top = item.item.y || 0;
        let height2 = getItemHeight(item);
        return top + height2;
      }
      let fixedMargins = (0, _PageSize.normalizePageMargin)(margins || 40);
      let height = fixedMargins.top;
      page.items.forEach((item) => {
        let bottomPosition = getBottomPosition(item);
        if (bottomPosition > height) {
          height = bottomPosition;
        }
      });
      height += fixedMargins.bottom;
      return height;
    }
    var _default = exports.default = PdfPrinter;
  }
});

export {
  require_Printer
};
