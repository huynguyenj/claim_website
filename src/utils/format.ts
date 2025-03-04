import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
dayjs.extend(utc); 
dayjs.extend(timezone);

export const formatDate = (date:Date):string =>{
      const utcDate = dayjs.utc(date).tz("Asia/Bangkok").format('DD MM YYYY');
      return utcDate;
}