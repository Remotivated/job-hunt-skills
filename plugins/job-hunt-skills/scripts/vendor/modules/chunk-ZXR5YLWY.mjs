import { createRequire as __vendorCreateRequire } from "node:module";
import { fileURLToPath as __vendorFileURLToPath } from "node:url";
import { dirname as __vendorDirname } from "node:path";
const require = __vendorCreateRequire(import.meta.url);
const __filename = __vendorFileURLToPath(import.meta.url);
const __dirname = __vendorDirname(__filename);
import {
  GPOSLookup,
  init_GPOS
} from "./chunk-ZXL6CB7G.mjs";
import {
  LookupList,
  init_opentype
} from "./chunk-3W5UVUMY.mjs";
import {
  init_restructure
} from "./chunk-YFRH6662.mjs";
import {
  Struct
} from "./chunk-2FAS3ON4.mjs";
import {
  Pointer
} from "./chunk-ETHVAYUP.mjs";
import {
  StringT
} from "./chunk-CJLFWYXH.mjs";
import {
  ArrayT
} from "./chunk-KM4TAG6K.mjs";
import {
  uint16,
  uint32
} from "./chunk-TXWX2CMZ.mjs";
import {
  __esm
} from "./chunk-FDWSCWK2.mjs";

// node_modules/fontkit/src/tables/JSTF.js
var JstfGSUBModList, JstfPriority, JstfLangSys, JstfLangSysRecord, JstfScript, JstfScriptRecord, JSTF_default;
var init_JSTF = __esm({
  "node_modules/fontkit/src/tables/JSTF.js"() {
    init_restructure();
    init_opentype();
    init_GPOS();
    JstfGSUBModList = new ArrayT(uint16, uint16);
    JstfPriority = new Struct({
      shrinkageEnableGSUB: new Pointer(uint16, JstfGSUBModList),
      shrinkageDisableGSUB: new Pointer(uint16, JstfGSUBModList),
      shrinkageEnableGPOS: new Pointer(uint16, JstfGSUBModList),
      shrinkageDisableGPOS: new Pointer(uint16, JstfGSUBModList),
      shrinkageJstfMax: new Pointer(uint16, new LookupList(GPOSLookup)),
      extensionEnableGSUB: new Pointer(uint16, JstfGSUBModList),
      extensionDisableGSUB: new Pointer(uint16, JstfGSUBModList),
      extensionEnableGPOS: new Pointer(uint16, JstfGSUBModList),
      extensionDisableGPOS: new Pointer(uint16, JstfGSUBModList),
      extensionJstfMax: new Pointer(uint16, new LookupList(GPOSLookup))
    });
    JstfLangSys = new ArrayT(new Pointer(uint16, JstfPriority), uint16);
    JstfLangSysRecord = new Struct({
      tag: new StringT(4),
      jstfLangSys: new Pointer(uint16, JstfLangSys)
    });
    JstfScript = new Struct({
      extenderGlyphs: new Pointer(uint16, new ArrayT(uint16, uint16)),
      // array of glyphs to extend line length
      defaultLangSys: new Pointer(uint16, JstfLangSys),
      langSysCount: uint16,
      langSysRecords: new ArrayT(JstfLangSysRecord, "langSysCount")
    });
    JstfScriptRecord = new Struct({
      tag: new StringT(4),
      script: new Pointer(uint16, JstfScript, { type: "parent" })
    });
    JSTF_default = new Struct({
      version: uint32,
      // should be 0x00010000
      scriptCount: uint16,
      scriptList: new ArrayT(JstfScriptRecord, "scriptCount")
    });
  }
});

export {
  JSTF_default,
  init_JSTF
};
