'use client';
import { useEffect, useRef, useState } from 'react';
import { IUser } from '@/lib/database/models/user.model';
import { IVocabulary, Repeated, Word } from '@/lib/database/models/vocabulary.model';
import { updateVocabularyList } from '@/lib/actions/vocabulary.actions';
import { AppRouterPath, MAX_NUMBER_DEFINING_NEW, RepeatedConst } from '@/constants';
import { checkIsWordNew, defineMode, defineOptionalSet } from './studying-helpers';
import { deepCopy, getWordProgress, shuffle } from '@/lib/utils';
import MessagePanel from './message-panel/MessagePanel';
import ChoosePanel from './choose-panel/ChoosePanel';
import { useCheer } from '@/utils/hooks';
import WritingPanel from './writing-panel/WritingPanel';
import { Preloader } from '../preloader/Preloader';
import { StudyHeader } from './study-header/StudyHeader';

type WordState = {
    id: string;
    repeated: number;
};

const mockWord: Word = {
    id: '09871234',
    original: 'mock',
    translated: 'mock',
    another: [],
    repeated: {
        translated: 6,
        original: 6,
        wrote: 6,
        prioritized: false
    },
    lastRepeat: 1,
};

export type StudyPanelProps = {
    user: IUser;
    vocabulary: IVocabulary;
};

export default function StudyNewPanel({ vocabulary, user }: StudyPanelProps) {

    const [dataSet, setDataSet] = useState<Word[]>([]);
    const [studiedOrder, setStudiedOrder] = useState(1000);
    const [studiedWord, setStudiedWord] = useState<Word | null>(null);
    const [oneIterationWords, setOneIterationWords] = useState<Word[]>([]);
    const [mode, setMode] = useState<Omit<RepeatedConst, RepeatedConst.PRIORITIZED>>('');
    const repeatWatcher = useRef<WordState[]>([]);
    const [isStudyFinished, setIsStudyFinished] = useState(false);
    const cheerControl = useCheer();
    const isStart = useRef(true);


    const saveProgress = async () => {
        if (dataSet.length > 0) {
            const updatedList = vocabulary.list.map(word => {
                const matched = dataSet?.find(d => d.id === word.id);
                return matched ? matched : word;
            });
            await updateVocabularyList(vocabulary._id, updatedList, AppRouterPath.HOME);
        }
    };

    useEffect(() => {
        if (isStudyFinished) {
            cheerControl.clearCheer();
            saveProgress();
        }
    }, [isStudyFinished]);

    useEffect(() => {
        if (vocabulary.list.length === 0)
            return;
        const listToStudy = prepareListToStudy(vocabulary.list);
        repeatWatcher.current = listToStudy.map(word => ({ id: word.id, repeated: 0 }));
        setStudiedOrder(0);
        setDataSet(listToStudy);
        isStart.current = false;
    }, [vocabulary]);

    useEffect(() => {
        if (studiedOrder < 1000 && dataSet.length > 0)
            defineWords();
    }, [studiedOrder]);

    const prepareListToStudy = (collection: Word[]) => {
        let filteredByNew = collection.filter(word => checkIsWordNew(word));
        filteredByNew.sort((a, b) => getWordProgress(a) < getWordProgress(b) ? 1 : -1);

        if (filteredByNew.length > user.configuration.limitNew)
            filteredByNew = filteredByNew.slice(0, user.configuration.limitNew);

        let shuffledData = shuffle(filteredByNew);
        if (shuffledData.length === 1)
            shuffledData.push(mockWord);
        return shuffledData;
    };

    const defineWords = () => {
        let order = defineOrder();
        if (order !== studiedOrder) {
            setStudiedOrder(order);
            return;
        }
        setStudiedWord(deepCopy(dataSet[order]));

        const mode = defineMode(dataSet[order], user.configuration.modeWrite);
        setMode(mode);

        const optionalSet = defineOptionalSet(order, vocabulary.list, dataSet);
        setOneIterationWords(optionalSet);
    };

    const defineOrder = () => {
        let order = studiedOrder;
        let count = 1;
        while (true) {
            const isWordSuitable = checkIsWordSuitable(order);
            if (count === dataSet.length && !isWordSuitable) {
                setIsStudyFinished(true);
                order = 1000;
                break;
            }
            if (isWordSuitable) {
                break;
            } else {
                order = (order === dataSet.length - 1) ? 0 : order + 1;
                count++;
            }
        }
        return order;
    };

    const checkIsWordSuitable = (order: number) => {
        const currentWord = dataSet[order];
        const isStillNew = checkIsWordNew(currentWord);
        const isRepeatedTimeNotFinished = (repeatWatcher.current.find(w => w.id === currentWord.id) as WordState).repeated < 3;
        return isStillNew && isRepeatedTimeNotFinished;
    };

    const update = (isCorrectAnswer: boolean) => {
        setNextWordOrder();
        changeWatcher();
        if (isCorrectAnswer)
            updateDataSet();
    };

    const setNextWordOrder = () => setStudiedOrder(dataSet.length - 1 === studiedOrder ? 0 : studiedOrder + 1);

    const changeWatcher = () => {
        repeatWatcher.current.forEach(rw => {
            if (rw.id === studiedWord?.id)
                rw.repeated++;
        });
    };

    const updateDataSet = () => {
        if (studiedWord) {
            const m = mode as keyof Omit<Repeated, RepeatedConst.PRIORITIZED>;
            studiedWord.repeated[m] = studiedWord.repeated[m] + 1;
            const updatedData = dataSet.map(e => e.id === studiedWord.id ? studiedWord : e);
            setDataSet(updatedData);
        }
    };

    const again = () => {
        setIsStudyFinished(false);
    };

    const getPanel = () => {
        if (isStart.current)
            return <div></div>;
        if (dataSet.length === 0)
            return <MessagePanel legend={'You learned all words'} messages={['Please add new words in "My vocabulary"']} />;
        else if (isStudyFinished)
            return <MessagePanel messages={['Study is finished']}>
                <button className='button' onClick={again}>Try again</button>
            </MessagePanel>;
        else if (studiedWord)
            return mode !== RepeatedConst.WROTE ? (
                <ChoosePanel
                    studyWord={studiedWord}
                    optionalWords={oneIterationWords}
                    mode={mode}
                    onSave={update}
                    noNewNumber={MAX_NUMBER_DEFINING_NEW}
                    config={user.configuration}
                    cheerControl={cheerControl}
                />
            ) : (
                <WritingPanel
                    studyWord={studiedWord}
                    onSave={update}
                    isHint={user.configuration.hints}
                    config={user.configuration}
                    cheerControl={cheerControl}
                />
            );
        else
            return <Preloader />;
    };

    return (
        <section className="flex flex-col items-center mx-8">
            <StudyHeader
                cheerControl={cheerControl}
                studiedWord={studiedWord}
                changeWord={setStudiedWord}
                showStar={false}
            />
            {getPanel()}
        </section>
    );
}
