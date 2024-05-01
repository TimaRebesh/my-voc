export type SearchParamProps = {
  params: {
    id: string;
    elementId: string;
  };
};

export type Topic = {
  id: number;
  name: string;
};

export type Configurations = {
  studyID: string | null;
  vocabularies: Topic[];
  modeWrite: boolean;
  hints: boolean;
  limitAll: number; // how many all words proctice in one session
  limitNew: number; // how many new words proctice in one session
  theme: Theme;
};

export type Theme = 'white' | 'dark';
