'use server';

import { revalidatePath } from 'next/cache';
import { connectToDB } from '../database';
import { handleError } from '../utils';
import Vocabulary, { IVocabulary } from '../database/models/vocabulary.model';
import { AppRouterPath, TopicsFieds, VocabularyFields } from '@/constants';
import Topic, { TopicData } from '../database/models/topic.model';

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
    topic[TopicsFieds.STUDY_ID] = newVoc[VocabularyFields.ID];
    topic[TopicsFieds.TOPIC_LIST] = [
      {
        [VocabularyFields.ID]: newVoc[VocabularyFields.ID],
        [VocabularyFields.NAME]: newVoc[VocabularyFields.NAME],
      },
      ...topic[TopicsFieds.TOPIC_LIST],
    ];
    topic.save();

    revalidatePath(path);
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
    const { _id, name, isShared, description, list, creator } = vocabulary;
    const voc = await Vocabulary.findById(_id);
    if (!voc) {
      throw new Error('Vocabulary not found');
    }
    voc.name = name;
    voc.isShared = isShared;
    voc.description = description;
    voc.list = list;
    await voc.save();
    // update vocabulary in topic
    const topic = await Topic.findOne({ [TopicsFieds.CREATOR]: creator });
    const updatedList = topic[TopicsFieds.TOPIC_LIST].map((t: TopicData) =>
      t._id.toString() === _id
        ? ({
            [VocabularyFields.ID]: t._id,
            [VocabularyFields.NAME]: name,
          } as TopicData)
        : t
    );
    topic[TopicsFieds.TOPIC_LIST] = updatedList;
    topic.save();

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
    const topic = await Topic.findOne({ [TopicsFieds.CREATOR]: creator });

    const filteredList = topic[TopicsFieds.TOPIC_LIST].filter(
      (t: TopicData) => t._id.toString() !== _id
    );

    topic[TopicsFieds.TOPIC_LIST] = filteredList;
    topic[TopicsFieds.STUDY_ID] = filteredList[0]._id.toString();
    topic.save();
    revalidatePath(path);
  } catch (error) {
    handleError(error);
  }
}
