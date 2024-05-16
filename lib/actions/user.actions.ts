'use server';

import {
  ConfigFields,
  ThemeValues,
  TopicsFieds,
  UserFields,
  VocabularyFields,
} from '@/constants';
import { connectToDB } from '@/lib/database';
import User, { IConfigurations, IUser } from '@/lib/database/models/user.model';
import { handleError } from '@/lib/utils';
import { revalidatePath } from 'next/cache';
import Vocabulary, { IVocabulary } from '../database/models/vocabulary.model';
import Topic, { ITopic } from '../database/models/topic.model';

export const checkLoginCredentials = async ({
  email,
  password,
}: {
  email: string;
  password: string;
}) => {
  try {
    connectToDB();
    const user = await User.findOne({ email });
    if (!user) {
      return { message: 'email is not exist', type: 'email' };
    }
    const isPasswordCorrect = password === user.password;
    if (!isPasswordCorrect) {
      new Error('Password is not correct');
      return { message: 'password is not correct', type: 'password' };
    }
    return { type: 'success' };
  } catch (err: any | unknown) {
    handleError(err);

    if (err.message.includes('CredentialsSignin')) {
      return { error: 'Invalid username or password' };
    }
    throw err;
  }
};

export async function getUserById(userId: string) {
  try {
    await connectToDB();

    const user = await User.findById(userId);

    if (!user) throw new Error('User not found');
    return JSON.parse(JSON.stringify(user));
  } catch (error) {
    handleError(error);
  }
}

export async function createUser({
  name,
  email,
  password = null,
  image = '',
}: {
  name: string;
  email: string;
  password?: string | null;
  image?: string;
}) {
  try {
    await connectToDB();
    // checking if user mail exists
    const someUser = await User.findOne({ email });
    if (someUser) {
      return { message: 'such email already exists', type: 'email' };
    }
    // new user creating
    const configurationsData: IConfigurations = {
      [ConfigFields.MODE_WRITE]: true,
      [ConfigFields.HINTS]: true,
      [ConfigFields.LIMIT_ALL]: 30,
      [ConfigFields.LIMIT_NEW]: 10,
      [ConfigFields.THEME]: ThemeValues.LIGHT,
    };
    const userValues: Omit<IUser, UserFields.ID> = {
      [UserFields.NAME]: name,
      [UserFields.PASSWORD]: password,
      [UserFields.EMAIL]: email,
      [UserFields.AVATAR]: image,
      [UserFields.IS_ADMIN]: false,
      [UserFields.CONFIGURATION]: configurationsData,
    };
    const newUser = new User(userValues);
    await newUser.save();
    // new vocabulary creating
    const vocabularyValues: Omit<IVocabulary, VocabularyFields.ID> = {
      [VocabularyFields.NAME]: 'my first voc',
      [VocabularyFields.LIST]: [],
      [VocabularyFields.CREATOR]: newUser[UserFields.ID],
      [VocabularyFields.IS_SHARED]: false,
      [VocabularyFields.DESCRIPTION]: '',
    };
    const newVoc = new Vocabulary(vocabularyValues);
    await newVoc.save();
    // new topic creating
    const topicValues: Omit<ITopic, TopicsFieds.ID> = {
      [TopicsFieds.CREATOR]: newUser[UserFields.ID],
      [TopicsFieds.STUDY_ID]: newVoc[VocabularyFields.ID],
      [TopicsFieds.TOPIC_LIST]: [
        {
          [VocabularyFields.ID]: newVoc[VocabularyFields.ID],
          [VocabularyFields.NAME]: newVoc[VocabularyFields.NAME],
        },
      ],
    };
    const newTopic = await new Topic(topicValues);
    await newTopic.save();

    return JSON.parse(JSON.stringify(newUser));
  } catch (error) {
    handleError(error);
  }
}

export async function updateUser(values: IUser, path?: string) {
  try {
    await connectToDB();
    const { _id, ...restValues } = values;
    const user = await User.findByIdAndUpdate(_id, restValues, { new: true });
    path && revalidatePath(path);
    return JSON.parse(JSON.stringify(user));
  } catch (error) {
    handleError(error);
  }
}

export async function deleteUser(
  id: string,
  deleteShared: boolean,
  path?: string
) {
  try {
    const user = await User.findByIdAndDelete(id);

    if (!user) {
      return { message: 'user not found', error: 'email' };
    }

    // delete vocabularies
    const searchParams: { creator: string; isShared?: boolean } = {
      creator: id, // delete all
    };
    if (!deleteShared) {
      // delete only private
      searchParams.isShared = false;
    }

    await Vocabulary.deleteMany(searchParams);

    // delete topic
    await Topic.findOneAndDelete({ [TopicsFieds.CREATOR]: id });

    path && revalidatePath(path);
  } catch (error) {
    handleError(error);
  }
}
