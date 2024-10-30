import { useState } from "react";
import "./App.css";
import WeekdayDatePicker from "./components/DateRangePicker";

function App() {
  const [dateRanges, setDateRanges] = useState<string[][] | null>(null);

  const getLastDays = (days: number) => {
    const end = new Date(); // Today
    const start = new Date();

    start.setDate(end.getDate() - days);

    return { startDate: start, endDate: end };
  };

  const predefinedRanges = [
    {
      label: "Last 7 Days",
      getValue: () => getLastDays(7),
    },
    {
      label: "Last 30 Days",
      getValue: () => getLastDays(30),
    },
  ];

  const handleDateRangeChange = (result: string[][]) => {
    setDateRanges(result);
  };

  return (
    <div className="grid place-items-center h-screen w-screen">
      <WeekdayDatePicker
        predefinedRanges={predefinedRanges}
        onChange={handleDateRangeChange}
      />

      {dateRanges && (
        <div>
          <p className="font-bold">
            Range:-{" "}
            <span className="font-normal text-blue-500">
              {dateRanges[0].join(" to ")}
            </span>
          </p>
          <p className="font-bold">
            WeekDays:-{" "}
            <span className="font-normal text-blue-500">
              {dateRanges[1].join(", ")}
            </span>
          </p>
        </div>
      )}
    </div>
  );
}

export default App;
