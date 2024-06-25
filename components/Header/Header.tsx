import { UserMenu } from './user-menu/UserMenu';
import { HeaderLabel } from './header-label/HeaderLabel';
import { GoToMenu } from './go-to-menu/GoToMenu';
import { VocabularyName } from './vocabulary-name/VocabularyName';
import { getTopicByUserId } from '@/lib/actions/topics.actions';
import { IUser } from '@/lib/database/models/user.model';
import { ITopic } from '@/lib/database/models/topic.model';

export async function Header({ user }: { user: IUser; }) {
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
      </div>
      <VocabularyName name={currentTopicName} />
    </header>
  );
}
