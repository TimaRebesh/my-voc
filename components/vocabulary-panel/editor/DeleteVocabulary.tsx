import { Confirmation } from '@/components/ui/Confirmation';

export const DeleteVocabulary = ({
  name,
  onDelete,
}: {
  name: string;
  onDelete: () => void;
}) => {
  return (
    <Confirmation
      description={`This action cannot be undone. This will permanently delete your '
  ${name}' vocabulary`}
      submitClassName="bg-destructive"
      submitText="Delete"
      onSubmit={onDelete}
    >
      <div className="cursor-pointer text-destructive text-sm">
        Delete vocabulary
      </div>
    </Confirmation>
  );
};
