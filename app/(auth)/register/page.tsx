import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { AppRouterPath } from '@/constants';
import Link from 'next/link';
import { RegisterForm } from './RegisterForm';

export default async function () {
  const session = await getServerSession();

  if (session) redirect(AppRouterPath.HOME);

  return (
    <div className="flex min-h-screen justify-center">
      <div className="mt-10 w-full max-w-md flex flex-col gap-7 p-5">
        <div className="flex justify-center text-4xl tracking-wide text-gray-800">
          <h2 className="font-bold mr-2">Register</h2>
        </div>
        <RegisterForm />
        <Link href="/login">
          {'Have an account?   '}
          <b className="blue_gradient">LogIn</b>
        </Link>

        <p className="text-sm text-gray-400 whitespace-nowrap">
          Created By: <span className="p-semibold-14">Timothy Rebesh</span>
        </p>
      </div>
    </div>
  );
}
