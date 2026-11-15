import { createRequire as __vendorCreateRequire } from "node:module";
import { fileURLToPath as __vendorFileURLToPath } from "node:url";
import { dirname as __vendorDirname } from "node:path";
const require = __vendorCreateRequire(import.meta.url);
const __filename = __vendorFileURLToPath(import.meta.url);
const __dirname = __vendorDirname(__filename);
import {
  __esm
} from "./chunk-FDWSCWK2.mjs";

// node_modules/fontkit/src/glyph/GlyphVariationProcessor.js
var TUPLES_SHARE_POINT_NUMBERS, TUPLE_COUNT_MASK, EMBEDDED_TUPLE_COORD, INTERMEDIATE_TUPLE, PRIVATE_POINT_NUMBERS, TUPLE_INDEX_MASK, POINTS_ARE_WORDS, POINT_RUN_COUNT_MASK, DELTAS_ARE_ZERO, DELTAS_ARE_WORDS, DELTA_RUN_COUNT_MASK, GlyphVariationProcessor;
var init_GlyphVariationProcessor = __esm({
  "node_modules/fontkit/src/glyph/GlyphVariationProcessor.js"() {
    TUPLES_SHARE_POINT_NUMBERS = 32768;
    TUPLE_COUNT_MASK = 4095;
    EMBEDDED_TUPLE_COORD = 32768;
    INTERMEDIATE_TUPLE = 16384;
    PRIVATE_POINT_NUMBERS = 8192;
    TUPLE_INDEX_MASK = 4095;
    POINTS_ARE_WORDS = 128;
    POINT_RUN_COUNT_MASK = 127;
    DELTAS_ARE_ZERO = 128;
    DELTAS_ARE_WORDS = 64;
    DELTA_RUN_COUNT_MASK = 63;
    GlyphVariationProcessor = class {
      constructor(font, coords) {
        this.font = font;
        this.normalizedCoords = this.normalizeCoords(coords);
        this.blendVectors = /* @__PURE__ */ new Map();
      }
      normalizeCoords(coords) {
        let normalized = [];
        for (var i = 0; i < this.font.fvar.axis.length; i++) {
          let axis = this.font.fvar.axis[i];
          if (coords[i] < axis.defaultValue) {
            normalized.push((coords[i] - axis.defaultValue + Number.EPSILON) / (axis.defaultValue - axis.minValue + Number.EPSILON));
          } else {
            normalized.push((coords[i] - axis.defaultValue + Number.EPSILON) / (axis.maxValue - axis.defaultValue + Number.EPSILON));
          }
        }
        if (this.font.avar) {
          for (var i = 0; i < this.font.avar.segment.length; i++) {
            let segment = this.font.avar.segment[i];
            for (let j = 0; j < segment.correspondence.length; j++) {
              let pair = segment.correspondence[j];
              if (j >= 1 && normalized[i] < pair.fromCoord) {
                let prev = segment.correspondence[j - 1];
                normalized[i] = ((normalized[i] - prev.fromCoord) * (pair.toCoord - prev.toCoord) + Number.EPSILON) / (pair.fromCoord - prev.fromCoord + Number.EPSILON) + prev.toCoord;
                break;
              }
            }
          }
        }
        return normalized;
      }
      transformPoints(gid, glyphPoints) {
        if (!this.font.fvar || !this.font.gvar) {
          return;
        }
        let { gvar } = this.font;
        if (gid >= gvar.glyphCount) {
          return;
        }
        let offset = gvar.offsets[gid];
        if (offset === gvar.offsets[gid + 1]) {
          return;
        }
        let { stream } = this.font;
        stream.pos = offset;
        if (stream.pos >= stream.length) {
          return;
        }
        let tupleCount = stream.readUInt16BE();
        let offsetToData = offset + stream.readUInt16BE();
        if (tupleCount & TUPLES_SHARE_POINT_NUMBERS) {
          var here = stream.pos;
          stream.pos = offsetToData;
          var sharedPoints = this.decodePoints();
          offsetToData = stream.pos;
          stream.pos = here;
        }
        let origPoints = glyphPoints.map((pt) => pt.copy());
        tupleCount &= TUPLE_COUNT_MASK;
        for (let i = 0; i < tupleCount; i++) {
          let tupleDataSize = stream.readUInt16BE();
          let tupleIndex = stream.readUInt16BE();
          if (tupleIndex & EMBEDDED_TUPLE_COORD) {
            var tupleCoords = [];
            for (let a = 0; a < gvar.axisCount; a++) {
              tupleCoords.push(stream.readInt16BE() / 16384);
            }
          } else {
            if ((tupleIndex & TUPLE_INDEX_MASK) >= gvar.globalCoordCount) {
              throw new Error("Invalid gvar table");
            }
            var tupleCoords = gvar.globalCoords[tupleIndex & TUPLE_INDEX_MASK];
          }
          if (tupleIndex & INTERMEDIATE_TUPLE) {
            var startCoords = [];
            for (let a = 0; a < gvar.axisCount; a++) {
              startCoords.push(stream.readInt16BE() / 16384);
            }
            var endCoords = [];
            for (let a = 0; a < gvar.axisCount; a++) {
              endCoords.push(stream.readInt16BE() / 16384);
            }
          }
          let factor = this.tupleFactor(tupleIndex, tupleCoords, startCoords, endCoords);
          if (factor === 0) {
            offsetToData += tupleDataSize;
            continue;
          }
          var here = stream.pos;
          stream.pos = offsetToData;
          if (tupleIndex & PRIVATE_POINT_NUMBERS) {
            var points = this.decodePoints();
          } else {
            var points = sharedPoints;
          }
          let nPoints = points.length === 0 ? glyphPoints.length : points.length;
          let xDeltas = this.decodeDeltas(nPoints);
          let yDeltas = this.decodeDeltas(nPoints);
          if (points.length === 0) {
            for (let i2 = 0; i2 < glyphPoints.length; i2++) {
              var point = glyphPoints[i2];
              point.x += Math.round(xDeltas[i2] * factor);
              point.y += Math.round(yDeltas[i2] * factor);
            }
          } else {
            let outPoints = origPoints.map((pt) => pt.copy());
            let hasDelta = glyphPoints.map(() => false);
            for (let i2 = 0; i2 < points.length; i2++) {
              let idx = points[i2];
              if (idx < glyphPoints.length) {
                let point2 = outPoints[idx];
                hasDelta[idx] = true;
                point2.x += xDeltas[i2] * factor;
                point2.y += yDeltas[i2] * factor;
              }
            }
            this.interpolateMissingDeltas(outPoints, origPoints, hasDelta);
            for (let i2 = 0; i2 < glyphPoints.length; i2++) {
              let deltaX = outPoints[i2].x - origPoints[i2].x;
              let deltaY = outPoints[i2].y - origPoints[i2].y;
              glyphPoints[i2].x = Math.round(glyphPoints[i2].x + deltaX);
              glyphPoints[i2].y = Math.round(glyphPoints[i2].y + deltaY);
            }
          }
          offsetToData += tupleDataSize;
          stream.pos = here;
        }
      }
      decodePoints() {
        let stream = this.font.stream;
        let count = stream.readUInt8();
        if (count & POINTS_ARE_WORDS) {
          count = (count & POINT_RUN_COUNT_MASK) << 8 | stream.readUInt8();
        }
        let points = new Uint16Array(count);
        let i = 0;
        let point = 0;
        while (i < count) {
          let run = stream.readUInt8();
          let runCount = (run & POINT_RUN_COUNT_MASK) + 1;
          let fn = run & POINTS_ARE_WORDS ? stream.readUInt16 : stream.readUInt8;
          for (let j = 0; j < runCount && i < count; j++) {
            point += fn.call(stream);
            points[i++] = point;
          }
        }
        return points;
      }
      decodeDeltas(count) {
        let stream = this.font.stream;
        let i = 0;
        let deltas = new Int16Array(count);
        while (i < count) {
          let run = stream.readUInt8();
          let runCount = (run & DELTA_RUN_COUNT_MASK) + 1;
          if (run & DELTAS_ARE_ZERO) {
            i += runCount;
          } else {
            let fn = run & DELTAS_ARE_WORDS ? stream.readInt16BE : stream.readInt8;
            for (let j = 0; j < runCount && i < count; j++) {
              deltas[i++] = fn.call(stream);
            }
          }
        }
        return deltas;
      }
      tupleFactor(tupleIndex, tupleCoords, startCoords, endCoords) {
        let normalized = this.normalizedCoords;
        let { gvar } = this.font;
        let factor = 1;
        for (let i = 0; i < gvar.axisCount; i++) {
          if (tupleCoords[i] === 0) {
            continue;
          }
          if (normalized[i] === 0) {
            return 0;
          }
          if ((tupleIndex & INTERMEDIATE_TUPLE) === 0) {
            if (normalized[i] < Math.min(0, tupleCoords[i]) || normalized[i] > Math.max(0, tupleCoords[i])) {
              return 0;
            }
            factor = (factor * normalized[i] + Number.EPSILON) / (tupleCoords[i] + Number.EPSILON);
          } else {
            if (normalized[i] < startCoords[i] || normalized[i] > endCoords[i]) {
              return 0;
            } else if (normalized[i] < tupleCoords[i]) {
              factor = factor * (normalized[i] - startCoords[i] + Number.EPSILON) / (tupleCoords[i] - startCoords[i] + Number.EPSILON);
            } else {
              factor = factor * (endCoords[i] - normalized[i] + Number.EPSILON) / (endCoords[i] - tupleCoords[i] + Number.EPSILON);
            }
          }
        }
        return factor;
      }
      // Interpolates points without delta values.
      // Needed for the Ø and Q glyphs in Skia.
      // Algorithm from Freetype.
      interpolateMissingDeltas(points, inPoints, hasDelta) {
        if (points.length === 0) {
          return;
        }
        let point = 0;
        while (point < points.length) {
          let firstPoint = point;
          let endPoint = point;
          let pt = points[endPoint];
          while (!pt.endContour) {
            pt = points[++endPoint];
          }
          while (point <= endPoint && !hasDelta[point]) {
            point++;
          }
          if (point > endPoint) {
            continue;
          }
          let firstDelta = point;
          let curDelta = point;
          point++;
          while (point <= endPoint) {
            if (hasDelta[point]) {
              this.deltaInterpolate(curDelta + 1, point - 1, curDelta, point, inPoints, points);
              curDelta = point;
            }
            point++;
          }
          if (curDelta === firstDelta) {
            this.deltaShift(firstPoint, endPoint, curDelta, inPoints, points);
          } else {
            this.deltaInterpolate(curDelta + 1, endPoint, curDelta, firstDelta, inPoints, points);
            if (firstDelta > 0) {
              this.deltaInterpolate(firstPoint, firstDelta - 1, curDelta, firstDelta, inPoints, points);
            }
          }
          point = endPoint + 1;
        }
      }
      deltaInterpolate(p1, p2, ref1, ref2, inPoints, outPoints) {
        if (p1 > p2) {
          return;
        }
        let iterable = ["x", "y"];
        for (let i = 0; i < iterable.length; i++) {
          let k = iterable[i];
          if (inPoints[ref1][k] > inPoints[ref2][k]) {
            var p = ref1;
            ref1 = ref2;
            ref2 = p;
          }
          let in1 = inPoints[ref1][k];
          let in2 = inPoints[ref2][k];
          let out1 = outPoints[ref1][k];
          let out2 = outPoints[ref2][k];
          if (in1 !== in2 || out1 === out2) {
            let scale = in1 === in2 ? 0 : (out2 - out1) / (in2 - in1);
            for (let p3 = p1; p3 <= p2; p3++) {
              let out = inPoints[p3][k];
              if (out <= in1) {
                out += out1 - in1;
              } else if (out >= in2) {
                out += out2 - in2;
              } else {
                out = out1 + (out - in1) * scale;
              }
              outPoints[p3][k] = out;
            }
          }
        }
      }
      deltaShift(p1, p2, ref, inPoints, outPoints) {
        let deltaX = outPoints[ref].x - inPoints[ref].x;
        let deltaY = outPoints[ref].y - inPoints[ref].y;
        if (deltaX === 0 && deltaY === 0) {
          return;
        }
        for (let p = p1; p <= p2; p++) {
          if (p !== ref) {
            outPoints[p].x += deltaX;
            outPoints[p].y += deltaY;
          }
        }
      }
      getAdvanceAdjustment(gid, table) {
        let outerIndex, innerIndex;
        if (table.advanceWidthMapping) {
          let idx = gid;
          if (idx >= table.advanceWidthMapping.mapCount) {
            idx = table.advanceWidthMapping.mapCount - 1;
          }
          let entryFormat = table.advanceWidthMapping.entryFormat;
          ({ outerIndex, innerIndex } = table.advanceWidthMapping.mapData[idx]);
        } else {
          outerIndex = 0;
          innerIndex = gid;
        }
        return this.getDelta(table.itemVariationStore, outerIndex, innerIndex);
      }
      // See pseudo code from `Font Variations Overview'
      // in the OpenType specification.
      getDelta(itemStore, outerIndex, innerIndex) {
        if (outerIndex >= itemStore.itemVariationData.length) {
          return 0;
        }
        let varData = itemStore.itemVariationData[outerIndex];
        if (innerIndex >= varData.deltaSets.length) {
          return 0;
        }
        let deltaSet = varData.deltaSets[innerIndex];
        let blendVector = this.getBlendVector(itemStore, outerIndex);
        let netAdjustment = 0;
        for (let master = 0; master < varData.regionIndexCount; master++) {
          netAdjustment += deltaSet.deltas[master] * blendVector[master];
        }
        return netAdjustment;
      }
      getBlendVector(itemStore, outerIndex) {
        let varData = itemStore.itemVariationData[outerIndex];
        if (this.blendVectors.has(varData)) {
          return this.blendVectors.get(varData);
        }
        let normalizedCoords = this.normalizedCoords;
        let blendVector = [];
        for (let master = 0; master < varData.regionIndexCount; master++) {
          let scalar = 1;
          let regionIndex = varData.regionIndexes[master];
          let axes = itemStore.variationRegionList.variationRegions[regionIndex];
          for (let j = 0; j < axes.length; j++) {
            let axis = axes[j];
            let axisScalar;
            if (axis.startCoord > axis.peakCoord || axis.peakCoord > axis.endCoord) {
              axisScalar = 1;
            } else if (axis.startCoord < 0 && axis.endCoord > 0 && axis.peakCoord !== 0) {
              axisScalar = 1;
            } else if (axis.peakCoord === 0) {
              axisScalar = 1;
            } else if (normalizedCoords[j] < axis.startCoord || normalizedCoords[j] > axis.endCoord) {
              axisScalar = 0;
            } else {
              if (normalizedCoords[j] === axis.peakCoord) {
                axisScalar = 1;
              } else if (normalizedCoords[j] < axis.peakCoord) {
                axisScalar = (normalizedCoords[j] - axis.startCoord + Number.EPSILON) / (axis.peakCoord - axis.startCoord + Number.EPSILON);
              } else {
                axisScalar = (axis.endCoord - normalizedCoords[j] + Number.EPSILON) / (axis.endCoord - axis.peakCoord + Number.EPSILON);
              }
            }
            scalar *= axisScalar;
          }
          blendVector[master] = scalar;
        }
        this.blendVectors.set(varData, blendVector);
        return blendVector;
      }
    };
  }
});

export {
  GlyphVariationProcessor,
  init_GlyphVariationProcessor
};
