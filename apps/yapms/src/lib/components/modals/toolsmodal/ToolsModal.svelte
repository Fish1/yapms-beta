<script lang="ts">
	import { MassEditModalStore, ToolsModalStore } from '$lib/stores/Modals';
	import ModalBase from '../ModalBase.svelte';
	import ToolButton from './ToolButton.svelte';
	import MassEditModal from './tools/MassEditModal.svelte';
</script>

<ModalBase title="Tools" store={ToolsModalStore}>
	{#snippet content()}
		<div >
			<div class="flex flex-col gap-y-2 mx-5">
				<ToolButton text={'Edit All Regions'} store={MassEditModalStore} />
			</div>
		</div>
	{/snippet}
</ModalBase>

<MassEditModal />
