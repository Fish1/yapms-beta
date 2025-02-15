<script lang="ts">
	import { run } from 'svelte/legacy';

	import { EditRegionModalStore } from '$lib/stores/Modals';
	import { RegionsStore } from '$lib/stores/regions/Regions';
	import ModalBase from '../ModalBase.svelte';



	let valueInput: HTMLInputElement = $state();

	function focusInput() {
		if (valueInput) {
			valueInput.focus();
		}
	}

	function preventNonNumericalInput(e: KeyboardEvent) {
		if (e.key !== 'Enter' && !e.key.match(/^[0-9]+$/)) e.preventDefault();
	}

	function preventNonNumericalPaste(e: ClipboardEvent) {
		const pasteContents = e.clipboardData?.getData(e.clipboardData.types[0]);
		if (!pasteContents?.match(/^[0-9]+$/)) e.preventDefault();
	}

	function confirm() {
		if (newValue === null) {
			newValue = 0;
		}
		const index = $RegionsStore.findIndex(
			(region) => region.id === $EditRegionModalStore.region?.id
		);
		if (!$RegionsStore[index].disabled) {
			//Don't update value if disabled so the state stays disabled!
			$RegionsStore[index].value = newValue;
		}
		$RegionsStore[index].permaVal = newValue;
		$EditRegionModalStore.open = false;
	}
	let open = $derived($EditRegionModalStore.open);
	let longName = $derived(open ? $EditRegionModalStore.region?.longName : undefined);
	let value = $derived(open ? $EditRegionModalStore.region?.permaVal : undefined);
	let newValue;
	run(() => {
		newValue = value ?? 0;
	});
	run(() => {
		if (open) focusInput();
	});
</script>

<ModalBase title="Edit Region {longName} - {value}" store={EditRegionModalStore}>
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
						bind:value={newValue}
						bind:this={valueInput}
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
