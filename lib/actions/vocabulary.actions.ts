'use server';

import { revalidatePath } from 'next/cache';
import { connectToDB } from '../database';
import { createWord, handleError } from '../utils';
import Vocabulary, {
  IVocabulary,
  Word,
} from '../database/models/vocabulary.model';
import { AppRouterPath, TopicsFields, VocabularyFields } from '@/constants';
import Topic, { TopicData } from '../database/models/topic.model';
import SharedVocabulary, {
  ISharedWord,
} from '../database/models/shared-vocabulary.model';

export async function createVocabularyAndSetAsStudied(
  values: Omit<IVocabulary, VocabularyFields.ID>,
  userId: string,
  path: AppRouterPath
) {
  try {
    await connectToDB();

    // new vocabulary creating
    const newVoc = new Vocabulary({ ...values });
    await newVoc.save();
    //add voc to topic
    const topic = await Topic.findOne({
      [VocabularyFields.CREATOR]: userId,
    });
    topic[TopicsFields.STUDY_ID] = newVoc[VocabularyFields.ID];
    topic[TopicsFields.TOPIC_LIST] = [
      {
        [VocabularyFields.ID]: newVoc[VocabularyFields.ID],
        [VocabularyFields.NAME]: newVoc[VocabularyFields.NAME],
      },
      ...topic[TopicsFields.TOPIC_LIST],
    ];
    topic.save();

    revalidatePath(path);
  } catch (error) {
    handleError(error);
  }
}

export async function addVocFromLibraryToMyVoc(
  vocId: string,
  userId: string,
  path?: AppRouterPath
) {
  try {
    await connectToDB();

    const voc = await SharedVocabulary.findById(vocId);
    if (!voc) {
      return 'vocabulary is not found';
    }
    // creating appropriate list
    const wordList: Word[] = voc[VocabularyFields.LIST].map(
      (word: ISharedWord) => {
        return createWord({
          original: word.original,
          translated: word.translated,
          another: word.another,
          id: word.id,
        });
      }
    );
    // creating values
    const newVocValues: Omit<IVocabulary, VocabularyFields.ID> = {
      [VocabularyFields.NAME]: voc[VocabularyFields.NAME],
      [VocabularyFields.LIST]: wordList,
      [VocabularyFields.CREATOR]: userId,
    };
    const newVoc = await Vocabulary.create(newVocValues);
    await newVoc.save();
    //add voc to topic
    const topic = await Topic.findOne({
      [VocabularyFields.CREATOR]: userId,
    });
    topic[TopicsFields.TOPIC_LIST] = [
      ...topic[TopicsFields.TOPIC_LIST],
      {
        [VocabularyFields.ID]: newVoc[VocabularyFields.ID],
        [VocabularyFields.NAME]: newVoc[VocabularyFields.NAME],
      },
    ];
    topic.save();

    path && revalidatePath(path);
  } catch (error) {
    handleError(error);
  }
}

export async function getVocabulary(id: string) {
  try {
    await connectToDB();

    const voc = await Vocabulary.findById(id);

    if (!voc) {
      throw new Error('Vocabulary not found');
    }
    return JSON.parse(JSON.stringify(voc));
  } catch (error) {
    handleError(error);
  }
}

export async function editVocabulary(
  vocabulary: IVocabulary,
  path: AppRouterPath
) {
  try {
    await connectToDB();
    const { _id, name, list, creator } = vocabulary;
    const voc = await Vocabulary.findById(_id);
    if (!voc) {
      throw new Error('Vocabulary not found');
    }
    voc.name = name;
    voc.list = list;
    await voc.save();
    // update vocabulary in topic
    const topic = await Topic.findOne({ [TopicsFields.CREATOR]: creator });
    const updatedList = topic[TopicsFields.TOPIC_LIST].map((t: TopicData) =>
      t._id.toString() === _id
        ? ({
            [VocabularyFields.ID]: t._id,
            [VocabularyFields.NAME]: name,
          } as TopicData)
        : t
    );
    topic[TopicsFields.TOPIC_LIST] = updatedList;
    topic.save();

    revalidatePath(path);
  } catch (error) {
    handleError(error);
  }
}

