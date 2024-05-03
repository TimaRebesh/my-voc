export enum AppRouterPath {
  HOME = '/',
  LOGIN = '/login',
  REGISTER = '/register',
  // PROFILE = '/profile',
  ABOUT = '/about',
  SETTINGS = '/settings',
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
  THEME = 'theme',
  MODE_WRITE = 'modeWrite',
  HINTS = 'hints',
  LIMIT_ALL = 'limitAll',
  LIMIT_NEW = 'limitNew',
}

export enum VocabularyFields {
  NAME = 'name',
  LIST = 'list',
  CREATOR = 'creator',
}

export enum ThemeValues {
  LIGHT = 'light',
  DARK = 'dark',
  SYSTEM = 'system',
}
