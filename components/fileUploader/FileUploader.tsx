'use client';

import { useCallback } from 'react';
import { useDropzone } from '@uploadthing/react/hooks';
import { generateClientDropzoneAccept } from 'uploadthing/client';

import { convertFileToUrl } from '@/lib/utils';
import { UploadIcon, Trash2Icon } from 'lucide-react';
import { CustomAvatar } from '@/components/ui/custom-avatar';
import { TooltipWrapper } from '@/components/ui/tooltip-wrapper';
import { useToast } from '@/components/ui/use-toast';

interface FileUploaderProps {
  imageUrl?: string;
  onFieldChange: (url: string) => void;
  onSetValues?: (v: File | null) => void;
}

export function FileUploader({
  imageUrl,
  onFieldChange,
  onSetValues,
}: FileUploaderProps) {
  const { toast } = useToast();

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) {
      toast({
        title: 'You can choose only one file',
      });
      return;
    }
    if (acceptedFiles[0].size >= 1048576) {
      // 1 MB in bytes
      toast({
        title: 'File size should not exceed 1 MB',
      });
      return;
    }
    onSetValues && onSetValues(acceptedFiles[0]);
    onFieldChange(convertFileToUrl(acceptedFiles[0]));
  }, []);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: 'image/*' ? generateClientDropzoneAccept(['image/*']) : undefined,
    maxFiles: 1,
    multiple: false,
  });

  const onClean = async (e: React.MouseEvent<SVGSVGElement, MouseEvent>) => {
    e.stopPropagation();
    onFieldChange('');
    onSetValues && onSetValues(null);
  };

  return (
    <div
      {...getRootProps()}
      className="flex justify-center items-center h-60 flex-col mb-8 relative"
    >
      <input {...getInputProps()} className="cursor-pointer" />

      <CustomAvatar
        src={imageUrl}
        size={14}
        fallback={
          <div className="flex opacity-50">
            <UploadIcon className="w-4 h-4" />
            <div className="ml-2 text-xs">SVG, PNG, JPG</div>
          </div>
        }
      />

      <TooltipWrapper text="remove image">
        <Trash2Icon
          className="absolute top-[-32px] right-0 w-5 h-5 m-2"
          onClick={onClean}
        />
      </TooltipWrapper>
    </div>
  );
}
