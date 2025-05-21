<script lang="ts">
  import { niivueStore } from '$lib/stores/niivueStore';

  let fileInput: HTMLInputElement;

  async function handleFileUpload(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;
    
    await niivueStore.loadFromFile(input.files[0]);
    
    // Reset the file input after loading
    if (fileInput) fileInput.value = '';
  }
</script>

<div class="flex flex-col gap-2">
  <input
    bind:this={fileInput}
    type="file"
    accept=".nii,.nii.gz,.mgh,.mgz,application/octet-stream,application/gzip"
    on:change={handleFileUpload}
    disabled={$niivueStore.isLoading}
    aria-label="Upload NIfTI file"
    class="block w-full max-w-xs text-sm text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-gray-600 file:text-gray-100 hover:file:bg-gray-500 file:cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 focus:ring-offset-gray-800 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer hover:cursor-pointer"
  />
  
  {#if $niivueStore.isLoading}
    <p class="text-blue-400 font-medium text-sm animate-pulse pt-1">Loading...</p>
  {/if}
  
  {#if $niivueStore.errorMessage}
    <p class="text-red-400 font-medium text-sm bg-red-900 bg-opacity-30 px-2 py-1 rounded mt-1">
      {$niivueStore.errorMessage}
    </p>
  {/if}
  
  {#if $niivueStore.currentFile && !$niivueStore.isLoading && !$niivueStore.errorMessage}
    <p class="font-semibold text-sm text-gray-300 pt-1">
      Current: <span class="font-normal italic text-gray-400">{$niivueStore.currentFile}</span>
    </p>
  {/if}
</div> 