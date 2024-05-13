'use server';

import { revalidatePath } from 'next/cache';
import { connectToDB } from '../database';
import { handleError } from '../utils';
import Vocabulary, { IVocabulary } from '../database/models/vocabulary.model';
import { IUser } from '../database/models/user.model';

export async function createVocabulary(values: any, path: string) {
  try {
    await connectToDB();

    const newVoc = new Vocabulary({ ...values, elements: [] });

    revalidatePath(path + newVoc._id);

    return JSON.parse(JSON.stringify(newVoc));
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
  id: string,
  { name, isShared, list }: Omit<IVocabulary, '_id' | 'creator'>,
  path: string,
  user?: IUser
) {
  try {
    await connectToDB();

    const voc = await Vocabulary.findById(id);
    if (!voc) {
      throw new Error('Vocabulary not found');
    }
    voc.name = name;
    voc.isShared = isShared;
    if (list.length > 1) {
      voc.list = list;
    }
    await voc.save();
    revalidatePath(path);
  } catch (error) {
    handleError(error);
  }
}
