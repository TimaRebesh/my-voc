'use server';

import Image from 'next/image';
import { UserMenu } from './user-menu/UserMenu';
import Link from 'next/link';
import { ThemeToggle } from './theme-switcher/ThemeToggle';
import { Separator } from '@/components/ui/separator';
import { auth } from '@/utils/authOptions';
import { User } from 'next-auth';
import { redirect } from 'next/navigation';
import { AppRouterPath } from '@/constants';

export async function Header() {
  // const session = await auth();

  // if (!session) redirect(AppRouterPath.LOGIN);

  // const user = session.user;

  return (
    <header className="w-full h-12 text-gray-700 body-font flex justify-between items-center px-4">
      <div className="flex items-center">
        <Link href={AppRouterPath.HOME} className="cursor-pointer">
          <Image src="/images/monday.png" alt="monday" width={40} height={40} />
        </Link>
      </div>

      <div className="flex  items-center space-x-2">
        <ThemeToggle />
        <Separator orientation="vertical" className="mx-2 h-10" />
        {/* <UserMenu user={user as User} /> */}
      </div>
    </header>
  );
}
