import { TopicsFieds, VocabularyFields } from '@/constants';
import { Schema, model, models } from 'mongoose';

export interface ITopic {
  [TopicsFieds.ID]: string;
  [TopicsFieds.CREATOR]: string;
  [TopicsFieds.STUDY_ID]: string;
  [TopicsFieds.TOPIC_LIST]: TopicData[];
}

export interface TopicData {
  [VocabularyFields.ID]: string;
  [VocabularyFields.NAME]: string;
}

const TopicSchema = new Schema({
  [TopicsFieds.CREATOR]: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  [TopicsFieds.STUDY_ID]: {
    type: Schema.Types.ObjectId,
    ref: 'Vocabulary',
    required: true,
  },
  [TopicsFieds.TOPIC_LIST]: [
    {
      [VocabularyFields.ID]: {
        type: Schema.Types.ObjectId,
        ref: 'Vocabulary',
        required: true,
      },
      [VocabularyFields.NAME]: { type: String, required: true },
    },
  ],
});

const Topic = models.Topic || model('Topic', TopicSchema);

export default Topic;
