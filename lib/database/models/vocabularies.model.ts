import { VocabularyFields } from '@/constants';
import { Schema, model, models } from 'mongoose';

export type Repeated = {
  translated: number;
  original: number;
  wrote: number;
};

export type Word = {
  id: number;
  original: string;
  another: string[];
  translated: string;
  repeated: Repeated;
  lastRepeat: number;
};

export type Vocabulary = {
  _id: number;
  [VocabularyFields.NAME]: string;
  [VocabularyFields.LIST]: Word[];
  [VocabularyFields.CREATOR]: string;
};

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
});

const Vocabulary = models.Vocabulary || model('Vocabulary', VocabularySchema);

export default Vocabulary;
