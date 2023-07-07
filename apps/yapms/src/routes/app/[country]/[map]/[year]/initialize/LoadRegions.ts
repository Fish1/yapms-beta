import { get } from 'svelte/store';
import { ModeStore } from '$lib/stores/Mode';
import {
	RegionsStore,
	setPointerEvents,
	setTransitionStyle,
	setCursorStyle
} from '$lib/stores/regions/Regions';
import {
	TossupCandidateStore,
	CandidatesStore,
	CandidateStoreSchema,
	CandidatesStoreDefault,
	TossupCandidateStoreDefault
} from '$lib/stores/Candidates';
import type Region from '$lib/types/Region';
import { ModeSchema } from '$lib/types/Mode';
import { CandidateSchema } from '$lib/types/Candidate';
import { RegionCandidatesSchema, type RegionCandidates } from '$lib/types/Region';

function createDefaultModeStore(node: HTMLDivElement) {
	const defaultModeAttribute = node.querySelector('svg')?.getAttribute('default-mode');
	const defaultMode = ModeSchema.safeParse(defaultModeAttribute);
	if (defaultMode.success) {
		ModeStore.set(defaultMode.data);
	} else {
		console.error('Error Parsing defaultMode attribute from Map:\n\n' + defaultMode.error);
	}
}

function createCandidateStore(node: HTMLDivElement) {
	try {
		const candidatesStringified = node.querySelector('svg')?.getAttribute('candidates'); //This doesn't return SVG other than the map SVG
		const candidates = candidatesStringified != null ? JSON.parse(candidatesStringified) : null; //If candidate property not set, set candidates to null so the next check knows to use default candidates.
		if (candidates !== null) {
			////If no candidates are defined in SVG, use generics defined in stores/Candidates.ts
			CandidatesStore.set(CandidateStoreSchema.parse(candidates));
		} else {
			CandidatesStore.set(CandidatesStoreDefault);
		}
	} catch (error) {
		console.error('Error Parsing Candidate Data from Map:\n\n' + error);
	}
}

function createTossupCandidateStore(node: HTMLDivElement) {
	try {
		const tossupStringified = node.querySelector('svg')?.getAttribute('tossup-candidate');
		const tossup = tossupStringified != null ? JSON.parse(tossupStringified) : null;
		if (tossup !== null) {
			TossupCandidateStore.set(CandidateSchema.parse(tossup));
		} else {
			TossupCandidateStore.set(TossupCandidateStoreDefault);
		}
	} catch (error) {
		console.error('Error Parsing Tossup Candidate Data from Map:\n\n' + error);
	}
}

function findCandidate(id: string) {
	const candidate = get(CandidatesStore).find((candidate) => candidate.id === id);
	if (candidate === undefined) {
		return get(TossupCandidateStore);
	} else {
		return candidate;
	}
}

function getCandidatesForRegion(candidateStr: string | null, value: number) {
	if (candidateStr === null) {
		return [{ candidate: get(TossupCandidateStore), count: value, margin: 0 }];
	}
	try {
		const parsedArr: RegionCandidates = JSON.parse(candidateStr);
		RegionCandidatesSchema.parse(parsedArr);
		let totCount = 0;
		const candidateArr = [];
		parsedArr.forEach((elem) => {
			totCount += elem.count;
			candidateArr.push({
				...elem,
				candidate: findCandidate(elem.candidate)
			});
		});
		if (totCount !== value) {
			candidateArr.push({
				candidate: get(TossupCandidateStore),
				count: value - totCount,
				margin: 0
			});
		}
		return candidateArr;
	} catch (err) {
		console.error('Error Parsing candidates attribute from region:\n\n' + err);
		return [{ candidate: get(TossupCandidateStore), count: value, margin: 0 }];
	}
}

function createRegionStore(node: HTMLDivElement) {
	const regionsForStore = Array<Region>();
	const regions = node.querySelector<HTMLElement>('.regions');
	const buttons = node.querySelector<HTMLElement>('.region-buttons');
	const texts = node.querySelector<HTMLElement>('.region-texts');
	const tossupCandidate = get(TossupCandidateStore);

	if (regions === null) return;
	for (const child of regions.childNodes) {
		const childHTML = child as HTMLElement;
		if (childHTML.getAttribute === undefined) {
			continue;
		}

		const value = Number(childHTML.getAttribute('value'));
		const newRegion: Region = {
			id: childHTML.getAttribute('region') ?? '',
			shortName: childHTML.getAttribute('short-name') ?? '',
			longName: childHTML.getAttribute('long-name') ?? '',
			value: childHTML.hasAttribute('disabled') ? 0 : value,
			permaVal: value,
			disabled: childHTML.hasAttribute('disabled'),
			locked: childHTML.hasAttribute('locked'),
			permaLocked: childHTML.hasAttribute('permalocked'),
			candidates: childHTML.getAttribute('candidates') //God bless our linting overlords.
				? getCandidatesForRegion(childHTML.getAttribute('candidates'), value)
				: [{ candidate: tossupCandidate, count: value, margin: 0 }],
			nodes: {
				region: childHTML,
				button: buttons?.querySelector(`[for="${childHTML.getAttribute('region') ?? ''}"]`) ?? null,
				text: texts?.querySelector(`[for="${childHTML.getAttribute('region') ?? ''}"]`) ?? null
			}
		};

		newRegion.nodes.region.style.fill = tossupCandidate.margins[0].color;

		if (newRegion.nodes.button !== null) {
			newRegion.nodes.button.style.fill = tossupCandidate.margins[0].color;
		}

		if (newRegion.nodes.text !== null) {
			const bottom = newRegion.nodes.text.querySelector('.bottom');
			if (bottom !== null) {
				bottom.textContent = newRegion.value.toString();
			}
		}

		regionsForStore.push(newRegion);
	}

	RegionsStore.set(regionsForStore);
}

export function loadRegionsForApp(node: HTMLDivElement): void {
	createCandidateStore(node);
	createTossupCandidateStore(node);
	createDefaultModeStore(node);
	createRegionStore(node);
	setCursorStyle();
	setTransitionStyle();
	setPointerEvents();
}

export function loadRegionsForView(node: HTMLDivElement): void {
	createCandidateStore(node);
	createTossupCandidateStore(node);
	createRegionStore(node);
}
