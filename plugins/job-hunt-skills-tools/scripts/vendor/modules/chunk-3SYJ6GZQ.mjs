import { createRequire as __vendorCreateRequire } from "node:module";
import { fileURLToPath as __vendorFileURLToPath } from "node:url";
import { dirname as __vendorDirname } from "node:path";
const require = __vendorCreateRequire(import.meta.url);
const __filename = __vendorFileURLToPath(import.meta.url);
const __dirname = __vendorDirname(__filename);
import {
  __esm
} from "./chunk-FDWSCWK2.mjs";

// node_modules/fontkit/src/encodings.js
function getEncoding(platformID, encodingID, languageID = 0) {
  if (platformID === 1 && MAC_LANGUAGE_ENCODINGS[languageID]) {
    return MAC_LANGUAGE_ENCODINGS[languageID];
  }
  return ENCODINGS[platformID][encodingID];
}
function getEncodingMapping(encoding) {
  let cached = encodingCache.get(encoding);
  if (cached) {
    return cached;
  }
  let mapping = MAC_ENCODINGS[encoding];
  if (mapping) {
    let res = /* @__PURE__ */ new Map();
    for (let i = 0; i < mapping.length; i++) {
      res.set(mapping.charCodeAt(i), 128 + i);
    }
    encodingCache.set(encoding, res);
    return res;
  }
  if (SINGLE_BYTE_ENCODINGS.has(encoding)) {
    let decoder = new TextDecoder(encoding);
    let mapping2 = new Uint8Array(128);
    for (let i = 0; i < 128; i++) {
      mapping2[i] = 128 + i;
    }
    let res = /* @__PURE__ */ new Map();
    let s = decoder.decode(mapping2);
    for (let i = 0; i < 128; i++) {
      res.set(s.charCodeAt(i), 128 + i);
    }
    encodingCache.set(encoding, res);
    return res;
  }
}
var SINGLE_BYTE_ENCODINGS, MAC_ENCODINGS, encodingCache, ENCODINGS, MAC_LANGUAGE_ENCODINGS, LANGUAGES;
var init_encodings = __esm({
  "node_modules/fontkit/src/encodings.js"() {
    SINGLE_BYTE_ENCODINGS = /* @__PURE__ */ new Set(["x-mac-roman", "x-mac-cyrillic", "iso-8859-6", "iso-8859-8"]);
    MAC_ENCODINGS = {
      "x-mac-croatian": "\xC4\xC5\xC7\xC9\xD1\xD6\xDC\xE1\xE0\xE2\xE4\xE3\xE5\xE7\xE9\xE8\xEA\xEB\xED\xEC\xEE\xEF\xF1\xF3\xF2\xF4\xF6\xF5\xFA\xF9\xFB\xFC\u2020\xB0\xA2\xA3\xA7\u2022\xB6\xDF\xAE\u0160\u2122\xB4\xA8\u2260\u017D\xD8\u221E\xB1\u2264\u2265\u2206\xB5\u2202\u2211\u220F\u0161\u222B\xAA\xBA\u03A9\u017E\xF8\xBF\xA1\xAC\u221A\u0192\u2248\u0106\xAB\u010C\u2026 \xC0\xC3\xD5\u0152\u0153\u0110\u2014\u201C\u201D\u2018\u2019\xF7\u25CA\uF8FF\xA9\u2044\u20AC\u2039\u203A\xC6\xBB\u2013\xB7\u201A\u201E\u2030\xC2\u0107\xC1\u010D\xC8\xCD\xCE\xCF\xCC\xD3\xD4\u0111\xD2\xDA\xDB\xD9\u0131\u02C6\u02DC\xAF\u03C0\xCB\u02DA\xB8\xCA\xE6\u02C7",
      "x-mac-gaelic": "\xC4\xC5\xC7\xC9\xD1\xD6\xDC\xE1\xE0\xE2\xE4\xE3\xE5\xE7\xE9\xE8\xEA\xEB\xED\xEC\xEE\xEF\xF1\xF3\xF2\xF4\xF6\xF5\xFA\xF9\xFB\xFC\u2020\xB0\xA2\xA3\xA7\u2022\xB6\xDF\xAE\xA9\u2122\xB4\xA8\u2260\xC6\xD8\u1E02\xB1\u2264\u2265\u1E03\u010A\u010B\u1E0A\u1E0B\u1E1E\u1E1F\u0120\u0121\u1E40\xE6\xF8\u1E41\u1E56\u1E57\u027C\u0192\u017F\u1E60\xAB\xBB\u2026 \xC0\xC3\xD5\u0152\u0153\u2013\u2014\u201C\u201D\u2018\u2019\u1E61\u1E9B\xFF\u0178\u1E6A\u20AC\u2039\u203A\u0176\u0177\u1E6B\xB7\u1EF2\u1EF3\u204A\xC2\xCA\xC1\xCB\xC8\xCD\xCE\xCF\xCC\xD3\xD4\u2663\xD2\xDA\xDB\xD9\u0131\xDD\xFD\u0174\u0175\u1E84\u1E85\u1E80\u1E81\u1E82\u1E83",
      "x-mac-greek": "\xC4\xB9\xB2\xC9\xB3\xD6\xDC\u0385\xE0\xE2\xE4\u0384\xA8\xE7\xE9\xE8\xEA\xEB\xA3\u2122\xEE\xEF\u2022\xBD\u2030\xF4\xF6\xA6\u20AC\xF9\xFB\xFC\u2020\u0393\u0394\u0398\u039B\u039E\u03A0\xDF\xAE\xA9\u03A3\u03AA\xA7\u2260\xB0\xB7\u0391\xB1\u2264\u2265\xA5\u0392\u0395\u0396\u0397\u0399\u039A\u039C\u03A6\u03AB\u03A8\u03A9\u03AC\u039D\xAC\u039F\u03A1\u2248\u03A4\xAB\xBB\u2026 \u03A5\u03A7\u0386\u0388\u0153\u2013\u2015\u201C\u201D\u2018\u2019\xF7\u0389\u038A\u038C\u038E\u03AD\u03AE\u03AF\u03CC\u038F\u03CD\u03B1\u03B2\u03C8\u03B4\u03B5\u03C6\u03B3\u03B7\u03B9\u03BE\u03BA\u03BB\u03BC\u03BD\u03BF\u03C0\u03CE\u03C1\u03C3\u03C4\u03B8\u03C9\u03C2\u03C7\u03C5\u03B6\u03CA\u03CB\u0390\u03B0\xAD",
      "x-mac-icelandic": "\xC4\xC5\xC7\xC9\xD1\xD6\xDC\xE1\xE0\xE2\xE4\xE3\xE5\xE7\xE9\xE8\xEA\xEB\xED\xEC\xEE\xEF\xF1\xF3\xF2\xF4\xF6\xF5\xFA\xF9\xFB\xFC\xDD\xB0\xA2\xA3\xA7\u2022\xB6\xDF\xAE\xA9\u2122\xB4\xA8\u2260\xC6\xD8\u221E\xB1\u2264\u2265\xA5\xB5\u2202\u2211\u220F\u03C0\u222B\xAA\xBA\u03A9\xE6\xF8\xBF\xA1\xAC\u221A\u0192\u2248\u2206\xAB\xBB\u2026 \xC0\xC3\xD5\u0152\u0153\u2013\u2014\u201C\u201D\u2018\u2019\xF7\u25CA\xFF\u0178\u2044\u20AC\xD0\xF0\xDE\xFE\xFD\xB7\u201A\u201E\u2030\xC2\xCA\xC1\xCB\xC8\xCD\xCE\xCF\xCC\xD3\xD4\uF8FF\xD2\xDA\xDB\xD9\u0131\u02C6\u02DC\xAF\u02D8\u02D9\u02DA\xB8\u02DD\u02DB\u02C7",
      "x-mac-inuit": "\u1403\u1404\u1405\u1406\u140A\u140B\u1431\u1432\u1433\u1434\u1438\u1439\u1449\u144E\u144F\u1450\u1451\u1455\u1456\u1466\u146D\u146E\u146F\u1470\u1472\u1473\u1483\u148B\u148C\u148D\u148E\u1490\u1491\xB0\u14A1\u14A5\u14A6\u2022\xB6\u14A7\xAE\xA9\u2122\u14A8\u14AA\u14AB\u14BB\u14C2\u14C3\u14C4\u14C5\u14C7\u14C8\u14D0\u14EF\u14F0\u14F1\u14F2\u14F4\u14F5\u1505\u14D5\u14D6\u14D7\u14D8\u14DA\u14DB\u14EA\u1528\u1529\u152A\u152B\u152D\u2026 \u152E\u153E\u1555\u1556\u1557\u2013\u2014\u201C\u201D\u2018\u2019\u1558\u1559\u155A\u155D\u1546\u1547\u1548\u1549\u154B\u154C\u1550\u157F\u1580\u1581\u1582\u1583\u1584\u1585\u158F\u1590\u1591\u1592\u1593\u1594\u1595\u1671\u1672\u1673\u1674\u1675\u1676\u1596\u15A0\u15A1\u15A2\u15A3\u15A4\u15A5\u15A6\u157C\u0141\u0142",
      "x-mac-ce": "\xC4\u0100\u0101\xC9\u0104\xD6\xDC\xE1\u0105\u010C\xE4\u010D\u0106\u0107\xE9\u0179\u017A\u010E\xED\u010F\u0112\u0113\u0116\xF3\u0117\xF4\xF6\xF5\xFA\u011A\u011B\xFC\u2020\xB0\u0118\xA3\xA7\u2022\xB6\xDF\xAE\xA9\u2122\u0119\xA8\u2260\u0123\u012E\u012F\u012A\u2264\u2265\u012B\u0136\u2202\u2211\u0142\u013B\u013C\u013D\u013E\u0139\u013A\u0145\u0146\u0143\xAC\u221A\u0144\u0147\u2206\xAB\xBB\u2026 \u0148\u0150\xD5\u0151\u014C\u2013\u2014\u201C\u201D\u2018\u2019\xF7\u25CA\u014D\u0154\u0155\u0158\u2039\u203A\u0159\u0156\u0157\u0160\u201A\u201E\u0161\u015A\u015B\xC1\u0164\u0165\xCD\u017D\u017E\u016A\xD3\xD4\u016B\u016E\xDA\u016F\u0170\u0171\u0172\u0173\xDD\xFD\u0137\u017B\u0141\u017C\u0122\u02C7",
      "x-mac-romanian": "\xC4\xC5\xC7\xC9\xD1\xD6\xDC\xE1\xE0\xE2\xE4\xE3\xE5\xE7\xE9\xE8\xEA\xEB\xED\xEC\xEE\xEF\xF1\xF3\xF2\xF4\xF6\xF5\xFA\xF9\xFB\xFC\u2020\xB0\xA2\xA3\xA7\u2022\xB6\xDF\xAE\xA9\u2122\xB4\xA8\u2260\u0102\u0218\u221E\xB1\u2264\u2265\xA5\xB5\u2202\u2211\u220F\u03C0\u222B\xAA\xBA\u03A9\u0103\u0219\xBF\xA1\xAC\u221A\u0192\u2248\u2206\xAB\xBB\u2026 \xC0\xC3\xD5\u0152\u0153\u2013\u2014\u201C\u201D\u2018\u2019\xF7\u25CA\xFF\u0178\u2044\u20AC\u2039\u203A\u021A\u021B\u2021\xB7\u201A\u201E\u2030\xC2\xCA\xC1\xCB\xC8\xCD\xCE\xCF\xCC\xD3\xD4\uF8FF\xD2\xDA\xDB\xD9\u0131\u02C6\u02DC\xAF\u02D8\u02D9\u02DA\xB8\u02DD\u02DB\u02C7",
      "x-mac-turkish": "\xC4\xC5\xC7\xC9\xD1\xD6\xDC\xE1\xE0\xE2\xE4\xE3\xE5\xE7\xE9\xE8\xEA\xEB\xED\xEC\xEE\xEF\xF1\xF3\xF2\xF4\xF6\xF5\xFA\xF9\xFB\xFC\u2020\xB0\xA2\xA3\xA7\u2022\xB6\xDF\xAE\xA9\u2122\xB4\xA8\u2260\xC6\xD8\u221E\xB1\u2264\u2265\xA5\xB5\u2202\u2211\u220F\u03C0\u222B\xAA\xBA\u03A9\xE6\xF8\xBF\xA1\xAC\u221A\u0192\u2248\u2206\xAB\xBB\u2026 \xC0\xC3\xD5\u0152\u0153\u2013\u2014\u201C\u201D\u2018\u2019\xF7\u25CA\xFF\u0178\u011E\u011F\u0130\u0131\u015E\u015F\u2021\xB7\u201A\u201E\u2030\xC2\xCA\xC1\xCB\xC8\xCD\xCE\xCF\xCC\xD3\xD4\uF8FF\xD2\xDA\xDB\xD9\uF8A0\u02C6\u02DC\xAF\u02D8\u02D9\u02DA\xB8\u02DD\u02DB\u02C7"
    };
    encodingCache = /* @__PURE__ */ new Map();
    ENCODINGS = [
      // unicode
      ["utf-16be", "utf-16be", "utf-16be", "utf-16be", "utf-16be", "utf-16be", "utf-16be"],
      // macintosh
      // Mappings available at http://unicode.org/Public/MAPPINGS/VENDORS/APPLE/
      // 0	Roman                 17	Malayalam
      // 1	Japanese	            18	Sinhalese
      // 2	Traditional Chinese	  19	Burmese
      // 3	Korean	              20	Khmer
      // 4	Arabic	              21	Thai
      // 5	Hebrew	              22	Laotian
      // 6	Greek	                23	Georgian
      // 7	Russian	              24	Armenian
      // 8	RSymbol	              25	Simplified Chinese
      // 9	Devanagari	          26	Tibetan
      // 10	Gurmukhi	            27	Mongolian
      // 11	Gujarati	            28	Geez
      // 12	Oriya	                29	Slavic
      // 13	Bengali	              30	Vietnamese
      // 14	Tamil	                31	Sindhi
      // 15	Telugu	              32	(Uninterpreted)
      // 16	Kannada
      [
        "x-mac-roman",
        "shift-jis",
        "big5",
        "euc-kr",
        "iso-8859-6",
        "iso-8859-8",
        "x-mac-greek",
        "x-mac-cyrillic",
        "x-mac-symbol",
        "x-mac-devanagari",
        "x-mac-gurmukhi",
        "x-mac-gujarati",
        "Oriya",
        "Bengali",
        "Tamil",
        "Telugu",
        "Kannada",
        "Malayalam",
        "Sinhalese",
        "Burmese",
        "Khmer",
        "iso-8859-11",
        "Laotian",
        "Georgian",
        "Armenian",
        "gbk",
        "Tibetan",
        "Mongolian",
        "Geez",
        "x-mac-ce",
        "Vietnamese",
        "Sindhi"
      ],
      // ISO (deprecated)
      ["ascii", null, "iso-8859-1"],
      // windows
      // Docs here: http://msdn.microsoft.com/en-us/library/system.text.encoding(v=vs.110).aspx
      ["symbol", "utf-16be", "shift-jis", "gb18030", "big5", "euc-kr", "johab", null, null, null, "utf-16be"]
    ];
    MAC_LANGUAGE_ENCODINGS = {
      15: "x-mac-icelandic",
      17: "x-mac-turkish",
      18: "x-mac-croatian",
      24: "x-mac-ce",
      25: "x-mac-ce",
      26: "x-mac-ce",
      27: "x-mac-ce",
      28: "x-mac-ce",
      30: "x-mac-icelandic",
      37: "x-mac-romanian",
      38: "x-mac-ce",
      39: "x-mac-ce",
      40: "x-mac-ce",
      143: "x-mac-inuit",
      146: "x-mac-gaelic"
    };
    LANGUAGES = [
      // unicode
      [],
      {
        // macintosh
        0: "en",
        30: "fo",
        60: "ks",
        90: "rw",
        1: "fr",
        31: "fa",
        61: "ku",
        91: "rn",
        2: "de",
        32: "ru",
        62: "sd",
        92: "ny",
        3: "it",
        33: "zh",
        63: "bo",
        93: "mg",
        4: "nl",
        34: "nl-BE",
        64: "ne",
        94: "eo",
        5: "sv",
        35: "ga",
        65: "sa",
        128: "cy",
        6: "es",
        36: "sq",
        66: "mr",
        129: "eu",
        7: "da",
        37: "ro",
        67: "bn",
        130: "ca",
        8: "pt",
        38: "cz",
        68: "as",
        131: "la",
        9: "no",
        39: "sk",
        69: "gu",
        132: "qu",
        10: "he",
        40: "si",
        70: "pa",
        133: "gn",
        11: "ja",
        41: "yi",
        71: "or",
        134: "ay",
        12: "ar",
        42: "sr",
        72: "ml",
        135: "tt",
        13: "fi",
        43: "mk",
        73: "kn",
        136: "ug",
        14: "el",
        44: "bg",
        74: "ta",
        137: "dz",
        15: "is",
        45: "uk",
        75: "te",
        138: "jv",
        16: "mt",
        46: "be",
        76: "si",
        139: "su",
        17: "tr",
        47: "uz",
        77: "my",
        140: "gl",
        18: "hr",
        48: "kk",
        78: "km",
        141: "af",
        19: "zh-Hant",
        49: "az-Cyrl",
        79: "lo",
        142: "br",
        20: "ur",
        50: "az-Arab",
        80: "vi",
        143: "iu",
        21: "hi",
        51: "hy",
        81: "id",
        144: "gd",
        22: "th",
        52: "ka",
        82: "tl",
        145: "gv",
        23: "ko",
        53: "mo",
        83: "ms",
        146: "ga",
        24: "lt",
        54: "ky",
        84: "ms-Arab",
        147: "to",
        25: "pl",
        55: "tg",
        85: "am",
        148: "el-polyton",
        26: "hu",
        56: "tk",
        86: "ti",
        149: "kl",
        27: "es",
        57: "mn-CN",
        87: "om",
        150: "az",
        28: "lv",
        58: "mn",
        88: "so",
        151: "nn",
        29: "se",
        59: "ps",
        89: "sw"
      },
      // ISO (deprecated)
      [],
      {
        // windows
        1078: "af",
        16393: "en-IN",
        1159: "rw",
        1074: "tn",
        1052: "sq",
        6153: "en-IE",
        1089: "sw",
        1115: "si",
        1156: "gsw",
        8201: "en-JM",
        1111: "kok",
        1051: "sk",
        1118: "am",
        17417: "en-MY",
        1042: "ko",
        1060: "sl",
        5121: "ar-DZ",
        5129: "en-NZ",
        1088: "ky",
        11274: "es-AR",
        15361: "ar-BH",
        13321: "en-PH",
        1108: "lo",
        16394: "es-BO",
        3073: "ar",
        18441: "en-SG",
        1062: "lv",
        13322: "es-CL",
        2049: "ar-IQ",
        7177: "en-ZA",
        1063: "lt",
        9226: "es-CO",
        11265: "ar-JO",
        11273: "en-TT",
        2094: "dsb",
        5130: "es-CR",
        13313: "ar-KW",
        2057: "en-GB",
        1134: "lb",
        7178: "es-DO",
        12289: "ar-LB",
        1033: "en",
        1071: "mk",
        12298: "es-EC",
        4097: "ar-LY",
        12297: "en-ZW",
        2110: "ms-BN",
        17418: "es-SV",
        6145: "ary",
        1061: "et",
        1086: "ms",
        4106: "es-GT",
        8193: "ar-OM",
        1080: "fo",
        1100: "ml",
        18442: "es-HN",
        16385: "ar-QA",
        1124: "fil",
        1082: "mt",
        2058: "es-MX",
        1025: "ar-SA",
        1035: "fi",
        1153: "mi",
        19466: "es-NI",
        10241: "ar-SY",
        2060: "fr-BE",
        1146: "arn",
        6154: "es-PA",
        7169: "aeb",
        3084: "fr-CA",
        1102: "mr",
        15370: "es-PY",
        14337: "ar-AE",
        1036: "fr",
        1148: "moh",
        10250: "es-PE",
        9217: "ar-YE",
        5132: "fr-LU",
        1104: "mn",
        20490: "es-PR",
        1067: "hy",
        6156: "fr-MC",
        2128: "mn-CN",
        3082: "es",
        1101: "as",
        4108: "fr-CH",
        1121: "ne",
        1034: "es",
        2092: "az-Cyrl",
        1122: "fy",
        1044: "nb",
        21514: "es-US",
        1068: "az",
        1110: "gl",
        2068: "nn",
        14346: "es-UY",
        1133: "ba",
        1079: "ka",
        1154: "oc",
        8202: "es-VE",
        1069: "eu",
        3079: "de-AT",
        1096: "or",
        2077: "sv-FI",
        1059: "be",
        1031: "de",
        1123: "ps",
        1053: "sv",
        2117: "bn",
        5127: "de-LI",
        1045: "pl",
        1114: "syr",
        1093: "bn-IN",
        4103: "de-LU",
        1046: "pt",
        1064: "tg",
        8218: "bs-Cyrl",
        2055: "de-CH",
        2070: "pt-PT",
        2143: "tzm",
        5146: "bs",
        1032: "el",
        1094: "pa",
        1097: "ta",
        1150: "br",
        1135: "kl",
        1131: "qu-BO",
        1092: "tt",
        1026: "bg",
        1095: "gu",
        2155: "qu-EC",
        1098: "te",
        1027: "ca",
        1128: "ha",
        3179: "qu",
        1054: "th",
        3076: "zh-HK",
        1037: "he",
        1048: "ro",
        1105: "bo",
        5124: "zh-MO",
        1081: "hi",
        1047: "rm",
        1055: "tr",
        2052: "zh",
        1038: "hu",
        1049: "ru",
        1090: "tk",
        4100: "zh-SG",
        1039: "is",
        9275: "smn",
        1152: "ug",
        1028: "zh-TW",
        1136: "ig",
        4155: "smj-NO",
        1058: "uk",
        1155: "co",
        1057: "id",
        5179: "smj",
        1070: "hsb",
        1050: "hr",
        1117: "iu",
        3131: "se-FI",
        1056: "ur",
        4122: "hr-BA",
        2141: "iu-Latn",
        1083: "se",
        2115: "uz-Cyrl",
        1029: "cs",
        2108: "ga",
        2107: "se-SE",
        1091: "uz",
        1030: "da",
        1076: "xh",
        8251: "sms",
        1066: "vi",
        1164: "prs",
        1077: "zu",
        6203: "sma-NO",
        1106: "cy",
        1125: "dv",
        1040: "it",
        7227: "sms",
        1160: "wo",
        2067: "nl-BE",
        2064: "it-CH",
        1103: "sa",
        1157: "sah",
        1043: "nl",
        1041: "ja",
        7194: "sr-Cyrl-BA",
        1144: "ii",
        3081: "en-AU",
        1099: "kn",
        3098: "sr",
        1130: "yo",
        10249: "en-BZ",
        1087: "kk",
        6170: "sr-Latn-BA",
        4105: "en-CA",
        1107: "km",
        2074: "sr-Latn",
        9225: "en-029",
        1158: "quc",
        1132: "nso"
      }
    ];
  }
});

export {
  getEncoding,
  getEncodingMapping,
  ENCODINGS,
  MAC_LANGUAGE_ENCODINGS,
  LANGUAGES,
  init_encodings
};
