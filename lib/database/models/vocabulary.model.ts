import { VocabularyFields } from '@/constants';
import { Schema, model, models } from 'mongoose';

export type Repeated = {
  translated: number;
  original: number;
  wrote: number;
};

export type Word = {
  id: string;
  original: string;
  another: string[];
  translated: string;
  repeated: Repeated;
  lastRepeat: number;
};

export interface IVocabulary {
  [VocabularyFields.ID]: string;
  [VocabularyFields.NAME]: string;
  [VocabularyFields.LIST]: Word[];
  [VocabularyFields.CREATOR]: string;
  [VocabularyFields.IS_SHARED]: boolean;
  [VocabularyFields.DESCRIPTION]?: string;
}

const RepeatedSchema = new Schema({
  translated: { type: Number, required: true },
  original: { type: Number, required: true },
  wrote: { type: Number, required: true },
});

const WordSchema = new Schema({
  id: { type: Number, required: true },
  original: { type: String, required: true },
  another: { type: [String], required: true },
  translated: { type: String, required: true },
  repeated: { type: RepeatedSchema, required: true },
  lastRepeat: { type: Number, required: true },
});

const VocabularySchema = new Schema({
  [VocabularyFields.NAME]: { type: String, required: true },
  [VocabularyFields.LIST]: { type: [WordSchema], required: true },
  [VocabularyFields.CREATOR]: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  [VocabularyFields.IS_SHARED]: {
    type: Boolean,
    required: true,
    default: false,
  },
  [VocabularyFields.DESCRIPTION]: {
    type: String,
    default: '',
  },
});

const Vocabulary = models.Vocabulary || model('Vocabulary', VocabularySchema);

export default Vocabulary;
