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
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/components/ui/use-toast';
import { uploadThingUrl } from '@/constants';
import { deleteUser } from '@/lib/actions/user.actions';
import { useSession, signOut } from 'next-auth/react';
import React, { useState } from 'react';

export const DeleteUser = React.memo(
  ({
    userId,
    avatar,
    setSaving,
  }: {
    userId: string;
    avatar: string | undefined;
    setSaving: React.Dispatch<React.SetStateAction<boolean>>;
  }) => {
    const [deleteAll, setDeleteAll] = useState(false);
    const { toast } = useToast();
    const { update } = useSession();

    const onDelete = async () => {
      setSaving(true);
      // delete avatar
      if (avatar?.includes(uploadThingUrl)) {
        const response = await fetch('api/uploadthing', {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            url: avatar,
          }),
        });
        if (!response.ok) {
          throw new Error('Failed to delete value');
        }
      }

      // delete user
      await deleteUser(userId, deleteAll);
      await signOut();
      setSaving(false);
      toast({
        title: 'User deleted successfully',
        variant: 'success',
      });
    };

    return (
      <div className="py-10">
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <div className="cursor-pointer text-destructive">Delete user</div>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                Are you absolutely sure?
              </AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete
                your user.
                <span className="flex items-center space-x-2 pt-2">
                  <Checkbox id="terms" checked={deleteAll} onCheckedChange={(v: boolean) => setDeleteAll(v)} />
                  <label
                    htmlFor="terms"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    delete all yours shared vocabularies
                  </label>
                </span>
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction className='bg-destructive' onClick={onDelete}>
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    );
  }
);
