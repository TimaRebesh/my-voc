import { UserMenu } from './user-menu/UserMenu';
import { auth } from '@/utils/authOptions';
import { HeaderLabel } from './header-label/HeaderLabel';
import { GoToMenu } from './go-to-menu/GoToMenu';
import { VocabularyName } from './vocabulary-name/VocabularyName';
import { getTopicByUserId } from '@/lib/actions/topics.actions';
import { IUser } from '@/lib/database/models/user.model';
import { ITopic } from '@/lib/database/models/topic.model';

export async function Header() {
  const session = await auth();
  const user = JSON.parse(JSON.stringify(session!.user)) as IUser;
  const topic = (await getTopicByUserId(user._id)) as ITopic;
  const currentTopicName =
    topic.topicList.find((t) => t._id === topic.studyID)?.name ?? '';

  return (
    <header className="w-full h-12 bg-header text-permanent-white body-font relative flex justify-between items-center px-4">
      <div className="flex items-center">
        <GoToMenu />
      </div>
      <div className="absolute left-1/2 transform -translate-x-1/2">
        <HeaderLabel />
      </div>
      <div className="flex items-center space-x-2">
        <UserMenu user={user as IUser} />
        {/* <p className="text-sm opacity-80">Timothy Rebesh</p> */}
      </div>
      <VocabularyName name={currentTopicName} />
    </header>
  );
}
