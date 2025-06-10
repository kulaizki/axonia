<script lang="ts">
  import { niivueStore, AVAILABLE_COLORMAPS } from '$lib/stores/niivueStore';

  function handleSliceTypeChange(event: Event) {
    const select = event.target as HTMLSelectElement;
    const newType = parseInt(select.value, 10);
    if (!isNaN(newType)) {
      niivueStore.setSliceType(newType);
    }
  }

  function handleColormapChange(event: Event) {
    const select = event.target as HTMLSelectElement;
    niivueStore.setColormap(select.value);
  }

  function resetView() {
    niivueStore.resetView();
  }
</script>

<div class="flex flex-wrap gap-x-6 gap-y-3 items-center">
  <div class="flex gap-3 items-center">
    <label for="slice-type" class="text-sm font-medium text-gray-300 shrink-0">View:</label>
    <select
      id="slice-type"
      on:change={handleSliceTypeChange}
      value={$niivueStore.sliceType}
      disabled={!$niivueStore.instance || $niivueStore.isLoading}
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
      value={$niivueStore.selectedColormap}
      on:change={handleColormapChange}
      disabled={!$niivueStore.instance || $niivueStore.isLoading || !$niivueStore.currentFile}
      class="p-2 rounded border border-gray-600 bg-gray-700 text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 focus:border-blue-500 focus:ring-offset-gray-800 disabled:opacity-60 disabled:bg-gray-600 disabled:text-gray-400 disabled:cursor-not-allowed capitalize"
    >
      {#each AVAILABLE_COLORMAPS as cmap}
        <option value={cmap}>{cmap}</option>
      {/each}
    </select>
  </div>

  <button
    on:click={resetView}
    disabled={!$niivueStore.instance || $niivueStore.isLoading}
    class="py-2 px-3 bg-blue-600 text-white rounded cursor-pointer transition-all duration-200 hover:bg-blue-500 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 focus:ring-offset-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
  >
    Reset View
  </button>
</div> 