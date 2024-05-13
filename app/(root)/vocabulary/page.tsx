import { VocabularyPanel } from "@/components/vocabulary-panel/VocabularyPanel";
import { getVocabulary } from "@/lib/actions/vocabulary.actions";
import { auth } from "@/utils/authOptions";
import { User } from "next-auth";

export default async function VocabularyPage() {

  const session = await auth();
  const user = JSON.parse(JSON.stringify(session!.user)) as User;
  const currentVoc = await getVocabulary(user.configuration.studyID);

  return (
    <VocabularyPanel user={user} currentVoc={currentVoc} />
  );
}
