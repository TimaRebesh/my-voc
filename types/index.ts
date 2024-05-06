import { ConfigFields, ThemeValues } from '@/constants';

const ID = 'id';
const NAME = 'name';

export type SearchParamProps = {
  params: {
    [ID]: string;
    elementId: string;
  };
};

export type Topic = {
  [ID]: string;
  [NAME]: string;
};

export type Configurations = {
  [ConfigFields.STUDY_ID]: string | null;
  [ConfigFields.VOCABULARIES]: Topic[];
  [ConfigFields.MODE_WRITE]: boolean;
  [ConfigFields.HINTS]: boolean;
  [ConfigFields.LIMIT_ALL]: number; // how many all words proctice in one session
  [ConfigFields.LIMIT_NEW]: number; // how many new words proctice in one session
  [ConfigFields.THEME]: Theme;
};

export type Theme = ThemeValues.DARK | ThemeValues.LIGHT | ThemeValues.SYSTEM;
