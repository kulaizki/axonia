<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { Niivue } from '@niivue/niivue';

  let canvas: HTMLCanvasElement;
  let nv: Niivue | null = null;
  let fileInput: HTMLInputElement;
  let isLoading = false;
  let errorMessage = '';
  let currentFile: string | null = null;
  let sliceType: number = 3;
  let selectedColormap: string = 'inferno';

  const availableColormaps: string[] = [
    'grayscale', 'negative', 'viridis', 'plasma', 'magma', 'inferno',
    'hot', 'cool', 'bone', 'pink', 'jet', 'hsv',
    'spring', 'summer', 'autumn', 'winter', 'surface'
  ];

  onMount(() => {
    const init = async () => {
      try {
        nv = new Niivue({
          backColor: [0.15, 0.15, 0.15, 1],
          colorbarHeight: 0.05,
          dragMode: 1,
          multiplanarForceRender: true,
          isResizeCanvas: true
        });
        nv.attachToCanvas(canvas);
        await loadDefaultFile();
      } catch(initError) {
        console.error("Failed to initialize Niivue:", initError);
        errorMessage = "Error initializing the viewer. Please refresh.";
        nv = null;
      }
      sliceType = sliceType;
      selectedColormap = selectedColormap;
    };

    init();

    return () => {
      if (nv && typeof (nv as any).destroy === 'function') {
        try {
          (nv as any).destroy();
        } catch (e) {
          console.error("Error calling Niivue destroy method:", e);
        }
      }
      nv = null;
    };
  });

  async function loadDefaultFile() {
    if (!nv) {
      errorMessage = "NiiVue viewer is not ready. Please wait or refresh.";
      console.error(errorMessage);
      return;
    }
    isLoading = true;
    errorMessage = '';
    currentFile = 'sample_brain.nii.gz (sample)';

    try {
      await nv.loadVolumes([{ url: './sample_brain.nii.gz' }]);
      updateSliceType();
      applyColormap();
    } catch (error) {
      console.error('Error loading default file "sample_brain.nii.gz":', error);
      if (error instanceof Error) {
        errorMessage = `Failed to load default: ${error.message}. Check console.`;
      } else {
        errorMessage = 'An unexpected error occurred loading default. Check console.';
      }
      currentFile = null;
    } finally {
      isLoading = false;
    }
  }

  async function handleFileUpload(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;
    if (!nv) {
      errorMessage = "NiiVue viewer is not ready. Please wait or refresh.";
      console.error(errorMessage);
      return;
    }

    const file = input.files[0];
    isLoading = true;
    errorMessage = '';
    currentFile = file.name;

    try {
      await nv.loadFromFile(file);
      if (fileInput) fileInput.value = '';
      updateSliceType();
      applyColormap();
    } catch (error) {
      console.error(`Error loading file "${file.name}":`, error);
      if (error instanceof Error) {
        errorMessage = `Failed to load: ${error.message}. Check console.`;
      } else {
        errorMessage = 'An unexpected error occurred. Check console.';
      }
      currentFile = null;
    } finally {
      isLoading = false;
    }
  }

  function applyColormap() {
    if (!nv || !nv.volumes || nv.volumes.length === 0) return;
    try {
      nv.volumes[0].colormap = selectedColormap;
      nv.updateGLVolume();
    } catch (e) {
      console.error("Error applying colormap:", e);
      errorMessage = "Failed to apply colormap.";
    }
  }

  function updateSliceType() {
    if (!nv) return;
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
    }
  }

  function handleColormapChange() {
    if (nv) {
      applyColormap();
    }
  }

  function resetView() {
    if (nv) {
      try {
        nv.setDefaults();
        selectedColormap = 'inferno';
        sliceType = 3;
        if (nv.volumes?.length > 0) {
          applyColormap();
        }
        updateSliceType();
      } catch(e) {
        console.error("Error calling nv.setDefaults():", e);
        errorMessage = "Failed to reset view.";
      }
    }
  }
</script>

