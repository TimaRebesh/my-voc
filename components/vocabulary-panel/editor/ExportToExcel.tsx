'use client';

import { Word } from '@/lib/database/models/vocabulary.model';
import { getWordProgress } from '@/lib/utils';
import { ExcelButton } from './ExcelButton';

type ExportToExcelProps = {
  vocName: string;
  list: Word[];
};

export const ExportToExcel = (props: ExportToExcelProps) => {
  const getFormatedData = () =>
    props.list.map((w) => {
      const data: Record<string, string | number> = {
        original: w.original,
        translated: w.translated,
        progress: getWordProgress(w),
      };

      w.another.forEach((an, count) => {
        data['other_' + (count + 1)] = an;
      });

      return data;
    });

  const exportToExcel = async (data: Record<string, string | number>[]) => {
    const ExcelJS = await import('exceljs');
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('data');

    const headers = Array.from(
      data.reduce((keys, item) => {
        Object.keys(item).forEach((key) => keys.add(key));
        return keys;
      }, new Set<string>())
    );

    worksheet.addRow(headers);

    data.forEach((item) => {
      worksheet.addRow(headers.map((header) => item[header] ?? ''));
    });

    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });

    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');

    link.href = url;
    link.download = props.vocName.concat('.xlsx');
    link.click();

    window.URL.revokeObjectURL(url);
  };

  return (
    <ExcelButton
      text="Export to excel"
      onClick={() => exportToExcel(getFormatedData())}
    />
  );
};
