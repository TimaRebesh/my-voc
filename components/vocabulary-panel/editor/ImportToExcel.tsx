'use client';

import { Word } from '@/lib/database/models/vocabulary.model';
import { cn, getNewID } from '@/lib/utils';
import { useRef, useState } from 'react';
import { ExcelButton } from './ExcelButton';

const NOT_VALID_FILE = 'This file is not valid';

export const ImportFromExcel = (props: { setData: (d: Word[]) => void; }) => {
  const [fileName, setFileName] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();

    const files = e.target.files;

    if (!files?.[0]) return;

    const buffer = await files[0].arrayBuffer();
    const ExcelJS = await import('exceljs');
    const workbook = new ExcelJS.Workbook();

    await workbook.xlsx.load(buffer);

    const worksheet = workbook.worksheets[0];

    if (!worksheet) {
      setFileName(NOT_VALID_FILE);
      props.setData([]);
      return;
    }

    const rows: unknown[][] = [];

    worksheet.eachRow((row) => {
      const values = Array.isArray(row.values) ? row.values.slice(1) : [];
      rows.push(values);
    });

    if (!isDataValid(rows[0])) {
      setFileName(NOT_VALID_FILE);
      props.setData([]);
      return;
    }

    const formatedData = formatData(rows);

    setFileName(files[0].name);
    props.setData(formatedData);
  };

  const isDataValid = (data: unknown[] = []) =>
    data.length >= 3 &&
    data.slice(0, 3).join('-') === 'original-translated-progress';

  const newId = getNewID();

  const formatData = (data: unknown[][]) =>
    data.reduce<Word[]>((voc, item, ind) => {
      if (ind === 0) return voc;

      const [original, translated, progress, ...another] = item;

      if (!original || !translated) return voc;

      const word: Word = {
        id: newId + ind,
        original: String(original),
        translated: String(translated),
        another: another.filter(Boolean).map(String),
        repeated: {
          translated: 0,
          original: 0,
          wrote: 0,
          prioritized: false,
        },
        lastRepeat: 1,
      };

      return [...voc, word];
    }, []);

  return (
    <>
      <ExcelButton
        text="Import from excel"
        onClick={() => inputRef.current?.click()}
      >
        <input
          type="file"
          ref={inputRef}
          accept=".xlsx"
          style={{ display: 'none' }}
          onChange={(e) => handleUpload(e)}
        />
      </ExcelButton>

      <div
        className={cn(
          'text-sm overflow-hidden overflow-ellipsis',
          fileName === NOT_VALID_FILE ? 'text-red-800' : ''
        )}
      >
        {fileName && fileName}
      </div>
    </>
  );
};
