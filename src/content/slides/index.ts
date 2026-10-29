import type { Slide } from "../../lib/slides";
import { slides as s09u01 } from "./09-prompt-engineering/u01";

const overrides: Record<string, Slide[]> = {
  "09-prompt-engineering/u01": s09u01,
};

export function getSlideOverride(courseSlug: string, unitId: string): Slide[] | undefined {
  return overrides[`${courseSlug}/${unitId}`];
}
