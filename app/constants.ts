import { parseDate } from "@internationalized/date";

import type { DateValue, RangeValue } from "@nextui-org/react";

export const DEFAULT_DATE_RANGE: RangeValue<DateValue> = {
  start: parseDate("2024-09-01"),
  end: parseDate("2024-09-30"),
};
