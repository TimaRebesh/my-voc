import { Separator } from '@/components/ui/separator';
import { LoginForm } from './LoginForm';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { AppRouterPath } from '@/constants';
import { ProvidersButtons } from './ProvidersButtons';
import Link from 'next/link';

export default async function () {
  const session = await getServerSession();

  if (session) redirect(AppRouterPath.HOME);

  return (
    <div className="flex min-h-screen justify-center">
      <div className="mt-10 w-full max-w-md flex flex-col gap-7 p-5">
        <div className="flex justify-center text-4xl tracking-wide text-gray-800">
          <h2 className="font-bold mr-2">Log</h2>
          <span>In</span>
        </div>
        <LoginForm />
        <Link href="/register">
          {"Don't have an account?   "}
          <b className="blue_gradient">Register</b>
        </Link>
        <div className="flex items-center justify-between">
          <Separator className="shrink" />
          <span className="text-sm mx-6 text-gray-400 whitespace-nowrap">
            Or Sign in with
          </span>
          <Separator className="shrink" />
        </div>
        <ProvidersButtons />
        <p className="text-sm text-gray-400 whitespace-nowrap">
          Created By: <span className="p-semibold-14">Timothy Rebesh 3</span>
        </p>
      </div>
    </div>
  );
}
