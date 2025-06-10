<script lang="ts">
  import { onMount } from 'svelte';

  let showButton = false;

  function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  onMount(() => {
    const handleScroll = () => {
      showButton = window.scrollY > 400;
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Run once on mount to check initial position

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  });
</script>

{#if showButton}
  <button
    on:click={scrollToTop}
    class="fixed bottom-6 right-6 z-50 p-3 rounded-full bg-emerald-500 text-white shadow-lg hover:bg-emerald-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-opacity"
    aria-label="Go to top"
  >
    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7" />
    </svg>
  </button>
{/if} 