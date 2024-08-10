<script lang="ts">
	import VideoCameraSlash from '$lib/icons/VideoCameraSlash.svelte';
	import { PresentationModeStore } from '$lib/stores/PresentationMode';
	import { afterUpdate, beforeUpdate, onMount } from 'svelte';
	import LockButton from './buttons/LockButton.svelte';

	let inside = false;

	function togglePresentationMode() {
		$PresentationModeStore.enabled = !$PresentationModeStore.enabled;
	}

	function toggleHover() {
		inside = !inside;
		console.log('TOGGLE');
	}

	onMount(() => {
		console.log('mount');
	});

	beforeUpdate(() => {
		console.log('before update', inside);
	});

	afterUpdate(() => {
		console.log('after update', inside);
	});
</script>

<div
	class="absolute right-0 m-1 z-10 flex flex-col gap-3 align-middle"
	on:mouseenter={toggleHover}
	on:mouseleave={toggleHover}
	role="button"
	tabindex={1}
>
	<button class="btn btn-md btn-circle btn-error self-middle" on:click={togglePresentationMode}>
		<VideoCameraSlash class="w-6 h-6" />
	</button>
	{#if inside}
		<LockButton />
	{/if}
</div>
