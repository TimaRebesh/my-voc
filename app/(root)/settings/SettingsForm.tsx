'use client';

import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import {
  AppRouterPath,
  ConfigFields,
  ThemeValues,
  UserFields,
} from '@/constants';
import { User } from 'next-auth';
import { useEffect, useState } from 'react';
// import { updateUser } from '@/lib/actions/user.actions';
import { useSession } from 'next-auth/react';
import { useToast } from '@/components/ui/use-toast';
import { useRouter } from 'next/navigation';
// import { useUploadThing } from '@/lib/uploadthing';
import { handleError } from '@/lib/utils';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { ArrowRightIcon, Loader2 } from 'lucide-react';
import { Input } from '../../../components/ui/input';
import { Preloader } from '../../../components/Preloader/Preloader';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useTheme } from 'next-themes';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

const SettingsFormSchema = z.object({
  [UserFields.AVATAR]: z.string(),
  [UserFields.NAME]: z.string().min(1, {
    message: 'Required',
  }),
  [UserFields.EMAIL]: z
    .string()
    .min(1, { message: 'Required' })
    .email({ message: 'Please enter a valid email address' }),
  [UserFields.PASSWORD]: z.string().min(1, {
    message: 'Required',
  }),
  [ConfigFields.THEME]: z.string(),
  [ConfigFields.MODE_WRITE]: z.boolean()
});


export const SettingsForm = ({ user }: { user: User; }) => {
  console.log(user);
  const { update } = useSession();

  const form = useForm<z.infer<typeof SettingsFormSchema>>({
    resolver: zodResolver(SettingsFormSchema),
    defaultValues: {
      [UserFields.AVATAR]: user.avatar,
      [UserFields.NAME]: user.name!,
      [UserFields.EMAIL]: user.email!,
      [UserFields.PASSWORD]: user.password ?? '',
      [ConfigFields.THEME]: user.configuration.theme,
      [ConfigFields.MODE_WRITE]: user.configuration.modeWrite,
    }
  });

  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const router = useRouter();
  // const { startUpload } = useUploadThing('avatarUploader');
  const { toast } = useToast();
  const isUserMock = user._id === '660e720190b10068a07a558c';

  const { setTheme } = useTheme();

  useEffect(() => {
    setTheme(form.watch(ConfigFields.THEME));
  }, [form.watch(ConfigFields.THEME)]);

  const onSubmit = async (values: z.infer<typeof SettingsFormSchema>) => {
    setSaving(true);

    try {
      const prevUrlAvatar = user[UserFields.AVATAR];
      let uploadedAvatarUrl = prevUrlAvatar;
      // avatar updating
      // if (avatarFile) {
      //   const uploadedAvatar = await startUpload([avatarFile]);

      //   if (!uploadedAvatar) {
      //     return;
      //   }
      //   uploadedAvatarUrl = uploadedAvatar[0].url;
      // }
      // check if avatar value is empty
      if (form.watch(UserFields.AVATAR) === '') {
        uploadedAvatarUrl = '';
      }
      // deleting previous avatar
      const uploadThingUrl = 'https://utfs.io';
      if (prevUrlAvatar?.includes(uploadThingUrl)) {
        const response = await fetch('api/uploadthing', {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            url: prevUrlAvatar,
          }),
        });
        if (!response.ok) {
          throw new Error('Failed to delete value');
        }
      }
      // user updating
      // const result = await updateUser(
      //   {
      //     ...values,
      //     [UserFields.ID]: user[UserFields.ID],
      //     [UserFields.AVATAR]: uploadedAvatarUrl,
      //   },
      //   AppRouterPath.HOME
      // );

      // toast({
      //   title: `${result[UserFields.NAME]} has been updated`,
      // });
      await update();
    } catch (error) {
      handleError(error);
    } finally {
      setSaving(false);
    }

    router.push(AppRouterPath.HOME);
  };

  return (
    <section>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-1">

          {user.password &&
            <>
              <FormField
                disabled={saving}
                control={form.control}
                name={UserFields.EMAIL}
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel className="text-primary">Email</FormLabel>
                    <FormControl>
                      <Input type="email" {...field} />
                    </FormControl>
                    <div className="relative h-4">
                      <FormMessage className="absolute" />
                    </div>
                  </FormItem>
                )}
              />

              <FormField
                disabled={saving}
                control={form.control}
                name={UserFields.PASSWORD}
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel className="text-primary">Password</FormLabel>
                    <FormControl>
                      <Input type="text" {...field} />
                    </FormControl>
                    <div className="relative h-4">
                      <FormMessage className="absolute" />
                    </div>
                  </FormItem>
                )}
              />
            </>}

          <FormField
            disabled={saving}
            control={form.control}
            name={ConfigFields.THEME}
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormLabel>Theme</FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className="flex flex-col space-y-1"
                  >
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value={ThemeValues.LIGHT} />
                      </FormControl>
                      <FormLabel className="font-normal">
                        Light
                      </FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value={ThemeValues.DARK} />
                      </FormControl>
                      <FormLabel className="font-normal">
                        Dark
                      </FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value={ThemeValues.SYSTEM} />
                      </FormControl>
                      <FormLabel className="font-normal">System</FormLabel>
                    </FormItem>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />


          <FormField
            disabled={saving}
            control={form.control}
            name={ConfigFields.MODE_WRITE}
            render={({ field }) => (
              <FormItem className="flex items-center space-x-6">
                <FormLabel className="text-primary">Writing mode</FormLabel>
                <FormControl>
                  <Switch id="airplane-mode"  {...field} />
                </FormControl>
                <div className="relative h-4">
                  <FormMessage className="absolute" />
                </div>
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full h-10" disabled={saving}>
            Log in
            {saving ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <ArrowRightIcon className="ml-2 h-4" />
            )}
          </Button>
        </form>
      </Form>
      <Preloader isLoading={saving} />
    </section>
  );
};
