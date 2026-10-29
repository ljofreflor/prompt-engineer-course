import type { Slide } from "../../lib/slides";
import { slides as s08u01 } from "./08-genai-llms/u01";
import { slides as s09u01 } from "./09-prompt-engineering/u01";
import { slides as s09u02 } from "./09-prompt-engineering/u02";
import { slides as s09u04 } from "./09-prompt-engineering/u04";
import { slides as s10u01 } from "./10-diseno-sistemas-ia/u01";
import { slides as s11u01 } from "./11-aiops-cloud/u01";

const overrides: Record<string, Slide[]> = {
  "08-genai-llms/u01": s08u01,
  "09-prompt-engineering/u01": s09u01,
  "09-prompt-engineering/u02": s09u02,
  "09-prompt-engineering/u04": s09u04,
  "10-diseno-sistemas-ia/u01": s10u01,
  "11-aiops-cloud/u01": s11u01,
};

export function getSlideOverride(courseSlug: string, unitId: string): Slide[] | undefined {
  return overrides[`${courseSlug}/${unitId}`];
}
