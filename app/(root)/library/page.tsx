import { LibraryPanel } from '@/components/library-panel/LibraryPanel';
import { getTopicByUserId } from '@/lib/actions/topics.actions';
import { ITopic } from '@/lib/database/models/topic.model';
import { IUser } from '@/lib/database/models/user.model';
import { auth } from '@/utils/authOptions';
import { getAllSharedVocabularies } from '@/lib/actions/shared-vocabulary.actions';
import { ISharedVocabulary } from '@/lib/database/models/shared-vocabulary.model';

export default async function LibraryPage() {
  const sharedVocabularies =
    (await getAllSharedVocabularies()) as ISharedVocabulary[];
  const session = await auth();
  const user = JSON.parse(JSON.stringify(session!.user)) as IUser;
  const topic = (await getTopicByUserId(user._id)) as ITopic;

  return (
    <LibraryPanel vocabularies={sharedVocabularies} user={user} topic={topic} />
  );
}
