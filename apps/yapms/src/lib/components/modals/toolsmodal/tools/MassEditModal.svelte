<script lang="ts">
	import { MassEditModalStore } from '$lib/stores/Modals';
	import { RegionsStore } from '$lib/stores/regions/Regions';
	import ModalBase from '../../ModalBase.svelte';
	let value = $state(1);
	
	function preventNonNumericalInput(e: KeyboardEvent) {
		if (e.key !== 'Enter' && !e.key.match(/^[0-9]+$/)) e.preventDefault();
	}
	function preventNonNumericalPaste(e: ClipboardEvent) {
		const pasteContents = e.clipboardData?.getData(e.clipboardData.types[0]);
		if (!pasteContents?.match(/^[0-9]+$/)) e.preventDefault();
	}
	function confirm() {
		if (value === null) {
			return;
		}
		$RegionsStore.forEach((region) => {
			if (!region.disabled && !region.permaLocked) {
				region.value = value;
			}
			region.permaVal = value;
		});
		$MassEditModalStore.open = false;
		$RegionsStore = $RegionsStore;
	}
</script>

<ModalBase title="Edit All Regions" store={MassEditModalStore}>
	{#snippet content()}
		<div >
			<div class="form-control w-full flex flex-col gap-3">
				<h3 class="font-light text-lg">Region Value</h3>
				<form onsubmit={confirm}>
					<input
						type="number"
						class="input input-bordered w-full"
						min="0"
						onkeypress={preventNonNumericalInput}
						onpaste={preventNonNumericalPaste}
						bind:value
					/>
				</form>
			</div>
		</div>
	{/snippet}
	{#snippet action()}
		<div >
			<button class="btn btn-success" onclick={confirm}>Confirm</button>
		</div>
	{/snippet}
</ModalBase>
