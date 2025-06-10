<script lang="ts">
  import { inview } from 'svelte-inview';
  let isInView = false;
  let hasAnimated = false;

  const icons = {
    installation: `<svg class="h-6 w-6 text-emerald-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3" /></svg>`,
    openSource: `<svg class="h-6 w-6 text-emerald-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M14.25 9.75L16.5 12l-2.25 2.25m-4.5 0L7.5 12l2.25-2.25M6 20.25h12A2.25 2.25 0 0020.25 18V6A2.25 2.25 0 0018 3.75H6A2.25 2.25 0 003.75 6v12A2.25 2.25 0 006 20.25z" /></svg>`,
    privacy: `<svg class="h-6 w-6 text-emerald-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" /></svg>`,
    performance: `<svg class="h-6 w-6 text-emerald-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" /></svg>`
  }

  const benefits = [
    {
      title: 'Zero Installation',
      description: 'Run powerful neuroimaging software without any setup. Axonia works entirely within your web browser.',
      icon: icons.installation
    },
    {
      title: 'Completely Free & Open Source',
      description: 'Axonia is free for academic, research, and personal use. Its open-source codebase invites community collaboration.',
      icon: icons.openSource
    },
    {
      title: 'Privacy First',
      description: 'Your sensitive medical data is never uploaded to a server. All processing is done locally on your machine.',
      icon: icons.privacy
    },
    {
      title: 'High Performance',
      description: 'Leveraging modern web technologies like WebGL, Axonia delivers smooth, real-time rendering of large datasets.',
      icon: icons.performance
    }
  ];
</script>

<section
  id="benefits"
  class="relative min-h-screen bg-gray-950 flex items-center py-16 lg:py-24 border-b-2 border-emerald-500 shadow-[0_1px_3px_0_rgba(16,185,129,0.5)] overflow-hidden"
  use:inview={{ unobserveOnEnter: true, threshold: 0.2 }}
  on:inview_change={(event) => {
    if (event.detail.inView && !hasAnimated) {
      isInView = true;
      hasAnimated = true;
    }
  }}
>
  <div class="mx-auto max-w-7xl px-6 lg:px-8">
    <div class="grid grid-cols-1 items-center gap-x-16 gap-y-16 lg:grid-cols-2">
      <div
        class="transition-all duration-700 {isInView
          ? 'opacity-100 translate-x-0'
          : 'opacity-0 -translate-x-10'}"
      >
        <h2 class="text-base font-semibold leading-7 text-emerald-400">Why Choose Axonia?</h2>
        <p class="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl">
          The Modern Neuroimaging Tool
        </p>
        <p class="mt-6 text-lg leading-8 text-gray-400">
          Designed for researchers, clinicians, and students who need a fast, accessible, and
          secure way to visualize brain data.
        </p>
      </div>

      <div class="space-y-8">
        {#each benefits as benefit, i}
          <div
            class="flex items-start transition-all duration-500 {isInView
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 translate-y-8'}"
            style="transition-delay: {300 + i * 150}ms;"
          >
            <div class="flex-shrink-0">
              <div
                class="flex h-12 w-12 items-center justify-center rounded-lg bg-gray-800/60 border border-gray-700"
              >
                {@html benefit.icon}
              </div>
            </div>
            <div class="ml-4 flex-1">
              <h3 class="text-lg font-semibold leading-7 text-white">{benefit.title}</h3>
              <p class="mt-2 text-base leading-7 text-gray-400">{benefit.description}</p>
            </div>
          </div>
        {/each}
      </div>
    </div>
  </div>
</section> 