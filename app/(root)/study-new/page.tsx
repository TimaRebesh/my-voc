import StudyNewPanel from '@/components/study-panel/StudyNewPanel';
import { getTopicByUserId } from '@/lib/actions/topics.actions';
import { getVocabulary } from '@/lib/actions/vocabulary.actions';
import { ITopic } from '@/lib/database/models/topic.model';
import { IUser } from '@/lib/database/models/user.model';
import { auth } from '@/utils/authOptions';

export default async function StudyPage() {
  const session = await auth();
  const user = JSON.parse(JSON.stringify(session!.user)) as IUser;
  const topic = (await getTopicByUserId(user._id)) as ITopic;
  const vocabulary = await getVocabulary(topic.studyID);

  return <StudyNewPanel user={user} vocabulary={vocabulary} />;
}
