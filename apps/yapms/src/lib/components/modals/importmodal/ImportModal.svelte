<script lang="ts">
	import ArrowUpTray from '$lib/icons/ArrowUpTray.svelte';
	import { ImportModalStore } from '$lib/stores/Modals';
	import { DOMPurifyConfig, importFromGeoJson, importFromShapefiles } from '$lib/utils/importMap';
	import { ImportedSVGStore } from '$lib/stores/ImportedSVG';
	import ExclamationCircle from '$lib/icons/ExclamationCircle.svelte';
	import ModalBase from '../ModalBase.svelte';
	import DocumentDuplicate from '$lib/icons/DocumentDuplicate.svelte';
	import DOMPurify from 'dompurify';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { exportImportAsSVG } from '$lib/utils/importMap';
	import ImportOptions from './ImportOptions.svelte';

	let geoJsonFiles: FileList = $state();
	let shapeFiles: FileList = $state();
	let svgFiles: FileList = $state();

	let loadError = $state(false);
	let loading = $state(false);

	const multipleFilesTooltip =
		'Select multiple files to upload and they will be automatically merged.';

	async function load(importFunc: (files: FileList) => Promise<void>, files: FileList) {
		loading = true;
		try {
			ImportedSVGStore.set({
				...$ImportedSVGStore,
				loaded: false,
				content: ''
			});
			await importFunc(files);
			close?.();
			if ($page.url.pathname !== '/app/imported') {
				await goto('/app/imported');
			}
		} catch (error) {
			console.error(error);
			loadError = true;
		}
		loading = false;
	}

	async function loadSVG(files: FileList) {
		ImportedSVGStore.set({
			...$ImportedSVGStore,
			loaded: true,
			content: DOMPurify.sanitize(await files[0].text(), DOMPurifyConfig)
		});
	}

	function close() {
		$ImportModalStore.open = false;
		if ($page.url.pathname === '/app/imported' && $ImportedSVGStore.loaded === false) {
			goto('/');
		}
	}
</script>

<ModalBase title="Import Map" store={ImportModalStore} onClose={close}>
	{#snippet content()}
		<div >
			<div class="flex flex-col gap-y-2">
				<div class="alert alert-error justify-start" class:hidden={!loadError}>
					<span class="flex gap-x-2"
						><ExclamationCircle class="w-6 h-6" />There was an error loading your map, please try
						again.</span
					>
				</div>
				<div class="alert alert-info justify-start" class:hidden={!loading}>
					<span class="flex gap-x-2"><ArrowUpTray class="w-6 h-6" />Loading Map...</span>
				</div>
				<div class="flex flex-col gap-y-2">
					<div class="flex flex-row gap-x-2">
						<label>
							<div class="flex gap-x-1 mb-2">
								Open From GeoJson
								<div class="tooltip tooltip-bottom" data-tip={multipleFilesTooltip}>
									<DocumentDuplicate class="w-6" />
								</div>
							</div>
							<div class="flex gap-x-2">
								<input
									multiple
									type="file"
									accept=".geojson"
									class="file-input file-input-primary w-full"
									bind:files={geoJsonFiles}
								/>
								<button
									class="btn btn-secondary gap-1 flex-nowrap"
									onclick={() => {
									load(importFromGeoJson, geoJsonFiles);
								}}
									disabled={!geoJsonFiles || geoJsonFiles.length < 1 || loading}
								>
									<ArrowUpTray class="w-5 h-5" />
									<span>Load</span>
								</button>
							</div>
						</label>
					</div>

					<div class="divider divider-vertical mt-1 -mb-1"></div>

					<div class="flex flex-row gap-x-2">
						<label>
							<div class="flex gap-x-1 mb-2">
								Open From Shapefiles
								<div class="tooltip" data-tip={multipleFilesTooltip}>
									<DocumentDuplicate class="w-6" />
								</div>
							</div>
							<div class="flex gap-x-2">
								<input
									multiple
									type="file"
									accept=".shp"
									class="file-input file-input-primary w-full"
									bind:files={shapeFiles}
								/>
								<button
									class="btn btn-secondary gap-1 flex-nowrap"
									onclick={() => {
									load(importFromShapefiles, shapeFiles);
								}}
									disabled={!shapeFiles || shapeFiles.length < 1 || loading}
								>
									<ArrowUpTray class="w-5 h-5" />
									<span>Load</span>
								</button>
							</div>
						</label>
					</div>

					<div class="divider divider-vertical mt-1 -mb-1"></div>

					<div class="flex flex-row gap-x-2">
						<label>
							<div class="mb-2">
								Open from SVG
								<a
									class="underline italic text-sm font-light"
									href="https://github.com/yapms/yapms/wiki/Map-SVG-Format"
									>Works only with YAPms format</a
								>
							</div>
							<div class="flex gap-x-2">
								<input
									type="file"
									accept=".svg"
									class="file-input file-input-primary w-full"
									bind:files={svgFiles}
								/>
								<button
									class="btn btn-secondary gap-1 flex-nowrap"
									onclick={() => {
									load(loadSVG, svgFiles);
								}}
									disabled={!svgFiles || svgFiles.length < 1 || loading}
								>
									<ArrowUpTray class="w-5 h-5" />
									<span>Load</span>
								</button>
							</div>
						</label>
					</div>

					<div class="divider divider-vertical mt-1 -mb-1"></div>

					<ImportOptions />
				</div>
			</div>
		</div>
	{/snippet}

	{#snippet action()}
		<div >
			<button class="btn btn-primary" disabled={false} onclick={exportImportAsSVG}>
				Export SVG
			</button>
		</div>
	{/snippet}
</ModalBase>
