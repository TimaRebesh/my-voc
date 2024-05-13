import { Word } from "@/lib/database/models/vocabulary.model";
import { getWordProgress } from "@/lib/utils";
import * as XLSX from "xlsx"; // npm install xlsx
import { ExcelButton } from "./ExcelButton";

type ExportToExcelProps = {
  vocName: string;
  list: Word[];
};

export const ExportToExcel = (props: ExportToExcelProps) => {

  const getFormatedData = () =>
    props.list.map(w => {
      const data: any = {
        original: w.original,
        translated: w.translated,
        progress: getWordProgress(w),
      };
      w.another.forEach((an, count) => {
        data['other_' + (count + 1)] = an;
      });
      return data;
    });


  const exportToCSV = (data: object[]) => {
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = { Sheets: { data: ws }, SheetNames: ["data"] };
    XLSX.writeFile(wb, props.vocName.concat('.xlsx'));
  };

  return <ExcelButton text='Export to excel' onClick={() => exportToCSV(getFormatedData())} />;
};