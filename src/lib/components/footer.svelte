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

<footer class="bg-gray-950/90 text-gray-300">
	<div class="container mx-auto py-12 px-4">
		<div class="grid lg:grid-cols-4 md:grid-cols-2 gap-8">
			<!-- Company Info -->
			<div class="mb-8 md:mb-0 lg:col-span-2">
				<a href="/" class="mb-4 inline-block" on:click={handleNav}>
					<img src="/cs-neuro-logo.png" alt="Axonia Logo" class="h-12 w-auto" />
				</a>
				<p class="text-gray-400">An open-source, web-based viewer for neuroimaging data. All processing is done in your browser for maximum privacy.</p>
				<div class="mt-6 flex space-x-4">
					<a href="https://github.com/kulaizki/axonia" target="_blank" rel="noopener noreferrer" aria-label="GitHub" class="text-gray-400 hover:text-white transition-colors">
						<svg class="h-6 w-6" fill="currentColor" viewBox="0 0 24 24"><path fill-rule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.418 2.865 8.168 6.839 9.492.5.092.682-.217.682-.482 0-.237-.009-.868-.014-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.031-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.03 1.595 1.03 2.688 0 3.848-2.338 4.695-4.566 4.942.359.308.678.92.678 1.855 0 1.338-.012 2.419-.012 2.745 0 .268.18.58.688.482A10.001 10.001 0 0022 12c0-5.523-4.477-10-10-10z" clip-rule="evenodd" /></svg>
					</a>
				</div>
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