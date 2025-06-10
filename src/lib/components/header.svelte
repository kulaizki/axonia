<script lang="ts">
  import { page } from '$app/stores';
  import { goto } from '$app/navigation';
  import { tick } from 'svelte';
  import { browser } from '$app/environment';

  let mobileMenuOpen = false;

  async function handleNav(event: MouseEvent) {
    if (!browser) return;

    const anchor = event.currentTarget as HTMLAnchorElement;
    const href = anchor.getAttribute('href');

    // Handle anchor links
    if (href && href.startsWith('/#')) {
      event.preventDefault();
      const targetId = href.substring(2);

      if ($page.url.pathname !== '/') {
        await goto('/');
        await tick(); // Wait for the new page to render
      }

      const element = document.getElementById(targetId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
      mobileMenuOpen = false;
    }
    // Handle scroll to top on home page
    else if (href === '/') {
      if ($page.url.pathname === '/') {
        event.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
      // On other pages, allow default navigation to home, which will also close the menu
      mobileMenuOpen = false;
    }
  }
</script>

<header class="sticky top-0 z-50 bg-gray-950/70 backdrop-blur-md border-b border-gray-700/50">
  <div class="container mx-auto px-4 sm:px-6 lg:px-8">
    <div class="flex items-center justify-between h-16">
      <div class="flex-shrink-0">
        <a href="/" on:click={handleNav} class="flex items-center space-x-2">
          <img class="h-8 w-auto" src="/axonia-logo-text.png" alt="Axonia Logo" />
        </a>
      </div>
      <div class="hidden md:block">
        <nav class="flex items-center space-x-8">
          <a href="/#features" on:click={handleNav} class="text-gray-300 hover:text-emerald-400 transition-colors">Features</a>
          <a href="/#how-it-works" on:click={handleNav} class="text-gray-300 hover:text-emerald-400 transition-colors">How It Works</a>
          <a href="/#benefits" on:click={handleNav} class="text-gray-300 hover:text-emerald-400 transition-colors">Benefits</a>
          {#if $page.url.pathname !== '/visualizer'}
            <a href="/visualizer" class="bg-emerald-500 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-emerald-600 transition-colors">Launch App</a>
          {/if}
        </nav>
      </div>
      <div class="md:hidden flex items-center">
        <button on:click={() => (mobileMenuOpen = !mobileMenuOpen)} class="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white" aria-expanded="false">
          <span class="sr-only">Open main menu</span>
          {#if !mobileMenuOpen}
            <svg class="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          {:else}
            <svg class="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          {/if}
        </button>
      </div>
    </div>
  </div>

  {#if mobileMenuOpen}
    <div class="md:hidden" id="mobile-menu">
      <div class="px-2 pt-2 pb-3 space-y-1 sm:px-3">
        <a href="/#features" on:click={handleNav} class="text-gray-300 hover:text-white hover:bg-gray-700 block px-3 py-2 rounded-md text-base font-medium">Features</a>
        <a href="/#how-it-works" on:click={handleNav} class="text-gray-300 hover:text-white hover:bg-gray-700 block px-3 py-2 rounded-md text-base font-medium">How It Works</a>
        <a href="/#benefits" on:click={handleNav} class="text-gray-300 hover:text-white hover:bg-gray-700 block px-3 py-2 rounded-md text-base font-medium">Benefits</a>
        {#if $page.url.pathname !== '/visualizer'}
          <a href="/visualizer" class="bg-emerald-500 text-white block px-3 py-2 rounded-md text-base font-medium hover:bg-emerald-600">Launch App</a>
        {/if}
      </div>
    </div>
  {/if}
</header> 