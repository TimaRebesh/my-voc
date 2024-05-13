import { User } from "next-auth";
import { VocHeader } from "./vocabulary-header/VocHeader";
import { IVocabulary } from "@/lib/database/models/vocabulary.model";
import { VocabularyView } from "./vocabulary-view/VocabularyView";

interface Props {
  user: User;
  currentVoc: IVocabulary;
}

export const VocabularyPanel = ({ user, currentVoc }: Props) => {

  return (
    <>
      <VocHeader user={user} voc={currentVoc} />
      <VocabularyView user={user} voc={currentVoc} />
    </>
  );
};
