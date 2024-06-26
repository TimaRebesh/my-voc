'use client';

import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
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
import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { Input } from '@/components/ui/input';
import { Preloader } from '@/components/ui/preloader';
import { checkLoginCredentials } from '@/lib/actions/user.actions';

enum LoginFormInputs {
  EMAIL = 'email',
  PASSWORD = 'password',
}

const loginFormSchema = z.object({
  [LoginFormInputs.EMAIL]: z
    .string()
    .min(1, { message: 'Required' })
    .email({ message: 'Please enter a valid email address' }),
  [LoginFormInputs.PASSWORD]: z.string().min(1, {
    message: 'Required',
  }),
});

export const LoginForm = () => {
  const form = useForm<z.infer<typeof loginFormSchema>>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      [LoginFormInputs.EMAIL]: '',
      [LoginFormInputs.PASSWORD]: '',
    },
  });

  const [loading, setLoading] = useState(false);

  const onSubmit = async (credentials: z.infer<typeof loginFormSchema>) => {
    setLoading(true);
    const checkResult = await checkLoginCredentials(credentials);

    if (checkResult?.message) {
      if (checkResult.type === LoginFormInputs.EMAIL) {
        form.setError(LoginFormInputs.EMAIL, {
          type: 'required',
          message: checkResult.message,
        });
      } else if (checkResult.type === LoginFormInputs.PASSWORD) {
        form.setError(LoginFormInputs.PASSWORD, {
          type: 'required',
          message: checkResult.message,
        });
      }
      setLoading(false);
      return;
    }

    signIn('credentials', { ...credentials });
  };

  return (
    <section>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-1">
          <FormField
            disabled={loading}
            control={form.control}
            name={LoginFormInputs.EMAIL}
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
            disabled={loading}
            control={form.control}
            name={LoginFormInputs.PASSWORD}
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

          <Button type="submit" className="w-full h-10" disabled={loading}>
            Log in
            {loading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <ArrowRightIcon className="ml-2 h-4" />
            )}
          </Button>
        </form>
      </Form>
      <Preloader isLoading={loading} />
    </section>
  );
};
