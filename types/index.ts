import { ConfigFields, ThemeValues } from '@/constants';

export const ID = 'id';
export const NAME = 'name';

export type SearchParamProps = {
  params: {
    [ID]: string;
    elementId: string;
  };
};

export type Theme = ThemeValues.DARK | ThemeValues.LIGHT | ThemeValues.SYSTEM;
