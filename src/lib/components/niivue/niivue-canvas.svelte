<script lang="ts">
  import { onMount } from 'svelte';
  import { niivueStore } from '$lib/stores/niivueStore';

  // Canvas reference for Niivue to attach to
  let canvas: HTMLCanvasElement;

  // Lifecycle handling
  onMount(() => {
    niivueStore.initializeNiivue(canvas);
    niivueStore.loadDefaultFile();

    return () => {
      niivueStore.destroyNiivue();
    };
  });
</script>

<canvas 
  bind:this={canvas} 
  class="w-full h-full block" 
  aria-label="NiiVue neuroimaging canvas"
></canvas> 