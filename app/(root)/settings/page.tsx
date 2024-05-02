import { SettingsForm } from './SettingsForm';
import { auth } from '@/utils/authOptions';

export default async function SettingsPage() {

  const session = await auth();
  const user = JSON.parse(JSON.stringify(session!.user));

  return (
    <div className="flex min-h-screen justify-center">
      <div className="mt-10 w-full max-w-md flex flex-col gap-7 p-5">
        <SettingsForm user={user} />
      </div>
    </div>
  );
}
