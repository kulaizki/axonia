<script lang="ts">
  import NiivueViewer from "$lib/components/niivue-viewer.svelte";
</script>

<svelte:head>
  <title>NiiVue Viewer</title>
</svelte:head>

<main class="max-w-[1200px] mx-auto p-8"> 
  <h1 class="text-2xl font-bold mb-4">NiiVue Neuroimaging Viewer</h1> 
  <p class="mb-4">Upload a .nii or .nii.gz file to visualize it:</p> 

  <NiivueViewer />

  <footer class="mt-8 text-center text-gray-500 text-xs"> 
    <p>Built with SvelteKit and NiiVue</p>
  </footer>
</main>