<div class="flex flex-col w-full max-w-6xl mx-auto p-4 space-y-6">

  <div class="flex flex-wrap gap-x-6 gap-y-4 justify-between items-center border-b pb-4 border-gray-700">
    <div class="flex flex-col gap-2">
      <input
        bind:this={fileInput}
        type="file"
        accept=".nii,.nii.gz,.mgh,.mgz,application/octet-stream,application/gzip"
        on:change={handleFileUpload}
        disabled={isLoading}
        aria-label="Upload NIfTI file"
        class="block w-full max-w-xs text-sm text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-gray-600 file:text-gray-100 hover:file:bg-gray-500 file:cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 focus:ring-offset-gray-800 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer hover:cursor-pointer"
      />
      {#if isLoading}
        <p class="text-blue-400 font-medium text-sm animate-pulse pt-1">Loading...</p>
      {/if}
      {#if errorMessage}
        <p class="text-red-400 font-medium text-sm bg-red-900 bg-opacity-30 px-2 py-1 rounded mt-1">{errorMessage}</p>
      {/if}
      {#if currentFile && !isLoading && !errorMessage}
        <p class="font-semibold text-sm text-gray-300 pt-1">Current: <span class="font-normal italic text-gray-400">{currentFile}</span></p>
      {/if}
    </div>

    <div class="flex flex-wrap gap-x-6 gap-y-3 items-center">
      <div class="flex gap-3 items-center">
        <label for="slice-type" class="text-sm font-medium text-gray-300 shrink-0">View:</label>
        <select
          id="slice-type"
          on:change={handleSliceTypeChange}
          bind:value={sliceType}
          disabled={!nv || isLoading}
          class="p-2 rounded border border-gray-600 bg-gray-700 text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 focus:border-blue-500 focus:ring-offset-gray-800 disabled:opacity-60 disabled:bg-gray-600 disabled:text-gray-400 disabled:cursor-not-allowed"
          >
          <option value={0}>Axial</option>
          <option value={1}>Coronal</option>
          <option value={2}>Sagittal</option>
          <option value={3}>Multiplanar</option>
        </select>
      </div>

      <div class="flex gap-3 items-center">
        <label for="colormap" class="text-sm font-medium text-gray-300 shrink-0">Colormap:</label>
        <select
          id="colormap"
          bind:value={selectedColormap}
          on:change={handleColormapChange}
          disabled={!nv || isLoading || !currentFile}
          class="p-2 rounded border border-gray-600 bg-gray-700 text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 focus:border-blue-500 focus:ring-offset-gray-800 disabled:opacity-60 disabled:bg-gray-600 disabled:text-gray-400 disabled:cursor-not-allowed capitalize"
          >
          {#each availableColormaps as cmap}
            <option value={cmap}>{cmap}</option>
          {/each}
        </select>
      </div>

      <button
        on:click={resetView}
        disabled={!nv || isLoading}
        class="py-2 px-3 bg-blue-600 text-white rounded cursor-pointer transition-all duration-200 hover:bg-blue-500 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 focus:ring-offset-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
        >
        Reset View
      </button>
    </div>
  </div>

  <div class="w-full h-[65vh] min-h-[450px] border border-gray-700 rounded-lg overflow-hidden bg-black shadow-lg relative">
    <canvas bind:this={canvas} class="w-full h-full block" aria-label="NiiVue neuroimaging canvas"></canvas>
    {#if !currentFile && !isLoading && !errorMessage && !nv}
       <div class="absolute inset-0 flex items-center justify-center text-gray-600 pointer-events-none">
         <p class="bg-gray-900 bg-opacity-80 text-gray-300 px-4 py-2 rounded-md">Initializing Viewer...</p>
       </div>
    {:else if !currentFile && !isLoading && !errorMessage && nv}
       <div class="absolute inset-0 flex items-center justify-center text-gray-500 pointer-events-none">
         <p class="text-lg">Upload a file (.nii, .nii.gz, etc.) to begin</p>
       </div>
    {/if}
  </div>

  <div class="p-4 bg-gray-800 rounded-lg text-xs border border-gray-700 shadow-md">
    <h3 class="font-semibold mb-2 text-sm text-gray-100">Interaction Guide:</h3>
    <ul class="ml-5 list-disc space-y-1 text-gray-300">
      <li><strong class="font-semibold text-gray-200">Left-click + drag:</strong> Adjust contrast & brightness</li>
      <li><strong class="font-semibold text-gray-200">Right-click + drag:</strong> Pan the image</li>
      <li><strong class="font-semibold text-gray-200">Scroll wheel:</strong> Zoom in/out</li>
      <li><strong class="font-semibold text-gray-200">Middle-click + drag</strong> or <strong class="font-semibold text-gray-200">Alt + left-click + drag:</strong> Navigate slices</li>
    </ul>
  </div>

</div>