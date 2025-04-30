<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { Niivue } from '@niivue/niivue';

  let canvas: HTMLCanvasElement;
  let nv: Niivue | null = null; // Initialize as null
  let fileInput: HTMLInputElement;
  let isLoading = false;
  let errorMessage = '';
  let currentFile: string | null = null;

  // View options
  let sliceType = 0; // 0: Axial, 1: Coronal, 2: Sagittal, 3: Multiplanar

  onMount(() => {
    // Initialize NiiVue
    try {
        nv = new Niivue({
          // Consider making options conditional or checking library defaults
          backColor: [0.2, 0.2, 0.2, 1],
          colorbarHeight: 0.05,
          dragMode: 1, // 1 = contrast
          multiplanarForceRender: true,
          isResizeCanvas: true // Assumed based on prior feedback, verify if default
          // Add other configuration options for your Niivue version
        });
        nv.attachToCanvas(canvas);
        console.log("Niivue initialized and attached to canvas.");
    } catch(initError) {
        console.error("Failed to initialize Niivue:", initError);
        errorMessage = "Error initializing the viewer. Please refresh.";
        nv = null; // Ensure nv is null on failure
    }

    // Explicit resize handling removed - relying on automatic resizing

    // Cleanup function when component is destroyed
    return () => {
        console.log("Niivue component unmounting...");
        // Explicit resize handler removal not needed as it wasn't added
    };
  });

  // onDestroy lifecycle function for safer cleanup
  onDestroy(() => {
    console.log("Running onDestroy cleanup for Niivue component.");
    // Ensure Niivue instance is properly cleaned up if necessary
    // Check specific Niivue version documentation for the correct destroy/detach method
    if (nv && typeof (nv as any).destroy === 'function') { // Use type assertion cautiously
        try {
            (nv as any).destroy();
            console.log("Niivue instance destroy method called.");
        } catch (e) {
            console.error("Error calling Niivue destroy method:", e);
        }
    } else if (nv) {
        console.log("Niivue instance found, but no 'destroy' method detected or type issue.");
        // Alternative cleanup? e.g., nv.detach()? Check docs.
    }
    nv = null; // Help garbage collection
  });


  // REMOVED - handleResize function no longer needed

  // --- Core File Handling with Enhanced Debugging ---
  async function handleFileUpload(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) {
      console.log("No file selected.");
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
    currentFile = file.name; // Set current file name immediately

    // --- Debugging: Log file details ---
    console.log(`File selected: Name: ${file.name}, Size: ${file.size}, Type: ${file.type || 'N/A'}`);

    try {
      console.log("Attempting to load file with nv.loadFromFile...");
      await nv.loadFromFile(file); // <<< The core call for loading
      console.log("Successfully loaded file:", file.name);

      // Reset file input visually ONLY on success
      if (fileInput) fileInput.value = '';

      updateSliceType(); // Apply initial slice type after successful load

    } catch (error) {
      // --- Enhanced Error Logging (CRITICAL FOR DEBUGGING .nii.gz) ---
      console.error(`Error loading file "${file.name}":`, error); // <<< Log the full error object

      // Create a more informative error message for the UI
      if (error instanceof Error) {
        if (error.message.toLowerCase().includes('decompress') || error.message.toLowerCase().includes('gzip')) {
             errorMessage = `Error decompressing file. Ensure it's valid. (Details in console)`;
        } else if (error.message.toLowerCase().includes('buffer') || error.message.toLowerCase().includes('read')) {
             errorMessage = `Error reading file. It might be corrupted/too large. (Details in console)`;
        } else {
            errorMessage = `Failed to load file: ${error.message}. (Details in console)`;
        }
        console.error("Error Name:", error.name); // Log specific parts of the error
        console.error("Error Stack:", error.stack);
      } else {
        errorMessage = 'An unexpected error occurred while loading the file. Check console for details.';
        console.error("Caught non-Error object:", error);
      }
      // --- End Enhanced Error Logging ---

      currentFile = null; // Clear current file name on error

    } finally {
      isLoading = false; // Ensure loading state is turned off
      console.log("File loading attempt finished.");
    }
  }
  // --- End File Handling ---

  function updateSliceType() {
    if (!nv) {
        console.warn("updateSliceType called but Niivue instance not ready.");
        return;
    }

    // Check if sliceTypeMultiplanar constant exists on the instance or class
    // Using '3' as a fallback based on common Niivue usage if property lookup fails
    const multiplanarType = typeof (nv as any).sliceTypeMultiplanar === 'number'
                            ? (nv as any).sliceTypeMultiplanar
                            : 3;

    console.log(`Updating slice type to: ${sliceType === 3 ? 'Multiplanar (' + multiplanarType + ')' : sliceType}`);
    try {
        if (sliceType === 3) {
            nv.setSliceType(multiplanarType);
        } else {
            nv.setSliceType(sliceType); // Assumes 0, 1, 2 are valid types
        }
    } catch (e) {
        console.error("Error setting slice type:", e);
        errorMessage = "Failed to change view type.";
    }
  }

  function handleSliceTypeChange(event: Event) {
    const select = event.target as HTMLSelectElement;
    // Ensure value is parsed correctly
    const newType = parseInt(select.value, 10);
    if (!isNaN(newType)) {
        sliceType = newType;
        if (nv) { // Ensure nv is available before updating
            updateSliceType();
        }
    } else {
        console.warn("Invalid slice type selected:", select.value);
    }
  }

  function resetView() {
    if (nv) {
      try {
        console.log("Requesting view reset using nv.setDefaults()...");
        nv.setDefaults(); // CORRECTED METHOD based on prior feedback
        // Optionally: nv.setDefaults(undefined, true); // To also reset contrast
        console.log("View reset call completed.");
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
        accept=".nii,.nii.gz,.mgh,.mgz" 
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
    {#if !currentFile && !isLoading && !errorMessage && !nv} <div class="absolute inset-0 flex items-center justify-center text-gray-600 pointer-events-none">
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