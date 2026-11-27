import {clearCache} from "@chenglou/pretext";
import {clearPrepareMemo} from "./prepareMemo.js";

export function clearTextCache() {
  clearPrepareMemo();
  clearCache();
}
