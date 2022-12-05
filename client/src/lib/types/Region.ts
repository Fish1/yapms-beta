import type { Candidate } from './Candidate';

export type Region = {
	id: string;
	shortName: string;
	longName: string;
	value: number;
	disabled: boolean;
	candidates: { candidate: Candidate; count: number; margin: number }[];
	nodes: {
		region: HTMLElement;
		button: HTMLElement | null;
		text: HTMLElement | null;
	};
};
