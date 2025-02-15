<script lang="ts">
	import { run } from 'svelte/legacy';

	import { loadFromJson } from '$lib/utils/loadMap';
	import { page } from '$app/stores';
	import { MapInsetsStore } from '$lib/stores/MapInsetsStore';
	import { applyAutoStroke, applyPanZoom } from '$lib/utils/applyPanZoom';
	import { loadRegionsForApp } from '$lib/utils/loadRegions';
	import { goto } from '$app/navigation';
	import { browser } from '$app/environment';
	import { loadMapFromURL, LoadedMapStore } from '$lib/stores/LoadedMap';
	import { loadSidebarTitle, loadSidebarSources } from '$lib/stores/SideBar';
	import { loadMapIdentifier } from '$lib/stores/MapIdentifier';
	import { loadActionGroups } from '$lib/stores/ActionGroups';
	import { RegionTextsStore } from '$lib/stores/RegionTextsStore';
	import { setRegionStrokeColor } from '$lib/stores/RegionStrokeColorStore';
	interface Props {
		children?: import('svelte').Snippet;
	}

	let { children }: Props = $props();

	let requestedMap = $derived($page.url.pathname.replace('/app/', '').replaceAll('/', '-'));
	let country = $derived(requestedMap.split('-').at(0));
	let map = $derived(import(`../../../lib/assets/maps/${country}/${requestedMap}.svg?raw`));

	run(() => {
		map.catch(() => {
			if (browser) goto('/');
		});
	});

	function setupMap(node: HTMLDivElement) {
		const svg = node.querySelector<SVGElement>('svg');
		if (svg !== null) {
			applyPanZoom(svg);
			applyAutoStroke(svg);
			setRegionStrokeColor(svg);
			loadSidebarTitle(svg);
			loadSidebarSources(svg);
			loadMapIdentifier(svg);
			loadActionGroups(svg);
		}
		loadRegionsForApp(node);
		loadMapFromURL($page.url);
	}

	run(() => {
		if ($LoadedMapStore) loadFromJson($LoadedMapStore);
	});
</script>

{#await map}
	<div class="flex justify-center w-full h-full">
		<span class="loading loading-ring loading-lg text-primary"></span>
	</div>
{:then map}
	<div
		use:setupMap
		id="map-div"
		class="overflow-hidden h-full outline-none"
		class:insets-hidden={$MapInsetsStore.hidden}
		class:texts-hidden={$RegionTextsStore.hidden}
	>
		{@html map.default}
	</div>
{/await}
{@render children?.()}
