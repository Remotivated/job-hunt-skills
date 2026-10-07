import { createRequire as __vendorCreateRequire } from "node:module";
import { fileURLToPath as __vendorFileURLToPath } from "node:url";
import { dirname as __vendorDirname } from "node:path";
const require = __vendorCreateRequire(import.meta.url);
const __filename = __vendorFileURLToPath(import.meta.url);
const __dirname = __vendorDirname(__filename);
import {
  init_VersionedStruct
} from "./chunk-DCBC6YOO.mjs";
import {
  init_Struct
} from "./chunk-2FAS3ON4.mjs";
import {
  init_Enum
} from "./chunk-BNQ6KEAD.mjs";
import {
  init_LazyArray
} from "./chunk-KW2FFRNO.mjs";
import {
  init_Optional
} from "./chunk-VTOYGDRI.mjs";
import {
  init_Pointer
} from "./chunk-ETHVAYUP.mjs";
import {
  init_Reserved
} from "./chunk-TSASLJV5.mjs";
import {
  init_String
} from "./chunk-CJLFWYXH.mjs";
import {
  init_Array
} from "./chunk-KM4TAG6K.mjs";
import {
  init_Bitfield
} from "./chunk-SPZOCPRY.mjs";
import {
  init_Boolean
} from "./chunk-TZLQ4SKB.mjs";
import {
  init_Buffer
} from "./chunk-FXNCBV2B.mjs";
import {
  init_utils
} from "./chunk-5AJOID3U.mjs";
import {
  init_Number
} from "./chunk-TXWX2CMZ.mjs";
import {
  init_EncodeStream
} from "./chunk-O372ZRV6.mjs";
import {
  init_DecodeStream
} from "./chunk-32NVCR7Y.mjs";
import {
  __esm
} from "./chunk-FDWSCWK2.mjs";

// node_modules/restructure/index.js
var init_restructure = __esm({
  "node_modules/restructure/index.js"() {
    init_EncodeStream();
    init_DecodeStream();
    init_Array();
    init_LazyArray();
    init_Bitfield();
    init_Boolean();
    init_Buffer();
    init_Enum();
    init_Optional();
    init_Reserved();
    init_String();
    init_Struct();
    init_VersionedStruct();
    init_utils();
    init_Number();
    init_Pointer();
  }
});

export {
  init_restructure
};
