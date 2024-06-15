'use client';

import { Avatar } from '@/components/avatar/Avatar';
import { PreloaderCircle } from '@/components/preloader-circle/PreloaderCircle';
import { AppRouterPath } from '@/constants';
import { deleteSharedVocabulary } from '@/lib/actions/shared-vocabulary.actions';
import { ISharedVocabulary } from '@/lib/database/models/shared-vocabulary.model';
import { CopyIcon, PlusIcon, Trash2Icon } from 'lucide-react';
import { useState } from 'react';
import { addVocFromLibraryToMyVoc } from '@/lib/actions/vocabulary.actions';
import { Confirmation } from '@/components/ui/Confirmation';
import { useToast } from '@/components/ui/use-toast';

export const CardHeader = ({
  voc,
  userId,
  isUserCreator,
  isUserAdmin
}: {
  voc: ISharedVocabulary;
  userId: string;
  isUserCreator: boolean;
  isUserAdmin: boolean;
}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const addVocToMyVocs = async () => {
    setIsProcessing(true);
    try {
      await addVocFromLibraryToMyVoc(voc._id, userId, AppRouterPath.LIBRARY);
      toast({
        title: 'Vocabulary is added to yours vocabularies list',
        variant: 'success',
      });
    } catch (err) {
    } finally {
      setIsProcessing(false);
    }
  };

  const deleteVoc = async () => {
    try {
      await deleteSharedVocabulary(voc._id, AppRouterPath.LIBRARY);
    } catch (err) { }
  };

  return (
    <>
      <div className="flex justify-between items-start p-2">
        <div className="flex justify-start items-center gap-3">
          <Avatar
            name={voc.creator.creatorName}
            avatar={voc.creator.creatorAvatar}
            size={2}
          />
          <div className="flex flex-col">
            <h3 className="text-sm font-semibold text-gray-900">{voc.name}</h3>
            <p className=" text-gray-500">{voc.creator.creatorName}</p>
          </div>
        </div>

        <div className="add_btn">
          {!isUserCreator &&
            (isProcessing ? (
              <PreloaderCircle />
            ) : (
              <Confirmation
                title="Adding vocabulary"
                description={`This will add '${voc.name}' to yours vocabularies`}
                submitText="Add"
                onSubmit={addVocToMyVocs}
              >
                <CopyIcon width={18} className="text-primary" />
              </Confirmation>
            ))}

          {(isUserCreator || isUserAdmin) && (
            <Confirmation
              title="Delete this vocabulary?"
              description={`This will permanently delete '${voc.name}' from the shared library`}
              submitText="Delete"
              onSubmit={deleteVoc}
              submitClassName="bg-destructive"
            >
              <Trash2Icon width={18} className="text-primary" />
            </Confirmation>
          )}

        </div>
      </div>
      <p className="break-words px-2 ">{voc.description ?? ''}</p>
    </>
  );
};
