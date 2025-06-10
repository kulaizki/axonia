<script lang="ts">
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { tick } from 'svelte';
	import { browser } from '$app/environment';

	async function handleNav(event: MouseEvent) {
		if (!browser) return;

		const anchor = event.currentTarget as HTMLAnchorElement;
		const href = anchor.getAttribute('href');

		if (href && href.startsWith('/#')) {
			event.preventDefault();
			const targetId = href.substring(2);

			if ($page.url.pathname !== '/') {
				await goto('/');
				await tick();
			}

			const element = document.getElementById(targetId);
			if (element) {
				element.scrollIntoView({ behavior: 'smooth' });
			}
		} else if (href === '/') {
			if ($page.url.pathname === '/') {
				event.preventDefault();
				window.scrollTo({ top: 0, behavior: 'smooth' });
			}
		}
	}
</script>

<footer class="bg-gray-950/90 text-gray-300 border-t border-gray-700/50">
	<div class="container mx-auto py-12 px-4">
		<div class="grid lg:grid-cols-4 md:grid-cols-2 gap-8">
			<!-- Company Info -->
			<div class="mb-8 md:mb-0 lg:col-span-2">
				<a href="/" class="mb-4 inline-block" on:click={handleNav}>
					<img src="/axonia-logo-text.png" alt="Axonia Logo" class="h-12 w-auto" />
				</a>
				<p class="text-gray-400">An open-source, web-based viewer for neuroimaging data.</p> 
			</div>

			<!-- Links -->
			<div>
				<h4 class="text-white font-semibold mb-4">Navigation</h4>
				<ul class="space-y-3">
					<li><a href="/#features" class="hover:text-white transition-colors" on:click={handleNav}>Features</a></li>
					<li><a href="/#how-it-works" class="hover:text-white transition-colors" on:click={handleNav}>How It Works</a></li>
					<li><a href="/#benefits" class="hover:text-white transition-colors" on:click={handleNav}>Benefits</a></li>
				</ul>
			</div>

			<div>
				<h4 class="text-white font-semibold mb-4">Project</h4>
				<ul class="space-y-3">
					<li><a href="https://github.com/kulaizki/axonia" target="_blank" rel="noopener noreferrer" class="hover:text-white transition-colors">View on GitHub</a></li>
					<li><a href="/visualizer" class="hover:text-white transition-colors">Launch Visualizer</a></li>
				</ul>
			</div>
		</div>

		<!-- Bottom Footer -->
		<div class="mt-10 pt-8 border-t border-emerald-800/50 text-center text-gray-400 text-sm">
			<p>&copy; {new Date().getFullYear()} Axonia. All Rights Reserved.</p>
		</div>
	</div>
</footer>