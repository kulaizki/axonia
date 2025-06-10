<script lang="ts">
	import { onMount } from 'svelte';

	let isInView = false;
	let applyDelay = true;

	onMount(() => {
		isInView = true;
		// Disable the animation delay after the first run so it's instant on subsequent navigations
		setTimeout(() => {
			applyDelay = false;
		}, 900);
	});
</script>

<section id="hero" class="hero-section relative flex min-h-screen flex-col justify-center overflow-hidden bg-cover bg-center bg-no-repeat py-16 md:py-20">
	<div class="relative z-[2] container mx-auto px-4 text-center">
		<div
			class="mb-4 inline-block transition-all duration-700 ease-out sm:mb-6 {isInView ? 'translate-y-0 opacity-100' : '-translate-y-8 opacity-0'}"
			style={applyDelay ? 'transition-delay: 100ms;' : 'transition-delay: 0ms;'}
		>
			<div class="rounded-full bg-gradient-to-r from-emerald-700 to-emerald-900 p-0.5 shadow-lg">
				<span class="block rounded-full bg-gray-900 px-4 py-1.5 text-xs font-semibold text-emerald-300 sm:text-sm">
					Free & Open-Source Neuroimaging Viewer
				</span>
			</div>
		</div>

		<h1
			class="mb-5 text-4xl font-bold leading-tight text-white sm:text-5xl md:text-6xl transition-all duration-700 ease-out {isInView ? 'translate-y-0 opacity-100' : '-translate-y-8 opacity-0'}"
			style={applyDelay ? 'transition-delay: 250ms;' : 'transition-delay: 0ms;'}
		>
			Visualize the Brain, <span class="bg-gradient-to-r from-emerald-400 to-green-500 bg-clip-text text-transparent">Instantly.</span>
		</h1>

		<p
			class="mx-auto mb-10 max-w-2xl text-lg text-gray-400 transition-all duration-700 ease-out md:mb-12 md:text-xl {isInView ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}"
			style={applyDelay ? 'transition-delay: 400ms;' : 'transition-delay: 0ms;'}
		>
			Axonia is a free, open-source tool for neuroimaging visualization. Upload your NIfTI files and explore brain data directly in your browser. No installation required.
		</p>

		<a
			href="/visualizer"
			class="group relative inline-flex transform items-center justify-center gap-2.5 rounded-lg bg-emerald-500 px-8 py-3 text-lg font-semibold text-white shadow-md transition-all duration-500 ease-out hover:scale-105 hover:bg-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:ring-offset-2 focus:ring-offset-gray-900 {isInView ? 'scale-100 opacity-100' : 'scale-90 opacity-0'}"
			style={applyDelay ? 'transition-delay: 550ms;' : 'transition-delay: 0ms;'}
		>
			Launch Visualizer
			<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1">
				<path fill-rule="evenodd" d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z" clip-rule="evenodd" />
			</svg>
		</a>
	</div>
</section>

<style>
	.hero-section {
		background-image: url('/axonia-bg-min.png');
	}

	.hero-section::before {
		content: '';
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background-color: rgba(3, 7, 18, 0.9); /* gray-950 with 90% opacity */
		background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='28' height='56' viewBox='0 0 28 56'%3E%3Cg fill-rule='evenodd'%3E%3Cg id='plus' fill='%2334d399' fill-opacity='0.02'%3E%3Cpath d='M13 14V0h2v14h14v2H15v14h-2V16H0v-2h13z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
	}
</style> 