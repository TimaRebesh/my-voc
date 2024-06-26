export enum AppRouterPath {
  HOME = '/',
  LOGIN = '/login',
  REGISTER = '/register',
  VOCABULARY = '/vocabulary',
  LIBRARY = '/library',
  ABOUT = '/about',
  SETTINGS = '/settings',
  REPEAT = '/repeat',
  STUDY_NEW = '/study-new',
}

export enum UserFields {
  ID = '_id',
  PASSWORD = 'password',
  NAME = 'name',
  EMAIL = 'email',
  AVATAR = 'avatar',
  CONFIGURATION = 'configuration',
  IS_ADMIN = 'isAdmin',
}

export enum ConfigFields {
  MODE_WRITE = 'modeWrite',
  THEME = 'theme',
  HINTS = 'hints',
  LIMIT_ALL = 'limitAll',
  LIMIT_NEW = 'limitNew',
}

export enum TopicsFields {
  ID = '_id',
  STUDY_ID = 'studyID',
  CREATOR = 'creator',
  TOPIC_LIST = 'topicList',
}

export enum VocabularyFields {
  ID = '_id',
  NAME = 'name',
  LIST = 'list',
  CREATOR = 'creator',
  DESCRIPTION = 'description',
  CREATED_BY = 'createdBy',
  CREATOR_NAME = 'creatorName',
  CREATOR_AVATAR = 'creatorAvatar',
  CREATOR_ID = 'creatorId',
}

export enum ThemeValues {
  LIGHT = 'light',
  DARK = 'dark',
  SYSTEM = 'system',
}

export const uploadThingUrl = 'https://utfs.io';

export const MAX_NUMBER_DEFINING_NEW = 6;

export enum RepeatedConst {
  TRANSLATED = 'translated',
  ORIGINAL = 'original',
  WROTE = 'wrote',
  PRIORITIZED = 'prioritized',
}
