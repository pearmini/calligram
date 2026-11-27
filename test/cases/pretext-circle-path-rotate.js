import * as cm from "../../src/index.js";
import {pathCircle, renderPretext} from "../helpers.js";

export function pretextCirclePathRotate() {
  const layout = cm.layoutTextInPath({
    text: "AGI 春天到了",
    fontSize: 16,
    fontFamily: "Inter",
    path: pathCircle(200, 200, 100),
    angle: 45,
  });
  return renderPretext(layout);
}
