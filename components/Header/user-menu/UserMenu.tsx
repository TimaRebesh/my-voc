'use client';

import {
  InfoIcon,
  LogOutIcon,
  LucideIcon,
  SettingsIcon,
  LibraryBigIcon,
  BookIcon,
} from 'lucide-react';
import Link from 'next/link';
import { IUser } from '@/lib/database/models/user.model';
import { signOut } from 'next-auth/react';
import { AppRouterPath, ThemeValues } from '@/constants';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Separator } from '@/components/ui/separator';
import { useTheme } from 'next-themes';
import { useEffect } from 'react';
import { Avatar } from '@/components/avatar/Avatar';

export const UserMenu = ({ user }: { user: IUser; }) => {
  const { setTheme } = useTheme();

  useEffect(() => {
    user && setTheme(user.configuration.theme);
  }, [user]);

  const onLogout = async (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.stopPropagation();
    await signOut();
    setTheme(ThemeValues.SYSTEM);
  };

  return (
    <Sheet>
      <SheetTrigger>
        <Avatar name={user.name} avatar={user.avatar} size={2} />
      </SheetTrigger>
      <SheetContent>
        <div className="flex flex-col gap-4 py-4 h-full">
          <Avatar name={user.name} avatar={user.avatar} size={4} />
          <div>
            <p className="font-medium relative text-xl leading-tight text-gray-900">
              {user.name}
            </p>
            <p className="font-normal text-sm leading-tight text-gray-500 truncate">
              {user.email}
            </p>
          </div>
          <Separator />
          <SheetElement
            label="My Vocabulary"
            icon={BookIcon}
            href={AppRouterPath.VOCABULARY}
          />
          <SheetElement
            label="Library"
            icon={LibraryBigIcon}
            href={AppRouterPath.LIBRARY}
          />
          <SheetElement
            label="Settings"
            icon={SettingsIcon}
            href={AppRouterPath.SETTINGS}
          />
          <SheetElement
            label="About"
            icon={InfoIcon}
            href={AppRouterPath.ABOUT}
          />
          <div className="mt-auto">
            <Separator />
            <SheetElement label="LogOut" icon={LogOutIcon} onClick={onLogout} />
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

const SheetElement = ({
  label,
  icon: Icon,
  href,
  onClick,
}: {
  label: string;
  icon?: LucideIcon;
  href?: string;
  onClick?: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
}) => {
  return (
    <SheetClose asChild>
      <Link href={href ?? '#'}>
        <div onClick={onClick} className="flex items-center">
          {Icon && <Icon className="mr-2 h-8 w-4" />}
          <span>{label}</span>
        </div>
      </Link>
    </SheetClose>
  );
};


