'use server';

import { AppRouterPath, TopicsFieds } from '@/constants';
import { connectToDB } from '../database';
import Topic from '../database/models/topic.model';
import { handleError } from '../utils';
import { revalidatePath } from 'next/cache';

export async function getTopicByUserId(userId: string) {
  try {
    await connectToDB();

    const topic = await Topic.findOne({ [TopicsFieds.CREATOR]: userId });

    if (!topic) {
      throw new Error('Topic not found');
    }
    return JSON.parse(JSON.stringify(topic));
  } catch (error) {
    handleError(error);
  }
}

export async function selectTopic(
  userId: string,
  vocabularyId: string,
  path: AppRouterPath
) {
  try {
    await connectToDB();
    const topic = await Topic.findOne({ [TopicsFieds.CREATOR]: userId });
    if (!topic) {
      throw new Error('Topic not found');
    }
    topic[TopicsFieds.STUDY_ID] = vocabularyId;
    topic.save();

    revalidatePath(path);
  } catch (error) {
    handleError(error);
  }
}
