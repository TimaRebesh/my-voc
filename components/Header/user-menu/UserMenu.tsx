'use client';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { UserCogIcon, InfoIcon, LogOutIcon, LucideIcon } from 'lucide-react';
import Link from 'next/link';
import { UserType } from '@/lib/database/models/user.model';
import { signOut } from 'next-auth/react';
import { User } from 'next-auth';
import { AppRouterPath } from '@/constants';
import { CustomAvatar } from '@/components/ui/custom-avatar';

export const UserMenu = ({ user }: { user: User; }) => {
  const onLogout = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.stopPropagation();
    signOut();
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <UserIcon user={user as UserType} />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="mr-4">
        <DropdownMenuLabel className="font-medium relative text-xl leading-tight text-gray-900">
          {user.name}
        </DropdownMenuLabel>
        <DropdownMenuLabel className="font-normal text-base leading-tight text-gray-500 truncate">
          {user.email}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <MenuElement
          label="My profile"
          icon={UserCogIcon}
          href={AppRouterPath.PROFILE}
        />
        <MenuElement label="About" icon={InfoIcon} href={AppRouterPath.ABOUT} />
        <DropdownMenuSeparator />
        <MenuElement label="LogOut" icon={LogOutIcon} onClick={onLogout} />
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

const MenuElement = ({
  label,
  icon: Icon,
  href,
  onClick,
}: {
  label: string;
  icon: LucideIcon;
  href?: string;
  onClick?: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
}) => {
  return (
    <Link href={href ?? '#'}>
      <DropdownMenuItem onClick={onClick}>
        <Icon className="mr-2 h-8 w-4" />
        <span>{label}</span>
      </DropdownMenuItem>
    </Link>
  );
};

const UserIcon = ({ user }: { user: UserType; }) => {
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
    />
  );
};
