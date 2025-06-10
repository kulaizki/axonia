<script lang="ts">
    import { inview } from 'svelte-inview';
  
    let isInView = false;
  
    const steps = [
      {
        name: 'Upload Your Data',
        description: 'Click the "Launch Visualizer" button and drag-and-drop your .nii or .nii.gz file onto the viewer, or use the file dialog.'
      },
      {
        name: 'Explore in 3D',
        description: 'Interact with your data in real-time. Use your mouse to rotate, pan, and zoom the 3D rendering of the brain volume.'
      },
      {
        name: 'Analyze Slices',
        description: 'Examine the axial, coronal, and sagittal views. Draw, measure, and annotate directly on the 2D slices to highlight key findings.'
      },
      {
        name: 'No Data Uploaded',
        description: 'Your data remains private. All processing happens locally in your browser, ensuring complete confidentiality and security.'
      }
    ];
  </script>
  
  <section id="how-it-works" class="h-screen bg-gray-900 flex items-center">
    <div 
      class="mx-auto max-w-7xl px-6 lg:px-8 transition-all duration-700 {isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}"
      use:inview={{ unobserveOnEnter: true }}
      on:inview_enter={() => { isInView = true; }}
    >
      <div class="mx-auto max-w-2xl lg:text-center">
        <h2 class="text-base font-semibold leading-7 text-emerald-400">Get Started in Seconds</h2>
        <p class="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl">
          A Simple Workflow
        </p>
        <p class="mt-6 text-lg leading-8 text-gray-400">
          From file to visualization in just a few clicks. Axonia streamlines the process of neuroimaging analysis.
        </p>
      </div>
  
      <div class="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-4xl">
        <dl class="grid max-w-xl grid-cols-1 gap-x-8 gap-y-10 lg:max-w-none lg:grid-cols-2 lg:gap-y-16">
          {#each steps as step, i}
            <div class="relative pl-16 transition-all duration-700 {isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}" style="transition-delay: {i * 150}ms">
              <dt class="text-base font-semibold leading-7 text-white">
                <div class="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500">
                    <span class="text-white font-bold">{i+1}</span>
                </div>
                {step.name}
              </dt>
              <dd class="mt-2 text-base leading-7 text-gray-400">{step.description}</dd>
            </div>
          {/each}
        </dl>
      </div>
    </div>
  </section> 