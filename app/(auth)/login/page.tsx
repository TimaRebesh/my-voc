import { Separator } from '@/components/ui/separator';
import { LoginForm } from './LoginForm';
// import { LoginVariants } from './LoginVariants';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { AppRouterPath } from '@/constants';

export default async function () {
  // const session = await getServerSession();

  // if (session) redirect(AppRouterPath.HOME);

  return (
    <div className="flex min-h-screen justify-center pt-5">
      <div className="mt-10 w-full max-w-md flex flex-col gap-7 p-5">
        <div className="flex justify-center text-4xl tracking-wide text-gray-800">
          <h2 className="font-bold mr-2">Log</h2>
          <span>In</span>
        </div>
        <LoginForm />
        <div className="flex items-center justify-between">
          <Separator className="shrink" />
          <span className="text-sm mx-6 text-gray-400 whitespace-nowrap">
            Or Sign in with
          </span>
          <Separator className="shrink" />
        </div>
        {/* <LoginVariants /> */}
        <p className="text-sm text-gray-400 whitespace-nowrap">
          Created By: <span className="p-semibold-14">Timothy Rebesh</span>
        </p>
      </div>
    </div>
  );
};

