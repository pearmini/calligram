import * as cm from "../../src/index.js";
import {pathCircle, renderPretext} from "../helpers.js";

export function pretextCirclePathBreak() {
  const layout = cm.layoutTextInPath({
    text: "AGI 春天到了",
    fontSize: 16,
    fontFamily: "Inter",
    path: pathCircle(200, 150, 100),
    repeat: false,
  });
  return renderPretext(layout);
}
