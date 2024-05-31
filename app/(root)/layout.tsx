import { Header } from '@/components/Header/Header';
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

  return (
    <div className="flex flex-col h-screen">
      <Header />
      {children}
    </div>
  );
}
