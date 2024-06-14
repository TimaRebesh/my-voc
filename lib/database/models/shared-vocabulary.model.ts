import { VocabularyFields } from '@/constants';
import { Schema, model, models } from 'mongoose';
import { Word } from './vocabulary.model';

export type ISharedWord = Omit<Word, 'repeated' | 'lastRepeat'>;

export interface ISharedVocCreator  {
  [VocabularyFields.CREATOR_NAME]: string,
  [VocabularyFields.CREATOR_AVATAR]: string,
  [VocabularyFields.CREATOR_ID]: string,
}

export interface ISharedVocabulary {
  [VocabularyFields.ID]: string;
  [VocabularyFields.NAME]: string;
  [VocabularyFields.LIST]: ISharedWord[];
  [VocabularyFields.DESCRIPTION]: string;
  [VocabularyFields.CREATOR]: ISharedVocCreator
}

const SharedVocabularySchema = new Schema({
  [VocabularyFields.NAME]: { type: String, required: true },
  [VocabularyFields.LIST]: [
    {
      _id: false,
      id: { type: Number, required: true },
      original: { type: String, required: true },
      translated: { type: String, required: true },
      another: { type: [String], required: true },
    },
  ],
  [VocabularyFields.DESCRIPTION]: { type: String, default: '' },
  [VocabularyFields.CREATOR]: {
    [VocabularyFields.CREATOR_NAME]: { type: String, required: true },
    [VocabularyFields.CREATOR_AVATAR]: { type: String, default: '' },
    [VocabularyFields.CREATOR_ID]: { type: String, required: true },
  },
});

const SharedVocabulary =
  models.SharedVocabulary || model('SharedVocabulary', SharedVocabularySchema);

export default SharedVocabulary;
