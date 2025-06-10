<script lang="ts">
  import { inview } from 'svelte-inview';

  let isInView = false;

  const features = [
    {
      icon: 'M12 21.5c4.694 0 8.5-3.806 8.5-8.5s-3.806-8.5-8.5-8.5-8.5 3.806-8.5 8.5 3.806 8.5 8.5 8.5zM12 23c5.523 0 10-4.477 10-10S17.523 3 12 3 2 7.477 2 13s4.477 10 10 10z', // Placeholder icon path
      name: 'Interactive 3D Views',
      description: 'Rotate, pan, and zoom through volumetric neuroimaging data in a rich, interactive 3D environment.'
    },
    {
      icon: 'M4 4h16v16H4V4zm2 2v12h12V6H6z', // Placeholder icon path
      name: 'Multi-View Layout',
      description: 'Simultaneously visualize axial, coronal, and sagittal planes for a comprehensive anatomical overview.'
    },
    {
      icon: 'M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8-8-8z',
      name: 'NIfTI/.gz Support',
      description: 'Directly load and render files in the popular NIfTI format (.nii, .nii.gz) without any preprocessing steps.'
    },
    {
      icon: 'M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-1 16H6c-.55 0-1-.45-1-1V6c0-.55.45-1 1-1h12c.55 0 1 .45 1 1v12c0 .55-.45 1-1 1z',
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
      <dl class="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-2">
        {#each features as feature, i}
          <div class="flex flex-col transition-all duration-700 {isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}" style="transition-delay: {i * 150}ms">
            <dt class="flex items-center gap-x-3 text-base font-semibold leading-7 text-white">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="h-5 w-5 flex-none text-emerald-400" fill="currentColor">
                <path d={feature.icon} />
              </svg>
              {feature.name}
            </dt>
            <dd class="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-400">
              <p class="flex-auto">{feature.description}</p>
            </dd>
          </div>
        {/each}
      </dl>
    </div>
  </div>
</section> 