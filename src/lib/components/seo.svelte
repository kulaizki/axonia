<script lang="ts">
	import { page } from '$app/stores';

	export let title: string = 'Axonia';
	export let description: string =
		'Axonia is a free, open-source tool for neuroimaging visualization.';
	export let image: string = '/axonia-opengraph-2.png'; 
	export let siteName: string = 'Axonia';
	export let author: string | null = 'Kulaizki';
	export let keywords: string = 'neuroimaging, brain visualization, NIfTI viewer, 3D brain rendering, medical imaging, open source, web-based, zero installation, neuro-informatics';

	const siteUrlBase: string = 'https://axonia.vercel.app';

	$: currentPath = $page.url.pathname;

	$: canonicalUrl = `${siteUrlBase}${currentPath}`;
	const logoUrl: string = '/axonia-logo.png';

	// Construct JSON-LD
	$: jsonLdSchema = {
		'@context': 'https://schema.org',
		'@type': 'Website',
		name: siteName,
		url: canonicalUrl,
		logo: `${siteUrlBase}/axonia-logo-text.png`,
		description: description
	};
</script>

<svelte:head>
	<title>{title}</title>
	<meta name="description" content={description} />
	<link rel="canonical" href={canonicalUrl} />
	{#if author}
		<meta name="author" content={author} />
	{/if}
	{#if keywords}
		<meta name="keywords" content={keywords} />
	{/if}

	<!-- Open Graph / Facebook -->
	<meta property="og:type" content="website" />
	<meta property="og:site_name" content={siteName} />
	<meta property="og:url" content={canonicalUrl} />
	<meta property="og:title" content={title} />
	<meta property="og:description" content={description} />
	<meta property="og:image" content={image} />
	<meta property="og:logo" content={logoUrl} />

	<!-- Twitter -->
	<meta name="twitter:card" content="summary_large_image" />
	<meta property="twitter:domain" content={new URL(siteUrlBase).hostname} />
	<meta property="twitter:url" content={canonicalUrl} />
	<meta name="twitter:title" content={title} />
	<meta name="twitter:description" content={description} />
	<meta name="twitter:image" content={image} />

	{@html `<script type="application/ld+json">${JSON.stringify(jsonLdSchema, null, 2)}</script>`}
</svelte:head> 