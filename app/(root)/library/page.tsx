import { LibraryPanel } from "@/components/library-panel/LibraryPanel";
import { getAllSharedVocabulariesWithUserData } from "@/lib/actions/vocabulary.actions";
import { IVocabularyWithUserData } from "@/lib/database/models/vocabulary.model";

export default async function LibraryPage() {

  const sharedVocabularies = await getAllSharedVocabulariesWithUserData() as IVocabularyWithUserData[];

  return <LibraryPanel vocabularies={sharedVocabularies} />;
}
