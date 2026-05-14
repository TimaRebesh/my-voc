import { CustomButton } from '@/components/ui/custom-button';
import Image from 'next/image';
import { ReactNode } from 'react';

type ExcelButtonProps = {
  text: string;
  onClick: () => void;
  children?: ReactNode;
};

export const ExcelButton = (props: ExcelButtonProps) => {
  return (
    <CustomButton className="w-full" onClick={props.onClick}>
      <>
        <Image
          src="/icons/excel.png"
          alt="excel_image"
          width={22}
          height={22}
          className="object-contain pr-2"
        />
        <span>{props.text}</span>
        {props.children}
      </>
    </CustomButton>
  );
};
