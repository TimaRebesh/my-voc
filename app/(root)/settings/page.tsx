import { SettingsForm } from './SettingsForm';
import { auth } from '@/utils/authOptions';

export default async function SettingsPage() {
  const session = await auth();
  const user = JSON.parse(JSON.stringify(session!.user));

  return (
    <div className='flex-1 overflow-y-auto'>
      <div className="flex h-[500px] justify-center">
        <div className="w-full max-w-md flex flex-col gap-7 p-5">
          <SettingsForm user={user} />
        </div>
      </div>
    </div>
  );
}
