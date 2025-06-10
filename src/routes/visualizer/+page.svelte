<script lang="ts">
	import NiivueViewer from '$lib/components/niivue-viewer.svelte';
</script>

<svelte:head>
	<title>Visualizer - Axonia</title>
</svelte:head>

<div class="mx-auto max-w-7xl px-6 py-16 sm:py-24 lg:px-8">
	<div class="text-center">
		<h1 class="text-3xl font-bold tracking-tight text-white sm:text-4xl">
			Brain MRI <span class="text-emerald-400">Visualizer</span>
		</h1>
		<p class="mt-4 text-lg leading-8 text-gray-400">
			Upload a .nii or .nii.gz file to start exploring.
		</p>
	</div>
	<div class="mt-12">
		<NiivueViewer />
	</div>
</div> 