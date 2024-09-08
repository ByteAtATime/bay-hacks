<script lang="ts">
	import { Search } from "lucide-svelte";
	import { Input } from "$lib/components/ui/input/index.js";
	import { onMount } from "svelte";
	import { page } from "$app/stores";
	import { goto } from "$app/navigation";

	let searchQuery = "";

	onMount(() => {
		if ($page.url.searchParams.has("q")) {
			searchQuery = $page.url.searchParams.get("q")!;
		}
	});

	const submit = () => {
		goto(`/search?q=${searchQuery}`);
	};
</script>

<form class="relative max-w-[66vw] grow" on:submit|preventDefault={submit}>
	<Search class="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
	<Input
		type="search"
		placeholder="Search..."
		class="w-full rounded-lg bg-background pl-8"
		bind:value={searchQuery}
	/>
</form>
