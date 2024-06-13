import { TopicsFields, VocabularyFields } from '@/constants';
import { Schema, model, models } from 'mongoose';

export interface ITopic {
  [TopicsFields.ID]: string;
  [TopicsFields.CREATOR]: string;
  [TopicsFields.STUDY_ID]: string;
  [TopicsFields.TOPIC_LIST]: TopicData[];
}

export interface TopicData {
  [VocabularyFields.ID]: string;
  [VocabularyFields.NAME]: string;
}

const TopicSchema = new Schema({
  [TopicsFields.CREATOR]: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  [TopicsFields.STUDY_ID]: {
    type: Schema.Types.ObjectId,
    ref: 'Vocabulary',
    required: true,
  },
  [TopicsFields.TOPIC_LIST]: [
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
