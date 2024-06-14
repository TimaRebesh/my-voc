import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { cn } from '@/lib/utils';

export const Confirmation = ({
  title = 'Are you absolutely sure?',
  description = '',
  cancelText = 'Cancel',
  submitText = 'Submit',
  submitClassName = '',
  onSubmit,
  children,
}: {
  title?: string;
  description?: string | JSX.Element;
  cancelText?: string;
  submitText?: string;
  submitClassName?: string;
  onSubmit: () => void;
  children: JSX.Element;
}) => {
  return (
    <div className="py-10">
      <AlertDialog>
        <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{title}</AlertDialogTitle>
            <AlertDialogDescription>{description}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex flex-row justify-center items-center gap-2">
            <AlertDialogCancel className="min-w-24">
              {cancelText}
            </AlertDialogCancel>
            <AlertDialogAction
              className={cn('min-w-24', submitClassName)}
              onClick={onSubmit}
            >
              {submitText}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
