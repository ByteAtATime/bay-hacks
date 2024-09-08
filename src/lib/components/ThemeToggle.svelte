<script lang="ts">
	import Sun from "lucide-svelte/icons/sun";
	import Moon from "lucide-svelte/icons/moon";

	import { toggleMode } from "mode-watcher";
	import { Button } from "$lib/components/ui/button";
</script>

<Button on:click={toggleMode} variant="secondary" size="icon" class="group fixed bottom-4 right-4">
	<Sun
		class="h-4 w-4 rotate-0 scale-100 transition-all group-hover:rotate-12 dark:-rotate-90 dark:scale-0"
	/>
	<Moon
		class="absolute h-4 w-4 rotate-90 scale-0 transition-all group-hover:rotate-12 dark:rotate-0 dark:scale-100"
	/>
	<span class="sr-only">Toggle theme</span>
</Button>
