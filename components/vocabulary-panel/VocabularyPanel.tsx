import { VocHeader } from "./vocabulary-header/VocHeader";
import { IVocabulary } from "@/lib/database/models/vocabulary.model";
import { VocabularyView } from "./vocabulary-view/VocabularyView";
import { IUser } from "@/lib/database/models/user.model";
import { ITopic } from "@/lib/database/models/topic.model";

interface Props {
  user: IUser;
  topic: ITopic;
  currentVoc: IVocabulary;
}

export const VocabularyPanel = ({ user, topic, currentVoc }: Props) => {
  return (
    <>
      <VocHeader user={user} topic={topic} currentVoc={currentVoc} />
      <VocabularyView user={user} voc={currentVoc} />
    </>
  );
};
