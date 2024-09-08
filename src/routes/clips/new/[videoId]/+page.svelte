<script lang="ts">
	import { Input } from "$lib/components/ui/input";
	import { Button } from "$lib/components/ui/button";
	import { page } from "$app/stores";
	import type { DescriptionInput } from "$lib/types";
	import { millisecondsToTimestamp, timestampToMilliseconds } from "$lib/utils";
	import { goto } from "$app/navigation";
	import { userStore } from "sveltefire";
	import { auth } from "$lib/firebase";
	import { toast } from "svelte-sonner";

	let timestamp = "";
	let description = "";
	let descriptionInputs: DescriptionInput[] = [];
	let error = "";

	const user = userStore(auth);

	const isValidTimestamp = (ts: string): boolean => {
		const regex = /^\d{1,2}:\d{2}$/;
		return regex.test(ts);
	};

	const addTimestampDescription = () => {
		error = "";
		if (!timestamp || !description) {
			error = "Timestamp and description cannot be empty";
			return;
		}
		if (!isValidTimestamp(timestamp)) {
			error = "Invalid timestamp format. Use mm:ss";
			return;
		}
		descriptionInputs = [
			...descriptionInputs,
			{ timestamp: timestampToMilliseconds(timestamp), description }
		];
		timestamp = "";
		description = "";
	};

	const handleSubmit = async () => {
		if (descriptionInputs.length === 0) {
			error = "Add at least one timestamp and description";
			return;
		}
		const idToken = await $user?.getIdToken();
		if (!idToken) {
			error = "You need to be logged in to do that!";
			return;
		}

		const resPromise = fetch("/api/clips", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${idToken}`
			},
			body: JSON.stringify({
				videoId,
				descriptionInputs
			})
		});

		toast.promise(resPromise, {
			loading: "Saving clip...",
			success: "Clip saved successfully",
			error: "An error occurred while saving the clip"
		});

		const res = await resPromise;

		if (!res.ok) {
			error = "An error occurred while saving the clip";
			return;
		}
		if (res.status === 201) {
			await goto("/");
		}
	};

	$: videoId = $page.params.videoId;
</script>

<div class="mx-auto flex w-full max-w-screen-md flex-col gap-y-4 px-4 py-8">
	<h1 class="text-4xl font-extrabold">Add a new clip</h1>

	<iframe
		src="https://www.youtube.com/embed/{videoId}"
		title="Video"
		class="aspect-video w-full"
		allowfullscreen
	></iframe>

	<form on:submit|preventDefault={handleSubmit} class="flex flex-col gap-y-4">
		<button type="submit" disabled style="display: none" aria-hidden="true"></button>
		<div class="flex gap-x-4">
			<Input placeholder="Timestamp" bind:value={timestamp} />
			<Input placeholder="Description" bind:value={description} />
			<Button on:click={addTimestampDescription}>Add</Button>
		</div>
		{#if error}
			<p class="text-red-500">{error}</p>
		{/if}
		<div class="flex flex-col gap-y-2">
			{#each descriptionInputs as td}
				<div class="flex gap-x-4">
					<p>{millisecondsToTimestamp(td.timestamp)}</p>
					<p>{td.description}</p>
				</div>
			{/each}
		</div>
		<Button variant="default" type="submit">Submit</Button>
	</form>
</div>
