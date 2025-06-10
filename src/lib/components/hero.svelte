<script lang="ts">
  import { inview } from 'svelte-inview';
  let isInView = false;
</script>

<section id="hero" class="bg-gray-900 text-white min-h-screen flex items-center justify-center">
  <div 
    class="text-center px-4 transition-all duration-700 {isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}"
    use:inview={{ unobserveOnEnter: true }}
    on:inview_enter={() => { isInView = true; }}
  >
    <img src="/cs-neuro-logo.png" alt="Axonia Logo" class="w-40 h-40 mx-auto mb-8" />
    <h1 class="text-5xl md:text-7xl font-extrabold tracking-tight mb-4">
      Visualize the Brain, <span class="text-emerald-400">Instantly.</span>
    </h1>
    <p class="max-w-2xl mx-auto text-lg md:text-xl text-gray-400 mb-8">
      Axonia is a free, open-source tool for neuroimaging visualization. Upload your NIfTI files and explore brain data directly in your browser. No installation required.
    </p>
    <a href="/visualizer" class="inline-block bg-emerald-500 text-white font-bold py-3 px-8 rounded-lg text-lg hover:bg-emerald-600 transition-colors shadow-lg shadow-emerald-500/20">
      Launch Visualizer
    </a>
  </div>
</section> 