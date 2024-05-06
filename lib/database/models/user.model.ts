import { ConfigFields, ThemeValues, UserFields } from '@/constants';
import { Configurations } from '@/types';
import { Schema, model, models } from 'mongoose';

export interface UserType {
  [UserFields.ID]: string | null;
  [UserFields.PASSWORD]: string | null;
  [UserFields.NAME]: string;
  [UserFields.EMAIL]: string;
  [UserFields.EMAIL]: string;
  [UserFields.AVATAR]?: string;
  [UserFields.IS_ADMIN]?: boolean;
  [UserFields.CONFIGURATION]: Configurations;
}

export const ConfigurationsSchema = new Schema({
  [ConfigFields.STUDY_ID]: { type: String, default: null },
  [ConfigFields.VOCABULARIES]: [
    {
      _id: false,
      id: {
        type: Schema.Types.ObjectId,
        ref: 'Vocabulary',
        required: true,
      },
      name: { type: String, required: true },
    },
  ],
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
  [UserFields.CONFIGURATION]: { type: ConfigurationsSchema, required: true },
});

const User = models.User || model('User', UserSchema);

export default User;
