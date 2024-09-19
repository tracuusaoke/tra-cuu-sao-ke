import React from "react";

import { Button, DateRangePicker } from "@nextui-org/react";
import { MdClear } from "react-icons/md";

import type { DateValue, RangeValue } from "@nextui-org/react";

interface DateRangePickerProps {
  label?: string;
  value: RangeValue<DateValue>;
  onChange: (range: RangeValue<DateValue>) => void;
  onReset?: () => void;
}

export const CustomDateRangePicker: React.FC<DateRangePickerProps> = ({
  label = "Select Date Range",
  value,
  onChange,
  onReset,
}) => {
  return (
    <div className="flex items-center space-x-2">
      <DateRangePicker
        label={label}
        className="w-full md:max-w-xs"
        onChange={onChange}
        value={value}
      />
      <Button
        isIconOnly
        color="warning"
        variant="faded"
        onClick={onReset}
        aria-label="Clear date range filter"
      >
        <MdClear />
      </Button>
    </div>
  );
};

// Usage example inside your main component
/*
<CustomDateRangePicker
  value={dateRange}
  onChange={(range) => {
    setDateRange(range);
    requestSearch(searched, range);
  }}
  onReset={() =>
    setDateRange({
      start: parseDate("2024-09-01"),
      end: parseDate("2024-09-10"),
    })
  }
/>
*/
