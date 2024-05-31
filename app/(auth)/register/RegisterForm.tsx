'use client';

import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { signIn } from 'next-auth/react';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowRightIcon, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Preloader } from '@/components/preloader/Preloader';
import { createUser } from '@/lib/actions/user.actions';

enum RegisterFormInputs {
  NAME = 'name',
  EMAIL = 'email',
  PASSWORD = 'password',
  CONFIRM_PASSWORD = 'confirmPassword',
}

const registerFormSchema = z.object({
  [RegisterFormInputs.NAME]: z.string().min(4, { message: 'min 4 characters' }),
  [RegisterFormInputs.EMAIL]: z
    .string()
    .min(1, { message: 'Required' })
    .email({ message: 'Please enter a valid email address' }),
  [RegisterFormInputs.PASSWORD]: z.string().min(1, {
    message: 'Required',
  }),
  [RegisterFormInputs.CONFIRM_PASSWORD]: z.string().min(1, {
    message: 'Required',
  }),
});

export function RegisterForm() {
  const form = useForm<z.infer<typeof registerFormSchema>>({
    resolver: zodResolver(registerFormSchema),
    defaultValues: {
      [RegisterFormInputs.NAME]: 'User Test',
      [RegisterFormInputs.EMAIL]: 'test@gmail.com',
      [RegisterFormInputs.PASSWORD]: '1234',
      [RegisterFormInputs.CONFIRM_PASSWORD]: '1234',
    },
  });

  const [submitting, setIsSubmitting] = useState(false);

  const onSubmit = async ({
    name,
    email,
    password,
    confirmPassword,
  }: z.infer<typeof registerFormSchema>) => {
    setIsSubmitting(true);
    if (password !== confirmPassword) {
      form.setError(RegisterFormInputs.CONFIRM_PASSWORD, {
        type: 'required',
        message: 'passwords do not match',
      });
      return;
    }

    const result = await createUser({ name, password, email });

    if (result.message) {
      if (result.type === 'email') {
        form.setError(RegisterFormInputs.EMAIL, {
          type: 'required',
          message: result.message,
        });
      }
      setIsSubmitting(false);
      return;
    }

    await signIn('credentials', {
      email: result.email,
      password: result.password,
    });
  };

  return (
    <section className="w-full max-w-full flex-center flex-col">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-1">
          <FormField
            disabled={submitting}
            control={form.control}
            name={RegisterFormInputs.NAME}
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel className="text-primary">Name</FormLabel>
                <FormControl>
                  <Input type="text" {...field} />
                </FormControl>
                <div className="relative h-4">
                  <FormMessage className="absolute" />
                </div>
              </FormItem>
            )}
          />

          <FormField
            disabled={submitting}
            control={form.control}
            name={RegisterFormInputs.EMAIL}
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
            disabled={submitting}
            control={form.control}
            name={RegisterFormInputs.PASSWORD}
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

          <FormField
            disabled={submitting}
            control={form.control}
            name={RegisterFormInputs.CONFIRM_PASSWORD}
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel className="text-primary">Confirm password</FormLabel>
                <FormControl>
                  <Input type="text" {...field} />
                </FormControl>
                <div className="relative h-4">
                  <FormMessage className="absolute" />
                </div>
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full h-10" disabled={submitting}>
            Register
            {submitting ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <ArrowRightIcon className="ml-2 h-4" />
            )}
          </Button>
        </form>
      </Form>
      <Preloader isLoading={submitting} />
    </section>
  );
}
