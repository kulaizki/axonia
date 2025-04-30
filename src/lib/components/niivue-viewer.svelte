<script lang="ts">
  import { onMount } from 'svelte';
  import { Niivue } from '@niivue/niivue';

  let canvas: HTMLCanvasElement;
  let nv: Niivue;
  let fileInput: HTMLInputElement;
  let isLoading = false;
  let errorMessage = '';

  onMount(() => {
    nv = new Niivue({
      backColor: [0.2, 0.2, 0.2, 1], 
      colorbarHeight: 0.05
    });
    nv.attachToCanvas(canvas);
  });

  async function handleFileUpload(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;

    const file = input.files[0];
    isLoading = true;
    errorMessage = '';

    try {
      await nv.loadFromFile(file);

      if (fileInput) fileInput.value = '';
    } catch (error) {
      console.error('Error loading file:', error);
      errorMessage = 'Failed to load the file. Please ensure it is a valid .nii.gz file.';
    } finally {
      isLoading = false;
    }
  }
</script>

<div class="flex flex-col w-full max-w-[1200px] mx-auto"> 
  <div class="mb-4">
    <input
      bind:this={fileInput}
      type="file"
      accept=".nii,.nii.gz"
      on:change={handleFileUpload}
      disabled={isLoading}
      class="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 disabled:opacity-50 disabled:cursor-not-allowed"
      />
    {#if isLoading}
      <p class="mt-2 text-sm text-gray-600">Loading...</p>
    {/if}
    {#if errorMessage}
      <p class="mt-2 text-red-500 font-bold"> 
        {errorMessage}
      </p>
    {/if}
  </div>

  <div class="w-full h-[600px] border border-gray-300 rounded overflow-hidden">
    <canvas bind:this={canvas} class="w-full h-full"></canvas> 
  </div>
</div>