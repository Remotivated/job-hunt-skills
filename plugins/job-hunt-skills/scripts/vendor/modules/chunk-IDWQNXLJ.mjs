import { createRequire as __vendorCreateRequire } from "node:module";
import { fileURLToPath as __vendorFileURLToPath } from "node:url";
import { dirname as __vendorDirname } from "node:path";
const require = __vendorCreateRequire(import.meta.url);
const __filename = __vendorFileURLToPath(import.meta.url);
const __dirname = __vendorDirname(__filename);
import {
  __commonJS
} from "./chunk-FDWSCWK2.mjs";

// node_modules/pdfmake/js/qrEnc.js
var require_qrEnc = __commonJS({
  "node_modules/pdfmake/js/qrEnc.js"(exports) {
    exports.__esModule = true;
    exports.default = void 0;
    var VERSIONS = [null, [[10, 7, 17, 13], [1, 1, 1, 1], []], [[16, 10, 28, 22], [1, 1, 1, 1], [4, 16]], [[26, 15, 22, 18], [1, 1, 2, 2], [4, 20]], [[18, 20, 16, 26], [2, 1, 4, 2], [4, 24]], [[24, 26, 22, 18], [2, 1, 4, 4], [4, 28]], [[16, 18, 28, 24], [4, 2, 4, 4], [4, 32]], [[18, 20, 26, 18], [4, 2, 5, 6], [4, 20, 36]], [[22, 24, 26, 22], [4, 2, 6, 6], [4, 22, 40]], [[22, 30, 24, 20], [5, 2, 8, 8], [4, 24, 44]], [[26, 18, 28, 24], [5, 4, 8, 8], [4, 26, 48]], [[30, 20, 24, 28], [5, 4, 11, 8], [4, 28, 52]], [[22, 24, 28, 26], [8, 4, 11, 10], [4, 30, 56]], [[22, 26, 22, 24], [9, 4, 16, 12], [4, 32, 60]], [[24, 30, 24, 20], [9, 4, 16, 16], [4, 24, 44, 64]], [[24, 22, 24, 30], [10, 6, 18, 12], [4, 24, 46, 68]], [[28, 24, 30, 24], [10, 6, 16, 17], [4, 24, 48, 72]], [[28, 28, 28, 28], [11, 6, 19, 16], [4, 28, 52, 76]], [[26, 30, 28, 28], [13, 6, 21, 18], [4, 28, 54, 80]], [[26, 28, 26, 26], [14, 7, 25, 21], [4, 28, 56, 84]], [[26, 28, 28, 30], [16, 8, 25, 20], [4, 32, 60, 88]], [[26, 28, 30, 28], [17, 8, 25, 23], [4, 26, 48, 70, 92]], [[28, 28, 24, 30], [17, 9, 34, 23], [4, 24, 48, 72, 96]], [[28, 30, 30, 30], [18, 9, 30, 25], [4, 28, 52, 76, 100]], [[28, 30, 30, 30], [20, 10, 32, 27], [4, 26, 52, 78, 104]], [[28, 26, 30, 30], [21, 12, 35, 29], [4, 30, 56, 82, 108]], [[28, 28, 30, 28], [23, 12, 37, 34], [4, 28, 56, 84, 112]], [[28, 30, 30, 30], [25, 12, 40, 34], [4, 32, 60, 88, 116]], [[28, 30, 30, 30], [26, 13, 42, 35], [4, 24, 48, 72, 96, 120]], [[28, 30, 30, 30], [28, 14, 45, 38], [4, 28, 52, 76, 100, 124]], [[28, 30, 30, 30], [29, 15, 48, 40], [4, 24, 50, 76, 102, 128]], [[28, 30, 30, 30], [31, 16, 51, 43], [4, 28, 54, 80, 106, 132]], [[28, 30, 30, 30], [33, 17, 54, 45], [4, 32, 58, 84, 110, 136]], [[28, 30, 30, 30], [35, 18, 57, 48], [4, 28, 56, 84, 112, 140]], [[28, 30, 30, 30], [37, 19, 60, 51], [4, 32, 60, 88, 116, 144]], [[28, 30, 30, 30], [38, 19, 63, 53], [4, 28, 52, 76, 100, 124, 148]], [[28, 30, 30, 30], [40, 20, 66, 56], [4, 22, 48, 74, 100, 126, 152]], [[28, 30, 30, 30], [43, 21, 70, 59], [4, 26, 52, 78, 104, 130, 156]], [[28, 30, 30, 30], [45, 22, 74, 62], [4, 30, 56, 82, 108, 134, 160]], [[28, 30, 30, 30], [47, 24, 77, 65], [4, 24, 52, 80, 108, 136, 164]], [[28, 30, 30, 30], [49, 25, 81, 68], [4, 28, 56, 84, 112, 140, 168]]];
    var MODE_TERMINATOR = 0;
    var MODE_NUMERIC = 1;
    var MODE_ALPHANUMERIC = 2;
    var MODE_OCTET = 4;
    var MODE_KANJI = 8;
    var NUMERIC_REGEXP = /^\d*$/;
    var ALPHANUMERIC_REGEXP = /^[A-Za-z0-9 $%*+\-./:]*$/;
    var ALPHANUMERIC_OUT_REGEXP = /^[A-Z0-9 $%*+\-./:]*$/;
    var ECCLEVEL_L = 1;
    var ECCLEVEL_M = 0;
    var ECCLEVEL_Q = 3;
    var ECCLEVEL_H = 2;
    var GF256_MAP = [];
    var GF256_INVMAP = [-1];
    for (i = 0, v = 1; i < 255; ++i) {
      GF256_MAP.push(v);
      GF256_INVMAP[v] = i;
      v = v * 2 ^ (v >= 128 ? 285 : 0);
    }
    var i;
    var v;
    var GF256_GENPOLY = [[]];
    for (i = 0; i < 30; ++i) {
      prevpoly = GF256_GENPOLY[i], poly = [];
      for (j = 0; j <= i; ++j) {
        a = j < i ? GF256_MAP[prevpoly[j]] : 0;
        b = GF256_MAP[(i + (prevpoly[j - 1] || 0)) % 255];
        poly.push(GF256_INVMAP[a ^ b]);
      }
      GF256_GENPOLY.push(poly);
    }
    var prevpoly;
    var poly;
    var a;
    var b;
    var j;
    var i;
    var ALPHANUMERIC_MAP = {};
    for (i = 0; i < 45; ++i) {
      ALPHANUMERIC_MAP["0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ $%*+-./:".charAt(i)] = i;
    }
    var i;
    var MASKFUNCS = [function(i2, j2) {
      return (i2 + j2) % 2 === 0;
    }, function(i2, j2) {
      return i2 % 2 === 0;
    }, function(i2, j2) {
      return j2 % 3 === 0;
    }, function(i2, j2) {
      return (i2 + j2) % 3 === 0;
    }, function(i2, j2) {
      return ((i2 / 2 | 0) + (j2 / 3 | 0)) % 2 === 0;
    }, function(i2, j2) {
      return i2 * j2 % 2 + i2 * j2 % 3 === 0;
    }, function(i2, j2) {
      return (i2 * j2 % 2 + i2 * j2 % 3) % 2 === 0;
    }, function(i2, j2) {
      return ((i2 + j2) % 2 + i2 * j2 % 3) % 2 === 0;
    }];
    var needsverinfo = function(ver) {
      return ver > 6;
    };
    var getsizebyver = function(ver) {
      return 4 * ver + 17;
    };
    var nfullbits = function(ver) {
      var v2 = VERSIONS[ver];
      var nbits = 16 * ver * ver + 128 * ver + 64;
      if (needsverinfo(ver)) nbits -= 36;
      if (v2[2].length) {
        nbits -= 25 * v2[2].length * v2[2].length - 10 * v2[2].length - 55;
      }
      return nbits;
    };
    var ndatabits = function(ver, ecclevel) {
      var nbits = nfullbits(ver) & ~7;
      var v2 = VERSIONS[ver];
      nbits -= 8 * v2[0][ecclevel] * v2[1][ecclevel];
      return nbits;
    };
    var ndatalenbits = function(ver, mode) {
      switch (mode) {
        case MODE_NUMERIC:
          return ver < 10 ? 10 : ver < 27 ? 12 : 14;
        case MODE_ALPHANUMERIC:
          return ver < 10 ? 9 : ver < 27 ? 11 : 13;
        case MODE_OCTET:
          return ver < 10 ? 8 : 16;
        case MODE_KANJI:
          return ver < 10 ? 8 : ver < 27 ? 10 : 12;
      }
    };
    var getmaxdatalen = function(ver, mode, ecclevel) {
      var nbits = ndatabits(ver, ecclevel) - 4 - ndatalenbits(ver, mode);
      switch (mode) {
        case MODE_NUMERIC:
          return (nbits / 10 | 0) * 3 + (nbits % 10 < 4 ? 0 : nbits % 10 < 7 ? 1 : 2);
        case MODE_ALPHANUMERIC:
          return (nbits / 11 | 0) * 2 + (nbits % 11 < 6 ? 0 : 1);
        case MODE_OCTET:
          return nbits / 8 | 0;
        case MODE_KANJI:
          return nbits / 13 | 0;
      }
    };
    var validatedata = function(mode, data) {
      switch (mode) {
        case MODE_NUMERIC:
          if (!data.match(NUMERIC_REGEXP)) return null;
          return data;
        case MODE_ALPHANUMERIC:
          if (!data.match(ALPHANUMERIC_REGEXP)) return null;
          return data.toUpperCase();
        case MODE_OCTET:
          if (typeof data === "string") {
            var newdata = [];
            for (var i2 = 0; i2 < data.length; ++i2) {
              var ch = data.charCodeAt(i2);
              if (ch < 128) {
                newdata.push(ch);
              } else if (ch < 2048) {
                newdata.push(192 | ch >> 6, 128 | ch & 63);
              } else if (ch < 65536) {
                newdata.push(224 | ch >> 12, 128 | ch >> 6 & 63, 128 | ch & 63);
              } else {
                newdata.push(240 | ch >> 18, 128 | ch >> 12 & 63, 128 | ch >> 6 & 63, 128 | ch & 63);
              }
            }
            return newdata;
          } else {
            return data;
          }
      }
    };
    var encode = function(ver, mode, data, maxbuflen) {
      var buf = [];
      var bits = 0, remaining = 8;
      var datalen = data.length;
      var pack = function(x, n) {
        if (n >= remaining) {
          buf.push(bits | x >> (n -= remaining));
          while (n >= 8) buf.push(x >> (n -= 8) & 255);
          bits = 0;
          remaining = 8;
        }
        if (n > 0) bits |= (x & (1 << n) - 1) << (remaining -= n);
      };
      var nlenbits = ndatalenbits(ver, mode);
      pack(mode, 4);
      pack(datalen, nlenbits);
      switch (mode) {
        case MODE_NUMERIC:
          for (var i2 = 2; i2 < datalen; i2 += 3) {
            pack(parseInt(data.substring(i2 - 2, i2 + 1), 10), 10);
          }
          pack(parseInt(data.substring(i2 - 2), 10), [0, 4, 7][datalen % 3]);
          break;
        case MODE_ALPHANUMERIC:
          for (var i2 = 1; i2 < datalen; i2 += 2) {
            pack(ALPHANUMERIC_MAP[data.charAt(i2 - 1)] * 45 + ALPHANUMERIC_MAP[data.charAt(i2)], 11);
          }
          if (datalen % 2 == 1) {
            pack(ALPHANUMERIC_MAP[data.charAt(i2 - 1)], 6);
          }
          break;
        case MODE_OCTET:
          for (var i2 = 0; i2 < datalen; ++i2) {
            pack(data[i2], 8);
          }
          break;
      }
      pack(MODE_TERMINATOR, 4);
      if (remaining < 8) buf.push(bits);
      while (buf.length + 1 < maxbuflen) buf.push(236, 17);
      if (buf.length < maxbuflen) buf.push(236);
      return buf;
    };
    var calculateecc = function(poly2, genpoly) {
      var modulus = poly2.slice(0);
      var polylen = poly2.length, genpolylen = genpoly.length;
      for (var i2 = 0; i2 < genpolylen; ++i2) modulus.push(0);
      for (var i2 = 0; i2 < polylen; ) {
        var quotient = GF256_INVMAP[modulus[i2++]];
        if (quotient >= 0) {
          for (var j2 = 0; j2 < genpolylen; ++j2) {
            modulus[i2 + j2] ^= GF256_MAP[(quotient + genpoly[j2]) % 255];
          }
        }
      }
      return modulus.slice(polylen);
    };
    var augumenteccs = function(poly2, nblocks, genpoly) {
      var subsizes = [];
      var subsize = poly2.length / nblocks | 0, subsize0 = 0;
      var pivot = nblocks - poly2.length % nblocks;
      for (var i2 = 0; i2 < pivot; ++i2) {
        subsizes.push(subsize0);
        subsize0 += subsize;
      }
      for (var i2 = pivot; i2 < nblocks; ++i2) {
        subsizes.push(subsize0);
        subsize0 += subsize + 1;
      }
      subsizes.push(subsize0);
      var eccs = [];
      for (var i2 = 0; i2 < nblocks; ++i2) {
        eccs.push(calculateecc(poly2.slice(subsizes[i2], subsizes[i2 + 1]), genpoly));
      }
      var result = [];
      var nitemsperblock = poly2.length / nblocks | 0;
      for (var i2 = 0; i2 < nitemsperblock; ++i2) {
        for (var j2 = 0; j2 < nblocks; ++j2) {
          result.push(poly2[subsizes[j2] + i2]);
        }
      }
      for (var j2 = pivot; j2 < nblocks; ++j2) {
        result.push(poly2[subsizes[j2 + 1] - 1]);
      }
      for (var i2 = 0; i2 < genpoly.length; ++i2) {
        for (var j2 = 0; j2 < nblocks; ++j2) {
          result.push(eccs[j2][i2]);
        }
      }
      return result;
    };
    var augumentbch = function(poly2, p, genpoly, q) {
      var modulus = poly2 << q;
      for (var i2 = p - 1; i2 >= 0; --i2) {
        if (modulus >> q + i2 & 1) modulus ^= genpoly << i2;
      }
      return poly2 << q | modulus;
    };
    var makebasematrix = function(ver) {
      var v2 = VERSIONS[ver], n = getsizebyver(ver);
      var matrix = [], reserved = [];
      for (var i2 = 0; i2 < n; ++i2) {
        matrix.push([]);
        reserved.push([]);
      }
      var blit = function(y, x, h, w, bits) {
        for (var i3 = 0; i3 < h; ++i3) {
          for (var j3 = 0; j3 < w; ++j3) {
            matrix[y + i3][x + j3] = bits[i3] >> j3 & 1;
            reserved[y + i3][x + j3] = 1;
          }
        }
      };
      blit(0, 0, 9, 9, [127, 65, 93, 93, 93, 65, 383, 0, 64]);
      blit(n - 8, 0, 8, 9, [256, 127, 65, 93, 93, 93, 65, 127]);
      blit(0, n - 8, 9, 8, [254, 130, 186, 186, 186, 130, 254, 0, 0]);
      for (var i2 = 9; i2 < n - 8; ++i2) {
        matrix[6][i2] = matrix[i2][6] = ~i2 & 1;
        reserved[6][i2] = reserved[i2][6] = 1;
      }
      var aligns = v2[2], m = aligns.length;
      for (var i2 = 0; i2 < m; ++i2) {
        var minj = i2 === 0 || i2 === m - 1 ? 1 : 0, maxj = i2 === 0 ? m - 1 : m;
        for (var j2 = minj; j2 < maxj; ++j2) {
          blit(aligns[i2], aligns[j2], 5, 5, [31, 17, 21, 17, 31]);
        }
      }
      if (needsverinfo(ver)) {
        var code = augumentbch(ver, 6, 7973, 12);
        var k = 0;
        for (var i2 = 0; i2 < 6; ++i2) {
          for (var j2 = 0; j2 < 3; ++j2) {
            matrix[i2][n - 11 + j2] = matrix[n - 11 + j2][i2] = code >> k++ & 1;
            reserved[i2][n - 11 + j2] = reserved[n - 11 + j2][i2] = 1;
          }
        }
      }
      return {
        matrix,
        reserved
      };
    };
    var putdata = function(matrix, reserved, buf) {
      var n = matrix.length;
      var k = 0, dir = -1;
      for (var i2 = n - 1; i2 >= 0; i2 -= 2) {
        if (i2 == 6) --i2;
        var jj = dir < 0 ? n - 1 : 0;
        for (var j2 = 0; j2 < n; ++j2) {
          for (var ii = i2; ii > i2 - 2; --ii) {
            if (!reserved[jj][ii]) {
              matrix[jj][ii] = buf[k >> 3] >> (~k & 7) & 1;
              ++k;
            }
          }
          jj += dir;
        }
        dir = -dir;
      }
      return matrix;
    };
    var maskdata = function(matrix, reserved, mask) {
      var maskf = MASKFUNCS[mask];
      var n = matrix.length;
      for (var i2 = 0; i2 < n; ++i2) {
        for (var j2 = 0; j2 < n; ++j2) {
          if (!reserved[i2][j2]) matrix[i2][j2] ^= maskf(i2, j2);
        }
      }
      return matrix;
    };
    var putformatinfo = function(matrix, reserved, ecclevel, mask) {
      var n = matrix.length;
      var code = augumentbch(ecclevel << 3 | mask, 5, 1335, 10) ^ 21522;
      for (var i2 = 0; i2 < 15; ++i2) {
        var r = [0, 1, 2, 3, 4, 5, 7, 8, n - 7, n - 6, n - 5, n - 4, n - 3, n - 2, n - 1][i2];
        var c = [n - 1, n - 2, n - 3, n - 4, n - 5, n - 6, n - 7, n - 8, 7, 5, 4, 3, 2, 1, 0][i2];
        matrix[r][8] = matrix[8][c] = code >> i2 & 1;
      }
      return matrix;
    };
    var evaluatematrix = function(matrix) {
      var PENALTY_CONSECUTIVE = 3;
      var PENALTY_TWOBYTWO = 3;
      var PENALTY_FINDERLIKE = 40;
      var PENALTY_DENSITY = 10;
      var evaluategroup = function(groups2) {
        var score2 = 0;
        for (var i3 = 0; i3 < groups2.length; ++i3) {
          if (groups2[i3] >= 5) score2 += PENALTY_CONSECUTIVE + (groups2[i3] - 5);
        }
        for (var i3 = 5; i3 < groups2.length; i3 += 2) {
          var p2 = groups2[i3];
          if (groups2[i3 - 1] == p2 && groups2[i3 - 2] == 3 * p2 && groups2[i3 - 3] == p2 && groups2[i3 - 4] == p2 && (groups2[i3 - 5] >= 4 * p2 || groups2[i3 + 1] >= 4 * p2)) {
            score2 += PENALTY_FINDERLIKE;
          }
        }
        return score2;
      };
      var n = matrix.length;
      var score = 0, nblacks = 0;
      for (var i2 = 0; i2 < n; ++i2) {
        var row = matrix[i2];
        var groups;
        groups = [0];
        for (var j2 = 0; j2 < n; ) {
          var k;
          for (k = 0; j2 < n && row[j2]; ++k) ++j2;
          groups.push(k);
          for (k = 0; j2 < n && !row[j2]; ++k) ++j2;
          groups.push(k);
        }
        score += evaluategroup(groups);
        groups = [0];
        for (var j2 = 0; j2 < n; ) {
          var k;
          for (k = 0; j2 < n && matrix[j2][i2]; ++k) ++j2;
          groups.push(k);
          for (k = 0; j2 < n && !matrix[j2][i2]; ++k) ++j2;
          groups.push(k);
        }
        score += evaluategroup(groups);
        var nextrow = matrix[i2 + 1] || [];
        nblacks += row[0];
        for (var j2 = 1; j2 < n; ++j2) {
          var p = row[j2];
          nblacks += p;
          if (row[j2 - 1] == p && nextrow[j2] === p && nextrow[j2 - 1] === p) {
            score += PENALTY_TWOBYTWO;
          }
        }
      }
      score += PENALTY_DENSITY * (Math.abs(nblacks / n / n - 0.5) / 0.05 | 0);
      return score;
    };
    var generate = function(data, ver, mode, ecclevel, mask) {
      var v2 = VERSIONS[ver];
      var buf = encode(ver, mode, data, ndatabits(ver, ecclevel) >> 3);
      buf = augumenteccs(buf, v2[1][ecclevel], GF256_GENPOLY[v2[0][ecclevel]]);
      var result = makebasematrix(ver);
      var matrix = result.matrix, reserved = result.reserved;
      putdata(matrix, reserved, buf);
      if (mask < 0) {
        maskdata(matrix, reserved, 0);
        putformatinfo(matrix, reserved, ecclevel, 0);
        var bestmask = 0, bestscore = evaluatematrix(matrix);
        maskdata(matrix, reserved, 0);
        for (mask = 1; mask < 8; ++mask) {
          maskdata(matrix, reserved, mask);
          putformatinfo(matrix, reserved, ecclevel, mask);
          var score = evaluatematrix(matrix);
          if (bestscore > score) {
            bestscore = score;
            bestmask = mask;
          }
          maskdata(matrix, reserved, mask);
        }
        mask = bestmask;
      }
      maskdata(matrix, reserved, mask);
      putformatinfo(matrix, reserved, ecclevel, mask);
      return matrix;
    };
    function generateFrame(data, options) {
      var MODES = {
        "numeric": MODE_NUMERIC,
        "alphanumeric": MODE_ALPHANUMERIC,
        "octet": MODE_OCTET
      };
      var ECCLEVELS = {
        "L": ECCLEVEL_L,
        "M": ECCLEVEL_M,
        "Q": ECCLEVEL_Q,
        "H": ECCLEVEL_H
      };
      options = options || {};
      var ver = options.version || -1;
      var ecclevel = ECCLEVELS[(options.eccLevel || "L").toUpperCase()];
      var mode = options.mode ? MODES[options.mode.toLowerCase()] : -1;
      var mask = "mask" in options ? options.mask : -1;
      if (mode < 0) {
        if (typeof data === "string") {
          if (data.match(NUMERIC_REGEXP)) {
            mode = MODE_NUMERIC;
          } else if (data.match(ALPHANUMERIC_OUT_REGEXP)) {
            mode = MODE_ALPHANUMERIC;
          } else {
            mode = MODE_OCTET;
          }
        } else {
          mode = MODE_OCTET;
        }
      } else if (!(mode == MODE_NUMERIC || mode == MODE_ALPHANUMERIC || mode == MODE_OCTET)) {
        throw "invalid or unsupported mode";
      }
      data = validatedata(mode, data);
      if (data === null) throw "invalid data format";
      if (ecclevel < 0 || ecclevel > 3) throw "invalid ECC level";
      if (ver < 0) {
        for (ver = 1; ver <= 40; ++ver) {
          if (data.length <= getmaxdatalen(ver, mode, ecclevel)) break;
        }
        if (ver > 40) throw "too large data for the Qr format";
      } else if (ver < 1 || ver > 40) {
        throw "invalid Qr version! should be between 1 and 40";
      }
      if (mask != -1 && (mask < 0 || mask > 8)) throw "invalid mask";
      return generate(data, ver, mode, ecclevel, mask);
    }
    function buildCanvas(data, options) {
      var canvas = [];
      var background = options.background || "#fff";
      var foreground = options.foreground || "#000";
      var padding = options.padding || 0;
      var matrix = generateFrame(data, options);
      var n = matrix.length;
      var modSize = Math.floor(options.fit ? options.fit / n : 5);
      var size = n * modSize + modSize * padding * 2;
      var paddingXY = modSize * padding;
      canvas.push({
        type: "rect",
        x: 0,
        y: 0,
        w: size,
        h: size,
        lineWidth: 0,
        color: background
      });
      for (var i2 = 0; i2 < n; ++i2) {
        for (var j2 = 0; j2 < n; ++j2) {
          if (matrix[i2][j2]) {
            canvas.push({
              type: "rect",
              x: modSize * j2 + paddingXY,
              y: modSize * i2 + paddingXY,
              w: modSize,
              h: modSize,
              lineWidth: 0,
              color: foreground
            });
          }
        }
      }
      return {
        canvas,
        size
      };
    }
    function measure(node) {
      var cd = buildCanvas(node.qr, node);
      node._canvas = cd.canvas;
      node._width = node._height = node._minWidth = node._maxWidth = node._minHeight = node._maxHeight = cd.size;
      return node;
    }
    var _default = exports.default = {
      measure
    };
  }
});

export {
  require_qrEnc
};
