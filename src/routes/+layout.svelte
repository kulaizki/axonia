<script lang="ts">
	import '../app.css';
	import Header from '$lib/components/header.svelte';
	import Footer from '$lib/components/footer.svelte';
	import SEO from '$lib/components/seo.svelte';
	import BackToTop from '$lib/components/back-to-top.svelte';
	import { page } from '$app/stores';
	import { fade } from 'svelte/transition';
</script>

<svelte:head>
	<link rel="icon" href="/axonia-logo.png" />
</svelte:head>

<SEO />

<div class="flex min-h-screen flex-col bg-gray-950 text-white">
	<Header />
	<main class="flex-1">
		{#key $page.url.pathname}
			<div in:fade={{ duration: 300, delay: 300 }} out:fade={{ duration: 300 }}>
				<slot />
			</div>
		{/key}
	</main>
	<Footer />
</div>
<BackToTop />