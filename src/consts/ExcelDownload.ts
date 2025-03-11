import * as XLSX from 'xlsx'
import { Notification } from '../components/common/Notification';

export const exportToExcel = <T>(data: T[],columnsName:string[],fileName:string):void => {
      if(data.length === 0){
            Notification('warning','No data to export');
            return;
      }

      const correctFileName = fileName.endsWith('.xlsx') ? fileName : `${fileName}.xlsx`;
      
       /* generate worksheet and workbook */
      const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data);
      const workbook: XLSX.WorkBook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook,worksheet,'Dates');

      /* fix headers */
      XLSX.utils.sheet_add_aoa(worksheet, [columnsName],{origin:"A1"});
      XLSX.writeFile(workbook, correctFileName, {compression:true})

}