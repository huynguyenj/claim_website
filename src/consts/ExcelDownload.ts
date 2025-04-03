import * as XLSX from 'xlsx'
import { Notification } from '../components/common/Notification';
import { formatDataForDownload } from '../utils/format';

export const exportToExcel = <T>(data: T[],columnsName:string[],fileName:string):void => {
      if(data.length === 0){
            Notification('warning','No data to export');
            return;
      }
      console.log(data)
      const finalData: object[] = data.map(item => formatDataForDownload(item));
      console.log(finalData)
      const correctFileName = fileName.endsWith('.xlsx') ? fileName : `${fileName}.xlsx`;
      
       /* generate worksheet and workbook */
      const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(finalData);
      const workbook: XLSX.WorkBook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook,worksheet,'Dates');

      /* fix headers */
      XLSX.utils.sheet_add_aoa(worksheet, [columnsName],{origin:"A1"});
      XLSX.writeFile(workbook, correctFileName, {compression:true})

}