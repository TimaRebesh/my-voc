import { revalidatePath } from 'next/cache';
import { connectToDB } from '../database';
import Vocabulary from '../database/models/vocabulary.model';
import { handleError } from '../utils';

export async function createVocabulary(values: any, path: string) {
  try {
    await connectToDB();

    const newBoard = new Vocabulary({ ...values, elements: [] });

    revalidatePath(path + newBoard._id);

    return JSON.parse(JSON.stringify(newBoard));
  } catch (error) {
    handleError(error);
  }
}
