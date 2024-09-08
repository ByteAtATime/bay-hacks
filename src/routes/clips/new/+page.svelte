<script>
	import { Input } from "$lib/components/ui/input";
	import { Button } from "$lib/components/ui/button";
	import { goto } from "$app/navigation";

	let youtubeUrl = "";
	let invalidUrl = false;

	const YOUTUBE_REGEX =
		/^(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S*\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;

	const handleSubmit = () => {
		const res = YOUTUBE_REGEX.exec(youtubeUrl);

		if (!res) {
			invalidUrl = true;
			return;
		}

		const videoId = res[1];

		goto(`/clips/new/${videoId}`);
	};
</script>

<div class="mx-auto flex w-full max-w-screen-md flex-col gap-y-4 px-4 py-8">
	<h1 class="text-4xl font-extrabold">Add a new clip</h1>

	<form on:submit|preventDefault={handleSubmit} class="flex flex-col gap-y-4">
		<Input placeholder="Youtube URL" required bind:value={youtubeUrl} />

		{#if invalidUrl}
			<p class="text-red-500">Invalid Youtube URL</p>
		{/if}

		<Button variant="default" type="submit">Let's go!</Button>
	</form>
</div>
