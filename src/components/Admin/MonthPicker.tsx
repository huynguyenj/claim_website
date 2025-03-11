import { DatePicker } from "antd";
import dayjs from "dayjs";

const { RangePicker } = DatePicker;

export function MonthPicker({
  onRangeChange,
}: {
  onRangeChange: (dates: [dayjs.Dayjs, dayjs.Dayjs] | null) => void;
}) {
  return (
    <RangePicker
      picker="month"
      onChange={(dates) =>
        onRangeChange(dates as [dayjs.Dayjs, dayjs.Dayjs] | null)
      }
      defaultValue={[dayjs().startOf("year"), dayjs()]}
    />
  );
}
