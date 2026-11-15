import { createRequire as __vendorCreateRequire } from "node:module";
import { fileURLToPath as __vendorFileURLToPath } from "node:url";
import { dirname as __vendorDirname } from "node:path";
const require = __vendorCreateRequire(import.meta.url);
const __filename = __vendorFileURLToPath(import.meta.url);
const __dirname = __vendorDirname(__filename);
import {
  OTProcessor,
  init_OTProcessor
} from "./chunk-IQQOVWPB.mjs";
import {
  $747425b437e121da$export$e33ad6871e762338,
  init_module
} from "./chunk-VFVK5HQB.mjs";
import {
  __esm
} from "./chunk-FDWSCWK2.mjs";

// node_modules/fontkit/src/opentype/GlyphInfo.js
var GlyphInfo;
var init_GlyphInfo = __esm({
  "node_modules/fontkit/src/opentype/GlyphInfo.js"() {
    init_module();
    init_OTProcessor();
    GlyphInfo = class _GlyphInfo {
      constructor(font, id, codePoints = [], features) {
        this._font = font;
        this.codePoints = codePoints;
        this.id = id;
        this.features = {};
        if (Array.isArray(features)) {
          for (let i = 0; i < features.length; i++) {
            let feature = features[i];
            this.features[feature] = true;
          }
        } else if (typeof features === "object") {
          Object.assign(this.features, features);
        }
        this.ligatureID = null;
        this.ligatureComponent = null;
        this.isLigated = false;
        this.cursiveAttachment = null;
        this.markAttachment = null;
        this.shaperInfo = null;
        this.substituted = false;
        this.isMultiplied = false;
      }
      get id() {
        return this._id;
      }
      set id(id) {
        this._id = id;
        this.substituted = true;
        let GDEF = this._font.GDEF;
        if (GDEF && GDEF.glyphClassDef) {
          let classID = OTProcessor.prototype.getClassID(id, GDEF.glyphClassDef);
          this.isBase = classID === 1;
          this.isLigature = classID === 2;
          this.isMark = classID === 3;
          this.markAttachmentType = GDEF.markAttachClassDef ? OTProcessor.prototype.getClassID(id, GDEF.markAttachClassDef) : 0;
        } else {
          this.isMark = this.codePoints.length > 0 && this.codePoints.every($747425b437e121da$export$e33ad6871e762338);
          this.isBase = !this.isMark;
          this.isLigature = this.codePoints.length > 1;
          this.markAttachmentType = 0;
        }
      }
      copy() {
        return new _GlyphInfo(this._font, this.id, this.codePoints, this.features);
      }
    };
  }
});

export {
  GlyphInfo,
  init_GlyphInfo
};
