<script lang="ts">
  import { inview } from 'svelte-inview';

  let isInView = false;

  const icons = {
    interactive: `<svg class="h-8 w-8 text-emerald-400 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M21 7.5l-9-5.25L3 7.5m18 0l-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9" /></svg>`,
    multiView: `<svg class="h-8 w-8 text-emerald-400 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 8.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 018.25 20.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25A2.25 2.25 0 0113.5 8.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" /></svg>`,
    nifti: `<svg class="h-8 w-8 text-emerald-400 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m.75 12l3 3m0 0l3-3m-3 3v-6m-1.5-9H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" /></svg>`,
    drawing: `<svg class="h-8 w-8 text-emerald-400 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" /></svg>`,
  };

  const features = [
    {
      icon: icons.interactive,
      name: 'Interactive 3D Views',
      description: 'Rotate, pan, and zoom through volumetric neuroimaging data in a rich, interactive 3D environment.'
    },
    {
      icon: icons.multiView,
      name: 'Multi-View Layout',
      description: 'Simultaneously visualize axial, coronal, and sagittal planes for a comprehensive anatomical overview.'
    },
    {
      icon: icons.nifti,
      name: 'NIfTI/.gz Support',
      description: 'Directly load and render files in the popular NIfTI format (.nii, .nii.gz) without any preprocessing steps.'
    },
    {
      icon: icons.drawing,
      name: 'Cross-Sectional Drawing',
      description: 'Draw directly on 2D slices to annotate regions of interest, measure distances, or highlight structures.'
    }
  ];
</script>

<section id="features" class="relative h-screen bg-gray-950 flex items-center border-b-2 border-emerald-500 shadow-[0_1px_3px_0_rgba(16,185,129,0.5)]">
  <div 
    class="mx-auto max-w-7xl px-6 lg:px-8 transition-all duration-700 {isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}"
    use:inview={{ unobserveOnEnter: true }}
    on:inview_enter={() => { isInView = true; }}
  >
    <div class="mx-auto max-w-2xl lg:text-center">
      <h2 class="text-base font-semibold leading-7 text-emerald-400">Core Features</h2>
      <p class="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl">
        Everything you need for brain visualization
      </p>
      <p class="mt-6 text-lg leading-8 text-gray-400">
        Axonia provides a powerful, browser-based toolkit for neuroimaging analysis, combining performance with ease of use.
      </p>
    </div>
    <div class="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
      <div class="grid max-w-xl grid-cols-1 gap-8 text-center lg:max-w-none lg:grid-cols-2 lg:gap-12">
        {#each features as feature, i}
          <div 
            class="flex flex-col items-center p-6 transition-all duration-700 {isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}" 
            style="transition-delay: {i * 150}ms"
          >
            {@html feature.icon}
            <h3 class="text-lg font-semibold leading-7 text-white">{feature.name}</h3>
            <p class="mt-2 text-base leading-7 text-gray-400">{feature.description}</p>
          </div>
        {/each}
      </div>
    </div>
  </div>
</section> 