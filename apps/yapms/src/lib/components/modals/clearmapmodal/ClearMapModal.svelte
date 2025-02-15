<script lang="ts">
	import { TossupCandidateStore } from '$lib/stores/Candidates';
	import { ClearMapModalStore } from '$lib/stores/Modals';
	import { RegionsStore } from '$lib/stores/regions/Regions';
	import { get } from 'svelte/store';
	import ModalBase from '../ModalBase.svelte';

	function clearMap() {
		const regions = get(RegionsStore);
		regions.forEach((region) => {
			region.candidates = [
				{
					candidate: $TossupCandidateStore,
					margin: 0,
					count: region.value
				}
			];
		});
		RegionsStore.set(regions);
	}

	function confirm() {
		clearMap();
		$ClearMapModalStore.open = false;
	}
</script>

<ModalBase title="Clear Map" store={ClearMapModalStore}>
	{#snippet content()}
		<div >
			<p>Clearing the map will result in all of your progress being cleared. Are you sure?</p>
		</div>
	{/snippet}
	{#snippet action()}
		<div >
			<button class="btn btn-error" onclick={confirm}>confirm</button>
		</div>
	{/snippet}
</ModalBase>
