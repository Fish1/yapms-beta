<script lang="ts">
	interface Props {
		title: string;
	}

	let { title }: Props = $props();
</script>

<h3 class="text-2xl pb-3">
	{title}
</h3>
