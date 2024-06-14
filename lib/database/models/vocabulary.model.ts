import { RepeatedConst, UserFields, VocabularyFields } from '@/constants';
import { Schema, model, models } from 'mongoose';

export type Repeated = {
  [RepeatedConst.ORIGINAL]: number;
  [RepeatedConst.TRANSLATED]: number;
  [RepeatedConst.WROTE]: number;
  [RepeatedConst.PRIORITIZED]: boolean;
};

export type Word = {
  id: string;
  original: string;
  translated: string;
  another: string[];
  repeated: Repeated;
  lastRepeat: number;
};

export interface IVocabulary {
  [VocabularyFields.ID]: string;
  [VocabularyFields.NAME]: string;
  [VocabularyFields.LIST]: Word[];
  [VocabularyFields.CREATOR]: string;
}

const VocabularySchema = new Schema({
  [VocabularyFields.NAME]: { type: String, required: true },
  [VocabularyFields.LIST]: [
    {
      _id: false,
      id: { type: Number, required: true },
      original: { type: String, required: true },
      another: { type: [String], required: true },
      translated: { type: String, required: true },
      repeated: {
        _id: false,
        translated: { type: Number, required: true },
        original: { type: Number, required: true },
        wrote: { type: Number, required: true },
        prioritized: { type: Boolean, required: false, default: false },
      },
      lastRepeat: { type: Number, required: true },
    },
  ],
  [VocabularyFields.CREATOR]: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  [VocabularyFields.CREATED_BY]: { type: String, default: '' },
});

const Vocabulary = models.Vocabulary || model('Vocabulary', VocabularySchema);

export default Vocabulary;