export async function updateVocabularyList(
  vocabularyId: string,
  list: Word[],
  path: AppRouterPath
) {
  try {
    await connectToDB();

    const voc = await Vocabulary.findById(vocabularyId);
    voc[VocabularyFields.LIST] = list;
    await voc.save();

    revalidatePath(path);
  } catch (error) {
    handleError(error);
  }
}

export async function createVocabularyListWord(
  vocabularyId: string,
  word: Word,
  path: AppRouterPath
) {
  try {
    await connectToDB();

    await Vocabulary.updateOne(
      { _id: vocabularyId },
      {
        $push: {
          list: {
            $each: [word],
            $position: 0,
          },
        },
      }
    );

    revalidatePath(path);
  } catch (error) {
    handleError(error);
  }
}

export async function updateVocabularyListWord(
  vocabularyId: string,
  word: Word,
  path: AppRouterPath
) {
  try {
    await connectToDB();

    await Vocabulary.updateOne(
      { _id: vocabularyId, 'list.id': word.id },
      {
        $set: {
          'list.$': word,
        },
      }
    );

    revalidatePath(path);
  } catch (error) {
    handleError(error);
  }
}

export async function deleteVocabularyListWord(
  vocabularyId: string,
  wordId: string,
  path: AppRouterPath
) {
  try {
    await connectToDB();

    await Vocabulary.updateOne(
      { _id: vocabularyId },
      {
        $pull: {
          list: { id: wordId },
        },
      }
    );

    revalidatePath(path);
  } catch (error) {
    handleError(error);
  }
}

export async function deleteVocabulary(
  vocabulary: IVocabulary,
  path: AppRouterPath
) {
  const { _id, creator } = vocabulary;
  try {
    await connectToDB();
    await Vocabulary.findByIdAndDelete(_id);
    const topic = await Topic.findOne({ [TopicsFields.CREATOR]: creator });

    const filteredList = topic[TopicsFields.TOPIC_LIST].filter(
      (t: TopicData) => t._id.toString() !== _id
    );

    topic[TopicsFields.TOPIC_LIST] = filteredList;
    topic[TopicsFields.STUDY_ID] = filteredList[0]._id.toString();
    topic.save();
    revalidatePath(path);
  } catch (error) {
    handleError(error);
  }
}

// export async function getAllSharedVocabulariesWithUserData() {
//   try {
//     await connectToDB();
//     const sharedVocabularies = await Vocabulary.aggregate([
//       {
//         $match: {
//           [VocabularyFields.IS_SHARED]: true,
//         },
//       },
//       {
//         $lookup: {
//           from: 'users',
//           localField: VocabularyFields.CREATOR,
//           foreignField: '_id',
//           as: 'creatorData',
//         },
//       },
//       {
//         $unwind: '$creatorData',
//       },
//       {
//         $project: {
//           [VocabularyFields.NAME]: 1,
//           [VocabularyFields.LIST]: { $slice: ['$list', 4] },
//           [VocabularyFields.CREATOR]: 1,
//           [VocabularyFields.IS_SHARED]: 1,
//           [VocabularyFields.DESCRIPTION]: 1,
//           [`${[VocabularyFields.CREATOR_DATA]}.${[UserFields.NAME]}`]:
//             '$creatorData.name',
//           [`${[VocabularyFields.CREATOR_DATA]}.${[UserFields.AVATAR]}`]:
//             '$creatorData.avatar',
//         },
//       },
//     ]);
//     return JSON.parse(JSON.stringify(sharedVocabularies));
//   } catch (error) {
//     handleError(error);
//   }
// }

export async function addVocFromLibraryToMyVocabularies(
  values: Omit<IVocabulary, VocabularyFields.ID>,
  userId: string,
  path: AppRouterPath
) {
  try {
    await connectToDB();

    // new vocabulary creating
    const newVoc = new Vocabulary({ ...values });
    await newVoc.save();
    //add voc to topic
    const topic = await Topic.findOne({
      [VocabularyFields.CREATOR]: userId,
    });
    topic[TopicsFields.STUDY_ID] = newVoc[VocabularyFields.ID];
    topic[TopicsFields.TOPIC_LIST] = [
      {
        [VocabularyFields.ID]: newVoc[VocabularyFields.ID],
        [VocabularyFields.NAME]: newVoc[VocabularyFields.NAME],
      },
      ...topic[TopicsFields.TOPIC_LIST],
    ];
    topic.save();

    revalidatePath(path);
  } catch (error) {
    handleError(error);
  }
}
