'use client';
import { Word } from '@/lib/database/models/vocabulary.model';
import { useEffect, useRef, useState } from 'react';
import { IConfigurations } from '@/lib/database/models/user.model';
import { Button } from '@/components/ui/button';
import { StudyingWord } from '../studying-word/StudyingWord';
import { cn } from '@/lib/utils';
import { isMobile } from '../studying-helpers';
import { CheerInterface } from '@/utils/hooks';
import { RepeatedConst } from '@/constants';

type ChooseProps = {
	studyWord: Word;
	optionalWords: Word[];
	mode: Omit<RepeatedConst, RepeatedConst.PRIORITIZED>;
	onSave: (isCorrect: boolean) => void;
	noNewNumber: number;
	config: IConfigurations;
	cheerControl: CheerInterface;
};

export default function ChoosePanel(props: ChooseProps) {

	const [chosenID, setChosenID] = useState('');

	const buttonsGroupRef = useRef<HTMLDivElement>(null);
	const nextButtonRef = useRef<HTMLButtonElement>(null);

	useEffect(() => {
		const callback = (e: any) => {

			if (e.target.localName === 'button')
				e.target.focus();
		};
		buttonsGroupRef.current?.addEventListener('mouseover', callback);
		return () => {
			buttonsGroupRef.current?.removeEventListener('mouseover', callback);
		};
	}, []);

	useEffect(() => {
		if (chosenID)
			nextButtonRef.current?.focus();
	}, [chosenID]);


	useEffect(() => {
		const mobile = isMobile();
		if (!mobile) {
			const div = buttonsGroupRef.current as HTMLDivElement;
			const button = div.children[0] as HTMLButtonElement;
			button?.focus();
		}
	}, [props.optionalWords]);

	const buttonStatus = (id: string) => {
		if (chosenID && chosenID !== id && id !== props.studyWord.id)
			return 'bg-muted-foreground hover:bg-muted-foreground focus-visible:bg-muted-foreground';
		if (chosenID === props.studyWord.id && chosenID === id)
			return 'bg-success hover:bg-success focus-visible:bg-success';
		if (chosenID !== props.studyWord.id && chosenID === id)
			return 'bg-destructive hover:bg-destructive focus-visible:bg-destructive';
		if (chosenID && chosenID !== props.studyWord.id && props.studyWord.id === id)
			return 'bg-success-hover hover:bg-success-hover focus-visible:bg-success-hover';
		return '';
	};

	const check = (id: string) => {
		setChosenID(id);
		(id === props.studyWord.id) && props.cheerControl.setCheer();
	};

	const next = () => {
		props.onSave(chosenID === props.studyWord.id);
		setChosenID('');
		props.cheerControl.clearCheer();
	};

	const keyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
		if (e.key === 'ArrowDown') {
			const elFocusID = +(document.activeElement as HTMLButtonElement).id;
			if (elFocusID === props.optionalWords.length - 1)
				((buttonsGroupRef.current as HTMLDivElement).children[0] as HTMLButtonElement).focus();
			else
				((buttonsGroupRef.current as HTMLDivElement).children[elFocusID + 1] as HTMLButtonElement).focus();
		}
		if (e.key === 'ArrowUp') {
			const elFocusID = +(document.activeElement as HTMLButtonElement).id;
			if (elFocusID > 0)
				((buttonsGroupRef.current as HTMLDivElement).children[elFocusID - 1] as HTMLButtonElement).focus();
			else
				((buttonsGroupRef.current as HTMLDivElement).children[props.optionalWords.length - 1] as HTMLButtonElement).focus();
		}
	};

	return <>
		<StudyingWord mode={props.mode} studyWord={props.studyWord} config={props.config} />
		<div
			ref={buttonsGroupRef}
			className='flex flex-col space-y-2  w-full m-auto relative items-center justify-center'
			onKeyDown={keyDown}>
			{props.optionalWords.map((o, order) =>
				<Button className={cn('h-14 w-full', buttonStatus(o.id))}
					key={o.id}
					id={order.toString()}
					onClick={() => !chosenID && check(o.id)}
					style={{ pointerEvents: !!chosenID ? 'none' : 'auto' }}
				>{props.mode === 'original' ? o['translated'] : o['original']}</Button>)
			}
			<div className='w-full pt-8'>
				{chosenID &&
					<Button variant='next' className='w-full'
						ref={nextButtonRef} onClick={next}>Next</Button>}
			</div>
		</div >
	</>;
}
