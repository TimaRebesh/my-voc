'use client';

import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import {
  AppRouterPath,
  ConfigFields,
  ThemeValues,
  UserFields,
  uploadThingUrl,
} from '@/constants';
import { User } from 'next-auth';
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useToast } from '@/components/ui/use-toast';
import { useRouter } from 'next/navigation';
import { cn, handleError } from '@/lib/utils';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { ArrowRightIcon, Loader2 } from 'lucide-react';
import { Input } from '../../../components/ui/input';
import { Preloader } from '../../../components/Preloader/Preloader';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useTheme } from 'next-themes';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { FileUploader } from '@/components/fileUploader/FileUploader';
import { useUploadThing } from '@/lib/uploadthing';
import { updateUser } from '@/lib/actions/user.actions';
import { Separator } from '@/components/ui/separator';
import { DeleteUser } from './DeleteUser';

const SettingsFormSchema = z.object({
  [UserFields.AVATAR]: z.string(),
  [UserFields.NAME]: z.string().min(1, {
    message: 'Required',
  }),
  [UserFields.EMAIL]: z
    .string()
    .min(1, { message: 'Required' })
    .email({ message: 'Please enter a valid email address' }),
  [UserFields.PASSWORD]: z.string(),
  [ConfigFields.THEME]: z.union([
    z.literal(ThemeValues.DARK),
    z.literal(ThemeValues.LIGHT),
    z.literal(ThemeValues.SYSTEM),
  ]),
  [ConfigFields.MODE_WRITE]: z.boolean(),
  [ConfigFields.HINTS]: z.boolean(),
  [ConfigFields.LIMIT_ALL]: z.number(),
  [ConfigFields.LIMIT_NEW]: z.number(),
});

export const SettingsForm = ({ user }: { user: User; }) => {
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
      [ConfigFields.HINTS]: user.configuration.hints,
      [ConfigFields.LIMIT_ALL]: user.configuration.limitAll,
      [ConfigFields.LIMIT_NEW]: user.configuration.limitNew,
    },
  });

  const [saving, setSaving] = useState(false);
  const router = useRouter();
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const { startUpload } = useUploadThing('avatarUploader');
  const { toast } = useToast();

  const { setTheme } = useTheme();

  useEffect(() => {
    return () => {
      if (user.configuration.theme !== form.watch(ConfigFields.THEME))
        setTheme(user.configuration.theme);
    };
  }, []);

  useEffect(() => {
    setTheme(form.watch(ConfigFields.THEME));
  }, [form.watch(ConfigFields.THEME)]);

  const onSubmit = async (values: z.infer<typeof SettingsFormSchema>) => {
    if (user.password && values[UserFields.PASSWORD].length < 4) {
      form.setError(UserFields.PASSWORD, {
        type: 'required',
        message: 'password must include at least 4 characters',
      });
      return;
    }

    setSaving(true);

    try {
      const prevUrlAvatar = user[UserFields.AVATAR];
      let uploadedAvatarUrl = prevUrlAvatar;
      // avatar updating
      if (avatarFile) {
        const uploadedAvatar = await startUpload([avatarFile]);

        if (!uploadedAvatar) {
          return;
        }
        uploadedAvatarUrl = uploadedAvatar[0].url;
      }
      // check if avatar value is empty
      if (form.watch(UserFields.AVATAR) === '') {
        uploadedAvatarUrl = '';
      }
      // deleting previous avatar
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
      const result = await updateUser(
        {
          ...user,
          [UserFields.AVATAR]: uploadedAvatarUrl,
          [UserFields.NAME]: values[UserFields.NAME],
          [UserFields.EMAIL]: values[UserFields.EMAIL],
          [UserFields.PASSWORD]: values[UserFields.PASSWORD],
          [UserFields.CONFIGURATION]: {
            ...user[UserFields.CONFIGURATION],
            [ConfigFields.THEME]: values[ConfigFields.THEME],
            [ConfigFields.MODE_WRITE]: values[ConfigFields.MODE_WRITE],
            [ConfigFields.HINTS]: values[ConfigFields.HINTS],
            [ConfigFields.LIMIT_ALL]: values[ConfigFields.LIMIT_ALL],
            [ConfigFields.LIMIT_NEW]: values[ConfigFields.LIMIT_NEW],
          },
        },
        AppRouterPath.SETTINGS
      );

      toast({
        title: `${result[UserFields.NAME]} has been updated`,
        variant: 'success',
      });
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
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-5 mx-5 pt-4"
        >
          <FormField
            disabled={saving}
            control={form.control}
            name={UserFields.AVATAR}
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel className="text-primary">Avatar</FormLabel>
                <FormControl>
                  <FileUploader
                    onFieldChange={field.onChange}
                    imageUrl={field.value}
                    onSetValues={setAvatarFile}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            disabled={saving}
            control={form.control}
            name={UserFields.NAME}
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel className="text-primary">Name</FormLabel>
                <FormControl>
                  <Input type="text" {...field} />
                </FormControl>
                <div className="relative">
                  <FormMessage className="absolute" />
                </div>
              </FormItem>
            )}
          />

          {user.password && (
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
                    <div className="relative">
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
                    <div className="relative">
                      <FormMessage className="absolute" />
                    </div>
                  </FormItem>
                )}
              />
            </>
          )}

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
                      <FormLabel className="font-normal">Light</FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value={ThemeValues.DARK} />
                      </FormControl>
                      <FormLabel className="font-normal">Dark</FormLabel>
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
              <FormItem className="flex items-center justify-between">
                <FormLabel className="text-primary">Writing mode</FormLabel>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            disabled={saving}
            control={form.control}
            name={ConfigFields.HINTS}
            render={({ field }) => (
              <FormItem className="flex items-center justify-between">
                <FormLabel className="text-primary">Show hints</FormLabel>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            disabled={saving}
            control={form.control}
            name={ConfigFields.LIMIT_ALL}
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <div className="flex justify-between">
                  <FormLabel className="text-primary">Repeat words</FormLabel>
                  <FormLabel className="text-primary text-x">
                    {field.value}
                  </FormLabel>
                </div>
                <FormControl>
                  <Slider
                    defaultValue={[field.value]}
                    max={50}
                    min={5}
                    step={1}
                    onValueChange={(v) => field.onChange(v[0])}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            disabled={saving}
            control={form.control}
            name={ConfigFields.LIMIT_NEW}
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <div className="flex justify-between">
                  <FormLabel className="text-primary">
                    Study new words
                  </FormLabel>
                  <FormLabel className="text-primary text-x">
                    {field.value}
                  </FormLabel>
                </div>
                <FormControl>
                  <Slider
                    defaultValue={[field.value]}
                    max={50}
                    min={1}
                    step={1}
                    onValueChange={(v) => field.onChange(v[0])}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <div className="py-10">
            <Button type="submit" className="w-40 h-10" disabled={saving}>
              Save
              {saving ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <ArrowRightIcon className="ml-2 h-4" />
              )}
            </Button>
          </div>

          <Separator />

          <DeleteUser
            setSaving={setSaving}
            userId={user._id as string}
            avatar={user[UserFields.AVATAR]}
          />
        </form>
      </Form>
      <Preloader isLoading={saving} />
    </section>
  );
};
