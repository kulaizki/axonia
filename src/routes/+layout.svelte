<script lang="ts">
	import '../app.css';
	import Header from '$lib/components/header.svelte';
	import Footer from '$lib/components/footer.svelte';
	import SEO from '$lib/components/seo.svelte';
	import BackToTop from '$lib/components/back-to-top.svelte';
</script>

<svelte:head>
	<link rel="icon" href="/cs-neuro-logo.png" />
</svelte:head>

<SEO />

<div class="flex flex-col min-h-screen bg-gray-900">
	<Header />
	<main class="flex-1">
		<slot />
	</main>
	<Footer />
</div>
<BackToTop />