'use client';
import { Word } from '@/lib/database/models/vocabulary.model';
import { cn } from '@/lib/utils';
import { useRef, useState } from 'react';
import * as XLSX from "xlsx"; // npm install xlsx
import { ExcelButton } from './ExcelButton';

const NOT_VALID_FILE = 'This file is not valid';

export const ImportFromExcel = (props: { setData: (d: Word[]) => void; }) => {

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
      }
      else {
        const formatedData = formatData(dataParse);
        setFileName(files[0].name);
        props.setData(formatedData);
      }
    };
    reader.readAsBinaryString(files[0]);
  };

  const isDataValid = (data: string[]) =>
    (data?.length >= 3) && (data.slice(0, 3).join('-') === 'original-translated-progress');


  const formatData = (data: object[]) =>
    data.reduce((voc: any, item: any, ind) => {
      if (ind === 0)
        return voc;
      const [original, translated, progress, ...another] = item;
      if (!original || !translated)
        return voc;
      const word: Word = {
        id: ind.toString(),
        original,
        translated,
        another,
        repeated: setPropgress(progress),
        lastRepeat: 1
      };
      return [...voc, word];
    }, []);

  const setPropgress = (propgress: number) => {
    let translated = 0;
    let original = 0;
    let wrote = 0;
    const res = propgress % 3;
    switch (res) {
      case (0): {
        const value = propgress / 3;
        original = value;
        translated = value;
        wrote = value;
        break;
      }
      case (1): {
        const value = Math.trunc(propgress / 3);
        original = value;
        translated = value + 1;
        wrote = value;
        break;
      }
      case (2): {
        const value = Math.trunc(propgress / 3);
        original = value + 1;
        translated = value + 1;
        wrote = value;
        break;
      }
    }
    return { translated, original, wrote };
  };

  return <>
    <ExcelButton text='Import from excel' onClick={() => inputRef.current?.click()} >
      <input
        type='file'
        ref={inputRef}
        accept='.xlsx'
        style={{ display: 'none' }}
        onChange={(e) => handleUpload(e)}
      />
    </ExcelButton>
    <div className={cn('text-sm overflow-hidden overflow-ellipsis',
      fileName === NOT_VALID_FILE ? 'text-red-800' : '')
    }>{fileName && fileName}</div >
  </>;
};
