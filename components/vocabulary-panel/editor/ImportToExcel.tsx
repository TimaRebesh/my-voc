'use client';
import { Word } from '@/lib/database/models/vocabulary.model';
import { cn, getNewID } from '@/lib/utils';
import { useRef, useState } from 'react';
import * as XLSX from 'xlsx'; // npm install xlsx
import { ExcelButton } from './ExcelButton';

const NOT_VALID_FILE = 'This file is not valid';

export const ImportFromExcel = (props: { setData: (d: Word[]) => void }) => {
  const [fileName, setFileName] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    const files = e.target.files as FileList;
    const reader = new FileReader();
    reader.onload = function (e) {
      const data = e.target?.result;
      let readData = XLSX.read(data, { type: 'binary' });
      const wsname = readData.SheetNames[0];
      const ws = readData.Sheets[wsname];
      /* Convert array to json*/
      const dataParse: string[][] = XLSX.utils.sheet_to_json(ws, { header: 1 });
      if (!isDataValid(dataParse[0])) {
        setFileName(NOT_VALID_FILE);
        props.setData([]);
      } else {
        const formatedData = formatData(dataParse);
        setFileName(files[0].name);
        props.setData(formatedData);
      }
    };
    reader.readAsBinaryString(files[0]);
  };

  const isDataValid = (data: string[]) =>
    data?.length >= 3 &&
    data.slice(0, 3).join('-') === 'original-translated-progress';

  const newId = getNewID();

  const formatData = (data: object[]) =>
    data.reduce((voc: any, item: any, ind) => {
      if (ind === 0) return voc;
      const [original, translated, progress, ...another] = item;
      if (!original || !translated) return voc;
      const word: Word = {
        id: newId + ind,
        original,
        translated,
        another,
        repeated: { translated: 0, original: 0, wrote: 0, prioritized: false },
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
