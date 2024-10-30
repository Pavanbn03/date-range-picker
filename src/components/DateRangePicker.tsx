import React, { useState, useEffect } from "react";

interface DateRange {
  startDate: Date | null;
  endDate: Date | null;
}

interface PredefinedRange {
  label: string;
  getValue: () => DateRange;
}

interface WeekdayDatePickerProps {
  predefinedRanges?: PredefinedRange[];
  onChange: (result: string[][]) => void;
}

const WeekdayDatePicker: React.FC<WeekdayDatePickerProps> = ({
  predefinedRanges,
  onChange,
}) => {
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [hoverDate, setHoverDate] = useState<Date | null>(null);

  const getWeekendDatesInRange = (start: Date, end: Date): Date[] => {
    const weekends: Date[] = [];
    const current = new Date(start);
    while (current <= end) {
      if (!isWeekday(current)) {
        weekends.push(new Date(current));
      }
      current.setDate(current.getDate() + 1);
    }

    return weekends;
  };

  const isWeekday = (date: Date): boolean => {
    const day = date.getDay();
    return day !== 0 && day !== 6;
  };

  const getDaysInMonth = (month: number, year: number): Date[] => {
    const days: Date[] = [];
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

    for (let i = 0; i < firstDay.getDay(); i++) {
      const date = new Date(year, month, -i);
      days.unshift(date);
    }

    for (let i = 1; i <= lastDay.getDate(); i++) {
      days.push(new Date(year, month, i));
    }

    const remainingDays = 42 - days.length;
    for (let i = 1; i <= remainingDays; i++) {
      days.push(new Date(year, month + 1, i));
    }

    return days;
  };

  const isInRange = (date: Date): boolean => {
    if (!startDate) return false;
    if (!endDate && hoverDate) {
      return date >= startDate && date <= hoverDate;
    }
    return endDate ? date >= startDate && date <= endDate : false;
  };

  const handleDateClick = (date: Date) => {
    if (!isWeekday(date)) return;

    if (!startDate || (startDate && endDate)) {
      setStartDate(date);
      setEndDate(null);
    } else {
      if (date < startDate) {
        setStartDate(date);
      } else {
        setEndDate(date);
      }
    }
  };

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const years = [
    2020, 2021, 2022, 2023, 2024, 2025, 2026, 2027, 2028, 2029, 2030,
  ];

  const weekNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const formatDate = (date: Date) => {
    return date.toISOString().split("T")[0];
  };

  useEffect(() => {
    if (startDate && endDate) {
      const weekends = getWeekendDatesInRange(startDate, endDate);
      const formatedWeekDays = weekends.map(formatDate);
      const result = [
        [formatDate(startDate), formatDate(endDate)],
        formatedWeekDays,
      ];
      onChange(result);
    }
  }, [startDate, endDate, onChange]);

  return (
    <div className="p-6 bg-white rounded-lg drop-shadow-lg w-1/3 max-w-screen-sm">
      <div className="flex justify-between items-center mb-6">
        <button
          onClick={() =>
            setCurrentMonth((prev) => (prev === 0 ? 11 : prev - 1))
          }
          className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded-full transition-colors"
        >
          <span className="transform rotate-180 text-gray-600">›</span>
        </button>

        <div className="flex gap-2">
          <select
            value={currentMonth}
            onChange={(e) => setCurrentMonth(parseInt(e.target.value))}
            className="border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {monthNames.map((month, idx) => (
              <option key={month} value={idx}>
                {month}
              </option>
            ))}
          </select>
          <select
            value={currentYear}
            onChange={(e) => setCurrentYear(parseInt(e.target.value))}
            className="border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {years.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>

        <button
          onClick={() =>
            setCurrentMonth((prev) => (prev === 11 ? 0 : prev + 1))
          }
          className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded-full transition-colors"
        >
          <span className="text-gray-600">›</span>
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1">
        {weekNames.map((day) => (
          <div
            key={day}
            className="text-center text-sm font-medium text-gray-600 py-2"
          >
            {day}
          </div>
        ))}

        {getDaysInMonth(currentMonth, currentYear).map((date, index) => {
          const isCurrentMonthDate = date.getMonth() === currentMonth;
          const isWeekdayDate = isWeekday(date);
          const isSelected =
            (startDate && date.getTime() === startDate.getTime()) ||
            (endDate && date.getTime() === endDate.getTime());
          const isInRangeDate = isInRange(date);

          return (
            <div
              key={index}
              className={`
                relative py-2 text-center text-sm transition-colors
                ${isCurrentMonthDate ? "hover:bg-gray-50" : "text-gray-400"}
                ${
                  !isWeekdayDate
                    ? "text-gray-300 cursor-not-allowed"
                    : "cursor-pointer"
                }
                ${isInRangeDate && isWeekdayDate ? "bg-blue-50" : ""}
                ${
                  isSelected && isWeekdayDate
                    ? "bg-blue-500 text-white hover:bg-blue-600"
                    : ""
                }
                rounded
              `}
              onClick={() => handleDateClick(date)}
              onMouseEnter={() => !endDate && startDate && setHoverDate(date)}
              onMouseLeave={() => setHoverDate(null)}
            >
              {date.getDate()}
            </div>
          );
        })}
      </div>

      {predefinedRanges && (
        <div className="mt-4 border-t pt-4 flex justify-start ">
          {predefinedRanges.map((range, index) => (
            <button
              key={index}
              className="text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded transition-colors"
              onClick={() => {
                const { startDate: start, endDate: end } = range.getValue();
                setStartDate(start);
                setEndDate(end);
              }}
            >
              {range.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default WeekdayDatePicker;
