import { CustomButton } from "@/components/ui/custom-button";
import Image from "next/image";

type ExcelButtonProps = {
  text: string;
  onClick: () => void;
  children?: JSX.Element;
};

export const ExcelButton = (props: ExcelButtonProps) => {
  return (
    <CustomButton className='w-full' onClick={props.onClick}>
      <>
        <Image
          src="/icons/excel.png"
          alt='excel_image'
          width={22}
          height={22}
          className='object-contain pr-2'
        />
        <span>{props.text}</span>
        {props.children}
      </>
    </CustomButton>
  );
};