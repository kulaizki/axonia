<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { Niivue } from '@niivue/niivue';

  let canvas: HTMLCanvasElement;
  let nv: Niivue | null = null;
  let fileInput: HTMLInputElement;
  let isLoading = false;
  let errorMessage = '';
  let currentFile: string | null = null;
  let sliceType = 0;

  onMount(() => {
    try {
        nv = new Niivue({
          backColor: [0.2, 0.2, 0.2, 1],
          colorbarHeight: 0.05,
          dragMode: 1,
          multiplanarForceRender: true,
          isResizeCanvas: true
        });
        nv.attachToCanvas(canvas);
    } catch(initError) {
        console.error("Failed to initialize Niivue:", initError);
        errorMessage = "Error initializing the viewer. Please refresh.";
        nv = null;
    }
    return () => {};
  });

  onDestroy(() => {
    if (nv && typeof (nv as any).destroy === 'function') {
        try {
            (nv as any).destroy();
        } catch (e) {
            console.error("Error calling Niivue destroy method:", e);
        }
    }
    nv = null;
  });

  async function handleFileUpload(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) {
      return;
    }
    if (!nv) {
      errorMessage = "NiiVue viewer is not ready. Please wait or refresh.";
      console.error(errorMessage);
      return;
    }

    const file = input.files[0];
    isLoading = true;
    errorMessage = '';
    currentFile = file.name;

    console.log(`File selected: Name: ${file.name}, Size: ${file.size}, Type: ${file.type || 'N/A'}`);

    try {
      console.log("Attempting to load file with nv.loadFromFile...");
      await nv.loadFromFile(file);
      console.log("Successfully loaded file:", file.name);
      if (fileInput) fileInput.value = '';
      updateSliceType();
    } catch (error) {
      console.error(`Error loading file "${file.name}":`, error);
      if (error instanceof Error) {
        if (error.message.toLowerCase().includes('decompress') || error.message.toLowerCase().includes('gzip')) {
             errorMessage = `Error decompressing file. Ensure it's valid. (Details in console)`;
        } else if (error.message.toLowerCase().includes('buffer') || error.message.toLowerCase().includes('read')) {
             errorMessage = `Error reading file. It might be corrupted/too large. (Details in console)`;
        } else {
            errorMessage = `Failed to load file: ${error.message}. (Details in console)`;
        }
        console.error("Error Name:", error.name);
        console.error("Error Stack:", error.stack);
      } else {
        errorMessage = 'An unexpected error occurred while loading the file. Check console for details.';
        console.error("Caught non-Error object:", error);
      }
      currentFile = null;
    } finally {
      isLoading = false;
      console.log("File loading attempt finished.");
    }
  }

  function updateSliceType() {
    if (!nv) {
        console.warn("updateSliceType called but Niivue instance not ready.");
        return;
    }
    const multiplanarType = typeof (nv as any).sliceTypeMultiplanar === 'number'
                            ? (nv as any).sliceTypeMultiplanar
                            : 3;
    try {
        if (sliceType === 3) {
            nv.setSliceType(multiplanarType);
        } else {
            nv.setSliceType(sliceType);
        }
    } catch (e) {
        console.error("Error setting slice type:", e);
        errorMessage = "Failed to change view type.";
    }
  }

  function handleSliceTypeChange(event: Event) {
    const select = event.target as HTMLSelectElement;
    const newType = parseInt(select.value, 10);
    if (!isNaN(newType)) {
        sliceType = newType;
        if (nv) {
            updateSliceType();
        }
    } else {
        console.warn("Invalid slice type selected:", select.value);
    }
  }

  function resetView() {
    if (nv) {
      try {
        nv.setDefaults();
      } catch(e) {
        console.error("Error calling nv.setDefaults():", e);
        errorMessage = "Failed to reset view.";
      }
    } else {
      console.warn("Reset view called but Niivue instance not ready.");
    }
  }
</script>

<div class="flex flex-col w-full max-w-6xl mx-auto p-4 space-y-4">

  <div class="flex flex-wrap gap-4 justify-between items-center border-b pb-4 border-gray-200">
    <div class="flex flex-col gap-1">
      <input
        bind:this={fileInput}
        type="file"
        accept=".nii,.nii.gz,.mgh,.mgz,application/octet-stream,application/gzip"
        on:change={handleFileUpload}
        disabled={isLoading}
        aria-label="Upload NIfTI file"
        class="block w-full max-w-xs text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-100 file:text-blue-700 hover:file:bg-blue-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
      />
      {#if isLoading}
        <p class="text-blue-600 font-medium text-sm animate-pulse pt-1">Loading...</p>
      {/if}
      {#if errorMessage}
        <p class="text-red-600 font-medium text-sm bg-red-100 px-2 py-1 rounded mt-1">{errorMessage}</p>
      {/if}
      {#if currentFile && !isLoading && !errorMessage}
        <p class="font-semibold text-sm text-gray-700 pt-1">Current: <span class="font-normal italic">{currentFile}</span></p>
      {/if}
    </div>

    <div class="flex gap-3 items-center">
      <label for="slice-type" class="text-sm font-medium text-gray-700 shrink-0">View:</label>
      <select
        id="slice-type"
        on:change={handleSliceTypeChange}
        bind:value={sliceType}
        disabled={!nv || isLoading}
        class="p-2 rounded border border-gray-300 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 bg-white disabled:opacity-60 disabled:bg-gray-100"
        >
        <option value="0">Axial</option>
        <option value="1">Coronal</option>
        <option value="2">Sagittal</option>
        <option value="3">Multiplanar</option>
      </select>

      <button
        on:click={resetView}
        disabled={!nv || isLoading}
        class="py-2 px-3 bg-blue-600 text-white rounded cursor-pointer transition-all duration-200 hover:bg-blue-700 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
        Reset View
      </button>
    </div>
  </div>

  <div class="w-full h-[65vh] min-h-[450px] border border-gray-300 rounded-lg overflow-hidden bg-black shadow-lg relative">
    <canvas bind:this={canvas} class="w-full h-full block" aria-label="NiiVue neuroimaging canvas"></canvas>
    {#if !currentFile && !isLoading && !errorMessage && !nv}
       <div class="absolute inset-0 flex items-center justify-center text-gray-600 pointer-events-none">
         <p class="bg-gray-800 bg-opacity-70 text-gray-200 px-4 py-2 rounded">Initializing Viewer...</p>
       </div>
    {:else if !currentFile && !isLoading && !errorMessage && nv}
       <div class="absolute inset-0 flex items-center justify-center text-gray-500 pointer-events-none">
         <p>Upload a file (.nii, .nii.gz, etc.) to begin</p>
       </div>
    {/if}
  </div>

  <div class="mt-4 p-4 bg-gray-50 rounded-lg text-xs border border-gray-200">
    <h3 class="font-semibold mb-2 text-sm text-gray-800">Interaction Guide:</h3>
    <ul class="ml-5 list-disc space-y-1 text-gray-700">
      <li><strong class="font-medium">Left-click + drag:</strong> Adjust contrast & brightness</li>
      <li><strong class="font-medium">Right-click + drag:</strong> Pan the image</li>
      <li><strong class="font-medium">Scroll wheel:</strong> Zoom in/out</li>
      <li><strong class="font-medium">Middle-click + drag</strong> or <strong class="font-medium">Alt + left-click + drag:</strong> Navigate slices</li>
    </ul>
  </div>

</div>