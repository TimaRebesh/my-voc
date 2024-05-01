import { UserFields } from '@/constants';
import { Configurations } from '@/types';
import { Schema, model, models } from 'mongoose';

export interface UserType {
  [UserFields.ID]: string | null;
  [UserFields.PASSWORD]: string | null;
  [UserFields.NAME]: string;
  [UserFields.EMAIL]: string;
  [UserFields.AVATAR]?: string;
  [UserFields.IS_ADMIN]?: boolean;
  [UserFields.CONFIGURATION]: Configurations;
}

export const TopicSchema = new Schema({
  id: { type: Number, required: true },
  name: { type: String, required: true },
});

export const ConfigurationsSchema = new Schema({
  studyID: { type: String, default: null },
  vocabularies: { type: [TopicSchema], required: true },
  modeWrite: { type: Boolean, required: true },
  hints: { type: Boolean, required: true },
  limitAll: { type: Number, required: true },
  limitNew: { type: Number, required: true },
  theme: { type: String, enum: ['white', 'dark'], required: true },
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
