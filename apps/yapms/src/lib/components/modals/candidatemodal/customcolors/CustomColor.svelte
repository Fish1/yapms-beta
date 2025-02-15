<script lang="ts">
	import MinusCircle from '$lib/icons/MinusCircle.svelte';
	import { calculateLumaHEX } from '$lib/utils/luma';

	interface Props {
		color: string;
		onChange: (color: string) => void;
		onDelete: () => void;
	}

	let { color = $bindable(), onChange, onDelete }: Props = $props();

	let colorInput: HTMLInputElement | undefined = $state();

	let textColor = $derived(calculateLumaHEX(color) > 0.5 ? 'black' : 'white');

	function editColor() {
		colorInput?.click();
	}

	function changeColor(event: Event & { currentTarget: EventTarget & HTMLInputElement }) {
		onChange(event.currentTarget.value);
	}

	function removeColor() {
		onDelete();
	}
</script>

<div class="join items-center">
	<button class="btn join-item btn-sm" onclick={editColor} style:background-color={color}>
		<span style:color={textColor}>{color}</span>
		<input
			bind:this={colorInput}
			bind:value={color}
			type="color"
			class="hidden"
			onchange={changeColor}
		/>
	</button>
	<button class="btn btn-sm btn-error join-item" onclick={removeColor}
		><MinusCircle class="w-6 h-6" /></button
	>
</div>
