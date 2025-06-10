<script lang="ts">
    import { inview } from 'svelte-inview';
    let isInView = false;
</script>

<section id="cta" class="bg-gray-900">
    <div 
        class="mx-auto max-w-7xl py-24 px-6 sm:py-32 lg:px-8 transition-all duration-700 {isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}"
        use:inview={{ unobserveOnEnter: true }}
        on:inview_enter={() => { isInView = true; }}
    >
      <h2 class="text-3xl font-bold tracking-tight text-white sm:text-4xl">
        Ready to dive in?
        <br />
        <span class="text-emerald-400">Start exploring your data today.</span>
      </h2>
      <div class="mt-10 flex items-center gap-x-6">
        <a href="/visualizer" class="rounded-md bg-emerald-500 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-emerald-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600">
          Launch Free Visualizer
        </a>
        <a href="https://github.com/kulaizki/axonia" target="_blank" rel="noopener noreferrer" class="text-sm font-semibold leading-6 text-white">
          View on GitHub <span aria-hidden="true">→</span>
        </a>
      </div>
    </div>
</section> 