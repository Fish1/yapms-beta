<script lang="ts">
	import { goto } from '$app/navigation';
	import { NavigateHomeModalStore } from '$lib/stores/Modals';
	import ModalBase from '../ModalBase.svelte';

	function confirm() {
		$NavigateHomeModalStore.open = false;
		goto('/');
	}
</script>

<ModalBase title="Navigate Home" store={NavigateHomeModalStore}>
	{#snippet content()}
		<div >
			<p>Navigating home will result in all of your progress being cleared. Are you sure?</p>
		</div>
	{/snippet}

	{#snippet action()}
		<div >
			<button class="btn btn-error" onclick={confirm}>Confirm</button>
		</div>
	{/snippet}
</ModalBase>
