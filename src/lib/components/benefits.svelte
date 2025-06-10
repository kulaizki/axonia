<script lang="ts">
  import { inview } from 'svelte-inview';
  let isInView = false;

  const benefits = [
    {
      title: 'Zero Installation',
      description: 'Run powerful neuroimaging software without any setup. Axonia works entirely within your web browser.',
      icon: 'M13 10V3.05C13 2.47 12.53 2 11.95 2H6.05C5.47 2 5 2.47 5 3.05V10H2.05C1.47 10 1 10.47 1 11.05V20.95C1 21.53 1.47 22 2.05 22H15.95C16.53 22 17 21.53 17 20.95V11.05C17 10.47 16.53 10 15.95 10H13z'
    },
    {
      title: 'Completely Free & Open Source',
      description: 'Axonia is free for academic, research, and personal use. Its open-source codebase invites community collaboration.',
      icon: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z'
    },
    {
      title: 'Privacy First',
      description: 'Your sensitive medical data is never uploaded to a server. All processing is done locally on your machine.',
      icon: 'M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z'
    },
     {
      title: 'High Performance',
      description: 'Leveraging modern web technologies like WebGL, Axonia delivers smooth, real-time rendering of large datasets.',
      icon: 'M3.28 12.02c-.06-.3.02-.61.24-.83l7-7.02c.39-.39 1.02-.39 1.41 0l7.01 7.01c.22.22.3.53.24.83l-1.04 5.46c-.1.52-.57.88-1.1.88H5.27c-.53 0-1-.36-1.1-.88l-1.04-5.45zM10 16h4v-4h-4v4z'
    }
  ];
</script>

<section id="benefits" class="min-h-screen bg-gray-950 py-24 sm:py-32 flex items-center">
    <div 
        class="mx-auto max-w-7xl px-6 lg:px-8 transition-all duration-700 {isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}"
        use:inview={{ unobserveOnEnter: true }}
        on:inview_enter={() => { isInView = true; }}
    >
        <div class="mx-auto max-w-2xl lg:text-center">
            <h2 class="text-base font-semibold leading-7 text-emerald-400">Why Choose Axonia?</h2>
            <p class="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl">The Modern Neuroimaging Tool</p>
            <p class="mt-6 text-lg leading-8 text-gray-400">
                Designed for researchers, clinicians, and students who need a fast, accessible, and secure way to visualize brain data.
            </p>
        </div>
        <div class="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
            <div class="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
                {#each benefits as benefit, i}
                <div 
                    class="bg-gray-900/50 p-6 rounded-lg border border-gray-700/60 transition-all duration-300 hover:border-emerald-500/30 hover:shadow-lg hover:shadow-emerald-500/10 {isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}"
                    style="transition-delay: {i * 150}ms;"
                >
                    <div class="flex-shrink-0">
                        <svg class="h-8 w-8 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d={benefit.icon} />
                        </svg>
                    </div>
                    <h3 class="mt-4 text-lg font-medium text-white">{benefit.title}</h3>
                    <p class="mt-2 text-sm text-gray-400">{benefit.description}</p>
                </div>
                {/each}
            </div>
        </div>
    </div>
</section> 