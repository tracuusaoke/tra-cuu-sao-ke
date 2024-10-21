import type React from 'react';
import { useState } from 'react';

import { parseDate } from '@internationalized/date';

import type { DateValue, RangeValue } from '@nextui-org/react';

import { CustomDateRangePicker } from './DateRangePicker'; // Assuming you saved the DateRangePicker component

const DateRangePickerDemo: React.FC = () => {
  // Initial date range
  const [dateRange, setDateRange] = useState<RangeValue<DateValue>>({
    start: parseDate('2024-09-01'),
    end: parseDate('2024-09-10')
  });

  const handleDateRangeChange = (newRange: RangeValue<DateValue>) => {
    setDateRange(newRange);
  };

  const resetDateRange = () => {
    setDateRange({
      start: parseDate('2024-09-01'),
      end: parseDate('2024-09-10')
    });
  };

  return (
    <div>
      <h2>Select a Date Range</h2>
      <CustomDateRangePicker value={dateRange} onChange={handleDateRangeChange} onReset={resetDateRange} />

      <div className='mt-4'>
        <h3>Selected Date Range:</h3>
        <p>
          Start Date: {dateRange.start.toString()} <br />
          End Date: {dateRange.end.toString()}
        </p>
      </div>
    </div>
  );
};

export default DateRangePickerDemo;
