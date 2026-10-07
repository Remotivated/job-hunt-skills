import { createRequire as __vendorCreateRequire } from "node:module";
import { fileURLToPath as __vendorFileURLToPath } from "node:url";
import { dirname as __vendorDirname } from "node:path";
const require = __vendorCreateRequire(import.meta.url);
const __filename = __vendorFileURLToPath(import.meta.url);
const __dirname = __vendorDirname(__filename);
import {
  $747425b437e121da$export$c03b919c6651ed55,
  init_module
} from "./chunk-VFVK5HQB.mjs";
import {
  __esm
} from "./chunk-FDWSCWK2.mjs";

// node_modules/fontkit/src/layout/UnicodeLayoutEngine.js
var UnicodeLayoutEngine;
var init_UnicodeLayoutEngine = __esm({
  "node_modules/fontkit/src/layout/UnicodeLayoutEngine.js"() {
    init_module();
    UnicodeLayoutEngine = class {
      constructor(font) {
        this.font = font;
      }
      positionGlyphs(glyphs, positions) {
        let clusterStart = 0;
        let clusterEnd = 0;
        for (let index = 0; index < glyphs.length; index++) {
          let glyph = glyphs[index];
          if (glyph.isMark) {
            clusterEnd = index;
          } else {
            if (clusterStart !== clusterEnd) {
              this.positionCluster(glyphs, positions, clusterStart, clusterEnd);
            }
            clusterStart = clusterEnd = index;
          }
        }
        if (clusterStart !== clusterEnd) {
          this.positionCluster(glyphs, positions, clusterStart, clusterEnd);
        }
        return positions;
      }
      positionCluster(glyphs, positions, clusterStart, clusterEnd) {
        let base = glyphs[clusterStart];
        let baseBox = base.cbox.copy();
        if (base.codePoints.length > 1) {
          baseBox.minX += (base.codePoints.length - 1) * baseBox.width / base.codePoints.length;
        }
        let xOffset = -positions[clusterStart].xAdvance;
        let yOffset = 0;
        let yGap = this.font.unitsPerEm / 16;
        for (let index = clusterStart + 1; index <= clusterEnd; index++) {
          let mark = glyphs[index];
          let markBox = mark.cbox;
          let position = positions[index];
          let combiningClass = this.getCombiningClass(mark.codePoints[0]);
          if (combiningClass !== "Not_Reordered") {
            position.xOffset = position.yOffset = 0;
            switch (combiningClass) {
              case "Double_Above":
              case "Double_Below":
                position.xOffset += baseBox.minX - markBox.width / 2 - markBox.minX;
                break;
              case "Attached_Below_Left":
              case "Below_Left":
              case "Above_Left":
                position.xOffset += baseBox.minX - markBox.minX;
                break;
              case "Attached_Above_Right":
              case "Below_Right":
              case "Above_Right":
                position.xOffset += baseBox.maxX - markBox.width - markBox.minX;
                break;
              default:
                position.xOffset += baseBox.minX + (baseBox.width - markBox.width) / 2 - markBox.minX;
            }
            switch (combiningClass) {
              case "Double_Below":
              case "Below_Left":
              case "Below":
              case "Below_Right":
              case "Attached_Below_Left":
              case "Attached_Below":
                if (combiningClass === "Attached_Below_Left" || combiningClass === "Attached_Below") {
                  baseBox.minY += yGap;
                }
                position.yOffset = -baseBox.minY - markBox.maxY;
                baseBox.minY += markBox.height;
                break;
              case "Double_Above":
              case "Above_Left":
              case "Above":
              case "Above_Right":
              case "Attached_Above":
              case "Attached_Above_Right":
                if (combiningClass === "Attached_Above" || combiningClass === "Attached_Above_Right") {
                  baseBox.maxY += yGap;
                }
                position.yOffset = baseBox.maxY - markBox.minY;
                baseBox.maxY += markBox.height;
                break;
            }
            position.xAdvance = position.yAdvance = 0;
            position.xOffset += xOffset;
            position.yOffset += yOffset;
          } else {
            xOffset -= position.xAdvance;
            yOffset -= position.yAdvance;
          }
        }
        return;
      }
      getCombiningClass(codePoint) {
        let combiningClass = $747425b437e121da$export$c03b919c6651ed55(codePoint);
        if ((codePoint & ~255) === 3584) {
          if (combiningClass === "Not_Reordered") {
            switch (codePoint) {
              case 3633:
              case 3636:
              case 3637:
              case 3638:
              case 3639:
              case 3655:
              case 3660:
              case 3645:
              case 3662:
                return "Above_Right";
              case 3761:
              case 3764:
              case 3765:
              case 3766:
              case 3767:
              case 3771:
              case 3788:
              case 3789:
                return "Above";
              case 3772:
                return "Below";
            }
          } else if (codePoint === 3642) {
            return "Below_Right";
          }
        }
        switch (combiningClass) {
          // Hebrew
          case "CCC10":
          // sheva
          case "CCC11":
          // hataf segol
          case "CCC12":
          // hataf patah
          case "CCC13":
          // hataf qamats
          case "CCC14":
          // hiriq
          case "CCC15":
          // tsere
          case "CCC16":
          // segol
          case "CCC17":
          // patah
          case "CCC18":
          // qamats
          case "CCC20":
          // qubuts
          case "CCC22":
            return "Below";
          case "CCC23":
            return "Attached_Above";
          case "CCC24":
            return "Above_Right";
          case "CCC25":
          // sin dot
          case "CCC19":
            return "Above_Left";
          case "CCC26":
            return "Above";
          case "CCC21":
            break;
          // Arabic and Syriac
          case "CCC27":
          // fathatan
          case "CCC28":
          // dammatan
          case "CCC30":
          // fatha
          case "CCC31":
          // damma
          case "CCC33":
          // shadda
          case "CCC34":
          // sukun
          case "CCC35":
          // superscript alef
          case "CCC36":
            return "Above";
          case "CCC29":
          // kasratan
          case "CCC32":
            return "Below";
          // Thai
          case "CCC103":
            return "Below_Right";
          case "CCC107":
            return "Above_Right";
          // Lao
          case "CCC118":
            return "Below";
          case "CCC122":
            return "Above";
          // Tibetan
          case "CCC129":
          // sign aa
          case "CCC132":
            return "Below";
          case "CCC130":
            return "Above";
        }
        return combiningClass;
      }
    };
  }
});

export {
  UnicodeLayoutEngine,
  init_UnicodeLayoutEngine
};
