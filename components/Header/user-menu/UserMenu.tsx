'use client';

import { InfoIcon, LogOutIcon, LucideIcon, SettingsIcon, LibraryBigIcon, BookIcon } from 'lucide-react';
import Link from 'next/link';
import { IUser } from '@/lib/database/models/user.model';
import { signOut } from 'next-auth/react';
import { AppRouterPath } from '@/constants';
import { CustomAvatar } from '@/components/ui/custom-avatar';
import { Sheet, SheetClose, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Separator } from '@/components/ui/separator';

export const UserMenu = ({ user }: { user: IUser; }) => {

  const onLogout = async (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.stopPropagation();
    await signOut();
  };

  return (
    <Sheet>
      <SheetTrigger>
        <UserIcon user={user as IUser} size={2} />
      </SheetTrigger>
      <SheetContent>
        <div className="flex flex-col gap-4 py-4 h-full">
          <UserIcon user={user as IUser} size={4} />
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
        <div onClick={onClick} className='flex items-center'>
          {Icon && <Icon className="mr-2 h-8 w-4" />}
          <span>{label}</span>
        </div>
      </Link>
    </SheetClose>
  );
};

const UserIcon = ({
  user,
  size,
}: {
  user: IUser;
  size?: number;
}) => {
  const getColor = (username: string): string => {
    const firstLetter = username.charAt(0).toLowerCase();
    const colorRanges = [
      { range: ['a', 'e'], color: 'orange' },
      { range: ['f', 'j'], color: 'purple' },
      { range: ['k', 'o'], color: 'green' },
      { range: ['p', 't'], color: 'blue' },
      { range: ['u', 'z'], color: 'red' },
    ];
    const colorRange = colorRanges.find(
      (range) => firstLetter >= range.range[0] && firstLetter <= range.range[1]
    );
    return `bg-${colorRange ? colorRange.color : 'gray'}-500`;
  };


  const avatarFallbackBackground = `text-xl text-white uppercase bg-orange-500 bg-purple-500 bg-red-500 bg-green-500 bg-blue-500 bg-gray-500 ${getColor(user.name)}`;

  return (
    <CustomAvatar
      src={user.avatar}
      tooltipText="Open menu"
      fallback={user.name.charAt(0)}
      className={avatarFallbackBackground}
      size={size}
    />
  );
};
