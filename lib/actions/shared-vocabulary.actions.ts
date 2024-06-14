'use server';

import { AppRouterPath, VocabularyFields } from '@/constants';
import { connectToDB } from '../database';
import SharedVocabulary, {
  ISharedVocCreator,
  ISharedVocabulary,
} from '../database/models/shared-vocabulary.model';
import { handleError } from '../utils';
import Vocabulary, { Word } from '../database/models/vocabulary.model';
import { revalidatePath } from 'next/cache';

export async function getAllSharedVocabularies() {
  try {
    await connectToDB();
    const vocabularies = await SharedVocabulary.aggregate([
      {
        $project: {
          [VocabularyFields.ID]: '$_id',
          [VocabularyFields.NAME]: 1,
          [VocabularyFields.DESCRIPTION]: 1,
          [VocabularyFields.CREATOR]: 1,
          [VocabularyFields.LIST]: { $slice: ['$list', 4] }, // Limit list to 4 elements
        },
      },
    ]);
    return JSON.parse(JSON.stringify(vocabularies));
  } catch (error) {
    handleError(error);
  }
}

export async function getSharedVocabulary(id: string) {
  try {
    await connectToDB();

    const voc = await SharedVocabulary.findById(id);

    if (!voc) {
      throw new Error('Vocabulary not found');
    }
    return JSON.parse(JSON.stringify(voc));
  } catch (error) {
    handleError(error);
  }
}

export async function deleteSharedVocabulary(id: string, path: string) {
  try {
    await connectToDB();
    const result = await SharedVocabulary.findByIdAndDelete(id);

    if (!result) {
      throw new Error('Vocabulary not found');
    }
    path && revalidatePath(path);
  } catch (error) {
    handleError(error);
  }
}

export async function createSharedVocabulary(
  vocabularyId: string,
  name: string,
  description: string,
  creatorData: ISharedVocCreator,
  path?: AppRouterPath
) {
  try {
    await connectToDB();
    const voc = await Vocabulary.findById(vocabularyId);
    const values: Omit<ISharedVocabulary, VocabularyFields.ID> = {
      [VocabularyFields.NAME]: name,
      [VocabularyFields.LIST]: voc.list.map((item: Word) => ({
        id: item.id,
        original: item.original,
        translated: item.translated,
        another: item.another,
      })),
      [VocabularyFields.DESCRIPTION]: description,
      [VocabularyFields.CREATOR]: {
        [VocabularyFields.CREATOR_ID]: creatorData.creatorId,
        [VocabularyFields.CREATOR_NAME]: creatorData.creatorName,
        [VocabularyFields.CREATOR_AVATAR]: creatorData.creatorAvatar,
      },
    };
    await SharedVocabulary.create(values);
    path && revalidatePath(path);
  } catch (error) {
    handleError(error);
  }
}
