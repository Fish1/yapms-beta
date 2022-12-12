import { get } from 'svelte/store';
import { ModeStore } from '$lib/stores/Mode';
import { RegionsStore } from '$lib/stores/Regions';
import { TossupCandidateStore, SelectedCandidateStore } from '$lib/stores/Candidates';
import { EditRegionModalStore } from '$lib/stores/Modals';
import type Region from '$lib/types/Region';
import { InteractionStore } from '$lib/stores/Interaction';
import { text } from 'svelte/internal';

function fillRegion(regionID: string, increment: boolean) {
	const regions = get(RegionsStore);
	const region = regions.find((region) => region.id === regionID);
	if (region) {
		const selectedCandidate = get(SelectedCandidateStore);
		const currentCandidate = region.candidates[0];
		const newCandidate = {
			candidate: selectedCandidate,
			count: region.value,
			margin: 0
		};
		if (currentCandidate.candidate.id === selectedCandidate.id && increment === true) {
			newCandidate.margin =
				currentCandidate.margin + 1 >= selectedCandidate.margins.length
					? 0
					: currentCandidate.margin + 1;
		}
		region.candidates = [newCandidate];
		RegionsStore.set(regions);
	}
}

function editRegion(regionID: string) {
	const region = get(RegionsStore).find((region) => region.id === regionID);
	EditRegionModalStore.set({
		region: region ?? null,
		open: region !== undefined
	});
}

function loadRegions(node: HTMLDivElement): void {
	const regionsForStore: Region[] = [];
	const regions = node.querySelector('.regions');
	const buttons = node.querySelector('.region-buttons');
	const texts = node.querySelector('.region-texts');
	const tossupCandidate = get(TossupCandidateStore);

	// set cursor & pointer styles
	(regions as HTMLElement).style.cursor = 'pointer';
	(buttons as HTMLElement).style.cursor = 'pointer';
	(texts as HTMLElement).style.pointerEvents = 'none';

	regions?.childNodes.forEach((childNode) => {
		const childHTML = childNode as HTMLElement;
		if (childHTML.getAttribute === undefined) {
			return;
		}

		const value = parseInt(childHTML.getAttribute('value') || '0', 10);
		const newRegion: Region = {
			id: childHTML.getAttribute('class') ?? '',
			shortName: childHTML.getAttribute('short-name') ?? '',
			longName: childHTML.getAttribute('long-name') ?? '',
			value,
			disabled: false,
			candidates: [{ candidate: tossupCandidate, count: value, margin: 0 }],
			nodes: {
				region: childHTML,
				button: buttons?.querySelector(`[for="${childHTML.getAttribute('class') ?? ''}"]`) ?? null,
				text: texts?.querySelector(`[for="${childHTML.getAttribute('class') ?? ''}"]`) ?? null
			}
		};

		newRegion.nodes.region.onclick = () => {
			const currentMode = get(ModeStore);
			switch (currentMode) {
				case 'fill':
					fillRegion(newRegion.id, true);
					break;
				case 'edit':
					editRegion(newRegion.id);
					break;
				case 'disable': {
					throw new Error('Not implemented yet: "disable" case');
				}
			}
		};

		newRegion.nodes.region.onmousemove = () => {
			const currentMode = get(ModeStore);
			const currentInteractions = get(InteractionStore);

			if (currentMode === 'fill' && currentInteractions.has('KeyF')) {
				fillRegion(newRegion.id, false);
			}
		};

		if (newRegion.nodes.button !== null) {
			newRegion.nodes.button.onclick = newRegion.nodes.region.onclick;
			newRegion.nodes.button.onmousemove = newRegion.nodes.region.onmousemove;
		}

		newRegion.nodes.region.style.fill = tossupCandidate.margins[0].color;

		if (newRegion.nodes.button) {
			newRegion.nodes.button.style.fill = tossupCandidate.margins[0].color;
		}

		if (newRegion.nodes.text) {
			const bottom = newRegion.nodes.text.querySelector('.bottom');
			if (bottom) {
				bottom.textContent = newRegion.value.toString();
			}
		}

		regionsForStore.push(newRegion);
	});

	RegionsStore.set(regionsForStore);
}

export default loadRegions;
