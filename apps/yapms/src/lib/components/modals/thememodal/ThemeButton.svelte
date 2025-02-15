<script lang="ts">
	interface Props {
		theme: string;
		title: string;
		margins: string[];
	}

	let { theme, title, margins }: Props = $props();
</script>

<button class="btn btn-lg" data-set-theme={theme} data-act-class="ACTIVECLASS">
	<div class="flex flex-col gap-2">
		<h3>{title}</h3>
		<div class="flex flex-row gap-2">
			{#each margins as margin}
				<div
					class="outline outline-1 outline-white w-4 h-4 rounded-full"
					style:background-color={margin}
				></div>
			{/each}
		</div>
	</div>
</button>
