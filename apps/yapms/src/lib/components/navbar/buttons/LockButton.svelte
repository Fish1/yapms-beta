<script lang="ts">
	import LockClosed from '$lib/icons/LockClosed.svelte';
	import LockOpen from '$lib/icons/LockOpen.svelte';
	import { LockMapStore } from '$lib/stores/LockMap';

	function toggleMapLock() {
		$LockMapStore = !$LockMapStore;
	}
</script>

<button class="btn btn-md btn-neutral btn-circle self-middle" on:click={toggleMapLock}>
	{#if $LockMapStore}
		<LockClosed class="w-6 h-6" />
	{:else}
		<LockOpen class="w-6 h-6" />
	{/if}
</button>
