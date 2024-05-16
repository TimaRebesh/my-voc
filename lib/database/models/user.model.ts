import { ConfigFields, ThemeValues, UserFields } from '@/constants';
import { Theme } from '@/types';
import { Schema, model, models } from 'mongoose';

export interface IUser {
  [UserFields.ID]: string;
  [UserFields.PASSWORD]: string | null;
  [UserFields.NAME]: string;
  [UserFields.EMAIL]: string;
  [UserFields.EMAIL]: string;
  [UserFields.AVATAR]?: string;
  [UserFields.IS_ADMIN]?: boolean;
  [UserFields.CONFIGURATION]: IConfigurations;
}

export interface IConfigurations {
  [ConfigFields.MODE_WRITE]: boolean;
  [ConfigFields.HINTS]: boolean;
  [ConfigFields.LIMIT_ALL]: number; // how many all words proctice in one session
  [ConfigFields.LIMIT_NEW]: number; // how many new words proctice in one session
  [ConfigFields.THEME]: Theme;
}

export const ConfigurationsSchema = new Schema({
  [ConfigFields.MODE_WRITE]: { type: Boolean, required: true },
  [ConfigFields.HINTS]: { type: Boolean, required: true },
  [ConfigFields.LIMIT_ALL]: { type: Number, required: true },
  [ConfigFields.LIMIT_NEW]: { type: Number, required: true },
  [ConfigFields.THEME]: {
    type: String,
    enum: [ThemeValues.LIGHT, ThemeValues.DARK, ThemeValues.SYSTEM],
    required: true,
  },
});

const UserSchema = new Schema({
  [UserFields.NAME]: { type: String, required: true },
  [UserFields.PASSWORD]: { type: Schema.Types.Mixed, default: null },
  [UserFields.EMAIL]: { type: String, required: true, unique: true },
  [UserFields.AVATAR]: { type: String, default: undefined },
  [UserFields.IS_ADMIN]: { type: Boolean, default: false },
  [UserFields.CONFIGURATION]: {
    [ConfigFields.MODE_WRITE]: { type: Boolean, required: true },
    [ConfigFields.HINTS]: { type: Boolean, required: true },
    [ConfigFields.LIMIT_ALL]: { type: Number, required: true },
    [ConfigFields.LIMIT_NEW]: { type: Number, required: true },
    [ConfigFields.THEME]: {
      type: String,
      enum: [ThemeValues.LIGHT, ThemeValues.DARK, ThemeValues.SYSTEM],
      required: true,
    },
  },
  // [UserFields.TOPICS]: {
  //   [TopicsFieds.STUDY_ID]: { type: String, default: null },
  //   [TopicsFieds.TOPICS]: [
  //     {
  //       [VocabularyFields.ID]: {
  //         type: Schema.Types.ObjectId,
  //         ref: 'Vocabulary',
  //         required: true,
  //       },
  //       [VocabularyFields.NAME]: { type: String, required: true },
  //       [VocabularyFields.IS_SHARED]: {
  //         type: Boolean,
  //         required: true,
  //         default: false,
  //       },
  //       [VocabularyFields.DESCRIPTION]: {
  //         type: String,
  //         default: '',
  //       },
  //     },
  //   ],
  // },
});

const User = models.User || model('User', UserSchema);

export default User;
