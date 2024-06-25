import { Header } from '@/components/Header/Header';
import { LogoutPage } from '@/components/logout-page/LogoutPage';
import { AppRouterPath } from '@/constants';
import { auth } from '@/utils/authOptions';
import { redirect } from 'next/navigation';

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();

  if (!session) redirect(AppRouterPath.LOGIN);
  if (!session.user._id) {
    return <LogoutPage />;
  }

  const user = JSON.parse(JSON.stringify(session!.user));

  return (
    <div className="flex flex-col h-screen">
      <Header user={user} />
      {children}
    </div>
  );
}
