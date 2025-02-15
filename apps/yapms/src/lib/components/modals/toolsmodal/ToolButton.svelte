<script lang="ts">
	import { ToolsModalStore } from '$lib/stores/Modals';
	import type { Writable } from 'svelte/store';

	interface Props {
		text: string;
		store: Writable<{ open: boolean }>;
	}

	let { text, store }: Props = $props();

	function openToolModal() {
		$store.open = true;
		$ToolsModalStore.open = false;
	}
</script>

<button class="btn btn-primary" onclick={openToolModal}>
	{text}
</button>
