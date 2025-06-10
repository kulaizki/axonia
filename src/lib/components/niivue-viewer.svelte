<script lang="ts">
  import NiiVueCanvas from '$lib/components/niivue/niivue-canvas.svelte';
  import FileUploader from '$lib/components/niivue/file-uploader.svelte';
  import ViewControls from '$lib/components/niivue/view-controls.svelte';
  import InteractionGuide from '$lib/components/niivue/interaction-guide.svelte';
  import { niivueStore } from '$lib/stores/niivueStore';
  import type { Niivue } from '@niivue/niivue';
</script>

<div class="flex flex-col w-full max-w-6xl mx-auto space-y-6">
  <div class="flex flex-wrap gap-x-6 gap-y-4 justify-between items-center border-b pb-4 border-gray-700">
    <FileUploader />
    <ViewControls />
  </div>

  <div class="w-full h-[65vh] min-h-[450px] border border-gray-700 rounded-lg overflow-hidden bg-black shadow-lg relative">
    <NiiVueCanvas />
    
    {#if !$niivueStore.isReady && !$niivueStore.errorMessage}
      <div class="absolute inset-0 flex items-center justify-center text-gray-600 pointer-events-none">
        <p class="bg-gray-900 bg-opacity-80 text-gray-300 px-4 py-2 rounded-md">Initializing Viewer...</p>
      </div>
    {:else if $niivueStore.isReady && !$niivueStore.currentFile && !$niivueStore.errorMessage}
      <div class="absolute inset-0 flex items-center justify-center text-gray-500 pointer-events-none">
        <p class="text-lg">Upload a file (.nii, .nii.gz, etc.) to begin</p>
      </div>
    {/if}
  </div>

  <InteractionGuide />
</div>
