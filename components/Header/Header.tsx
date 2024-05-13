import { UserMenu } from './user-menu/UserMenu';
import { auth } from '@/utils/authOptions';
import { User } from 'next-auth';
import { HeaderLabel } from './header-label/HeaderLabel';
import { GoToMenu } from './go-to-menu/GoToMenu';
import { VocabularyName } from './vocabulary-name/VocabularyName';


export async function Header() {

  const session = await auth();
  const user = JSON.parse(JSON.stringify(session!.user)) as User;
  const currentVoc = user?.configuration.vocabularies.find(v => v.id === user.configuration.studyID);

  return (
    <header className="w-full h-12 bg-gray-700 body-font relative flex justify-between items-center px-4">
      <div className="flex items-center text-background">
        <GoToMenu />
      </div>
      <div className="absolute left-1/2 transform -translate-x-1/2">
        <HeaderLabel />
      </div>
      <div className="flex items-center space-x-2">
        <UserMenu user={user as User} />
        {/* <p className="text-sm opacity-80">Timothy Rebesh</p> */}
      </div>
      <VocabularyName name={currentVoc?.name ?? ''} />
    </header>
  );
}
