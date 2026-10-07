import { createRequire as __vendorCreateRequire } from "node:module";
import { fileURLToPath as __vendorFileURLToPath } from "node:url";
import { dirname as __vendorDirname } from "node:path";
const require = __vendorCreateRequire(import.meta.url);
const __filename = __vendorFileURLToPath(import.meta.url);
const __dirname = __vendorDirname(__filename);
import {
  init_restructure
} from "./chunk-YFRH6662.mjs";
import {
  Struct
} from "./chunk-2FAS3ON4.mjs";
import {
  ArrayT
} from "./chunk-KM4TAG6K.mjs";
import {
  int16,
  uint16,
  uint8
} from "./chunk-TXWX2CMZ.mjs";
import {
  EncodeStream
} from "./chunk-O372ZRV6.mjs";
import {
  __esm
} from "./chunk-FDWSCWK2.mjs";

// node_modules/fontkit/src/glyph/TTFGlyphEncoder.js
var ON_CURVE, X_SHORT_VECTOR, Y_SHORT_VECTOR, REPEAT, SAME_X, SAME_Y, Point, Glyf, TTFGlyphEncoder;
var init_TTFGlyphEncoder = __esm({
  "node_modules/fontkit/src/glyph/TTFGlyphEncoder.js"() {
    init_restructure();
    ON_CURVE = 1 << 0;
    X_SHORT_VECTOR = 1 << 1;
    Y_SHORT_VECTOR = 1 << 2;
    REPEAT = 1 << 3;
    SAME_X = 1 << 4;
    SAME_Y = 1 << 5;
    Point = class {
      static size(val) {
        return val >= 0 && val <= 255 ? 1 : 2;
      }
      static encode(stream, value) {
        if (value >= 0 && value <= 255) {
          stream.writeUInt8(value);
        } else {
          stream.writeInt16BE(value);
        }
      }
    };
    Glyf = new Struct({
      numberOfContours: int16,
      // if negative, this is a composite glyph
      xMin: int16,
      yMin: int16,
      xMax: int16,
      yMax: int16,
      endPtsOfContours: new ArrayT(uint16, "numberOfContours"),
      instructions: new ArrayT(uint8, uint16),
      flags: new ArrayT(uint8, 0),
      xPoints: new ArrayT(Point, 0),
      yPoints: new ArrayT(Point, 0)
    });
    TTFGlyphEncoder = class {
      encodeSimple(path, instructions = []) {
        let endPtsOfContours = [];
        let xPoints = [];
        let yPoints = [];
        let flags = [];
        let same = 0;
        let lastX = 0, lastY = 0, lastFlag = 0;
        let pointCount = 0;
        for (let i = 0; i < path.commands.length; i++) {
          let c = path.commands[i];
          for (let j = 0; j < c.args.length; j += 2) {
            let x = c.args[j];
            let y = c.args[j + 1];
            let flag = 0;
            if (c.command === "quadraticCurveTo" && j === 2) {
              let next = path.commands[i + 1];
              if (next && next.command === "quadraticCurveTo") {
                let midX = (lastX + next.args[0]) / 2;
                let midY = (lastY + next.args[1]) / 2;
                if (x === midX && y === midY) {
                  continue;
                }
              }
            }
            if (!(c.command === "quadraticCurveTo" && j === 0)) {
              flag |= ON_CURVE;
            }
            flag = this._encodePoint(x, lastX, xPoints, flag, X_SHORT_VECTOR, SAME_X);
            flag = this._encodePoint(y, lastY, yPoints, flag, Y_SHORT_VECTOR, SAME_Y);
            if (flag === lastFlag && same < 255) {
              flags[flags.length - 1] |= REPEAT;
              same++;
            } else {
              if (same > 0) {
                flags.push(same);
                same = 0;
              }
              flags.push(flag);
              lastFlag = flag;
            }
            lastX = x;
            lastY = y;
            pointCount++;
          }
          if (c.command === "closePath") {
            endPtsOfContours.push(pointCount - 1);
          }
        }
        if (path.commands.length > 1 && path.commands[path.commands.length - 1].command !== "closePath") {
          endPtsOfContours.push(pointCount - 1);
        }
        let bbox = path.bbox;
        let glyf = {
          numberOfContours: endPtsOfContours.length,
          xMin: bbox.minX,
          yMin: bbox.minY,
          xMax: bbox.maxX,
          yMax: bbox.maxY,
          endPtsOfContours,
          instructions,
          flags,
          xPoints,
          yPoints
        };
        let size = Glyf.size(glyf);
        let tail = 4 - size % 4;
        let stream = new EncodeStream(size + tail);
        Glyf.encode(stream, glyf);
        if (tail !== 0) {
          stream.fill(0, tail);
        }
        return stream.buffer;
      }
      _encodePoint(value, last, points, flag, shortFlag, sameFlag) {
        let diff = value - last;
        if (value === last) {
          flag |= sameFlag;
        } else {
          if (-255 <= diff && diff <= 255) {
            flag |= shortFlag;
            if (diff < 0) {
              diff = -diff;
            } else {
              flag |= sameFlag;
            }
          }
          points.push(diff);
        }
        return flag;
      }
    };
  }
});

export {
  TTFGlyphEncoder,
  init_TTFGlyphEncoder
};
