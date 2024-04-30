// import { Header } from '@/components/shared/Header/Header';
// import { SideBar } from '@/components/shared/sidebar/SideBar';
import { Header } from '@/components/Header/Header';
import { AppRouterPath } from '@/constants';
// import { getBoards } from '@/lib/actions/board.actions';
import { auth } from '@/utils/authOptions';
import { redirect } from 'next/navigation';

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // const session = await auth();

  // if (!session) redirect(AppRouterPath.LOGIN);

  // const boards = await getBoards(session.user._id);

  return (
    <div className="flex h-screen flex-col">
      <Header />
      {children}
      {/* <Header />
      <main className="flex-1 bg-secondary pt-4">
        <div className="flex flex-row w-full h-full">
          <SideBar boards={boards} />
          <div className="w-full h-full bg-background rounded-tl-lg ml-4 p-4">
            {children}
          </div>
        </div>
      </main> */}
    </div>
  );
}
