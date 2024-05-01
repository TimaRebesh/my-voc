
import { UserMenu } from '@/components/Header/user-menu/UserMenu';
import Link from 'next/link';
import { ThemeToggle } from './theme-switcher/ThemeToggle';
import { Separator } from '@/components/ui/separator';
import { auth } from '@/utils/authOptions';
import { User } from 'next-auth';
import { redirect } from 'next/navigation';
import { AppRouterPath } from '@/constants';


export async function Header() {
  const session = await auth();

  if (!session) redirect(AppRouterPath.LOGIN);

  const user = session.user;

  return (
    <header className="w-full h-12 text-gray-700 body-font flex justify-between items-center px-4">
      <div className="flex items-center">
        <Link href={AppRouterPath.HOME} className="cursor-pointer">
          {user.name}
        </Link>
      </div>

      <div className="flex  items-center space-x-2">
        <ThemeToggle />
        {/* <Separator orientation="vertical" className="mx-2 h-10" /> */}
        {/* <UserMenu serverUser={session} /> */}
        <UserMenu />

      </div>
    </header>
  );
}
