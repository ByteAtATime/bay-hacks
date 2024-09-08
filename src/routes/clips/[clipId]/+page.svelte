<script lang="ts">
	import {
		formatTimestampInMmSs,
		videoUrlWithoutTimestamp,
		videoUrlWithTimestamp
	} from "$lib/utils";
	import { Button } from "$lib/components/ui/button";
	import { ArrowDown, ArrowUp, Share2 } from "lucide-svelte";
	import { Separator } from "$lib/components/ui/separator";
	import { onMount } from "svelte";
	import { Skeleton } from "$lib/components/ui/skeleton";
	import AspectRatio from "$lib/components/ui/aspect-ratio/aspect-ratio.svelte";
	import { Textarea } from "$lib/components/ui/textarea";
	import { userStore } from "sveltefire";
	import { auth } from "$lib/firebase";
	import { toast } from "svelte-sonner";
	import { invalidateAll } from "$app/navigation";

	export let data;

	$: clipPromise = data.clipPromise;

	let description = "";

	const user = userStore(auth);

	const postComment = async () => {
		if (description.trim() === "") return;

		const clip = await clipPromise;

		const resPromise = fetch(`/api/clips/${clip.id}`, {
			method: "PUT",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${$user?.getIdToken()}`
			},
			body: JSON.stringify({ description, author: $user?.displayName })
		});

		toast.promise(resPromise, {
			loading: "Submitting description...",
			success: "Description submitted successfully!",
			error: "Failed to submit description!"
		});

		const res = await resPromise;

		if (res.ok) {
			description = "";
			toast.success("Description submitted successfully!");
			invalidateAll();
		} else {
			toast.error("Failed to submit description!");
		}
	};

	const voteDescription = (index: number, voteChange: number) => async () => {
		const clip = await clipPromise;

		const resPromise = fetch(`/api/clips/${clip.id}/vote`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${$user?.getIdToken()}`
			},
			body: JSON.stringify({ descriptionIndex: index, voteChange })
		});

		toast.promise(resPromise, {
			loading: "Submitting vote...",
			success: "Vote submitted successfully!",
			error: "Failed to submit vote!"
		});

		const res = await resPromise;

		if (res.ok) {
			toast.success("Vote submitted successfully!");
			invalidateAll();
		} else {
			toast.error("Failed to submit vote!");
		}
	};
</script>

{#await clipPromise}
	<div class="mx-auto flex w-fit flex-col gap-y-16 px-4 py-8">
		<div class="flex w-full justify-center gap-x-8">
			<Skeleton class="aspect-video w-[28rem] rounded-2xl" />

			<div class="flex w-80 flex-col gap-y-2">
				<Skeleton class="h-12 w-full" />

				<div class="flex flex-col gap-y-3">
					<Skeleton class="h-5 w-2/3 text-muted-foreground" />
					<Skeleton class="w-ful h-5" />
					<Skeleton class="h-5 w-1/2" />
				</div>

				<div class="mt-auto grid grid-cols-2 gap-x-2">
					<Skeleton class="h-10" />

					<Skeleton class="h-10" />
				</div>

				<Skeleton class="h-10" />
			</div>
		</div>

		<div class="flex flex-col gap-y-4">
			<h2 class="text-3xl font-bold">Descriptions</h2>

			<div class="flex flex-col gap-y-4">
				{#each Array(5).keys() as _, i}
					{#if i > 0}
						<Separator />
					{/if}

					<div class="flex gap-x-4 gap-y-2">
						<Skeleton class="h-20 w-8" />

						<div class="flex w-full flex-col gap-y-3">
							<Skeleton class="h-6 w-40" />

							<div class="flex flex-col gap-y-2">
								<Skeleton class="h-3 w-full" />
								<Skeleton class="h-3 w-full" />
								<Skeleton class="h-3 w-3/4" />
							</div>
						</div>
					</div>
				{/each}
			</div>
		</div>
	</div>
{:then clip}
	<div class="mx-auto flex w-fit flex-col gap-y-16 px-4 py-8">
		<div class="flex justify-center gap-x-8">
			<img
				src={clip.thumbnailUri}
				alt="{clip.videoTitle} thumbnail"
				class="aspect-video w-[28rem] rounded-2xl"
			/>

			<div class="flex w-80 flex-col gap-y-2">
				<h1 class="text-3xl font-bold">{clip.videoTitle}</h1>

				<p class="text-muted-foreground">
					Video published on
					<span class="text-foreground">{clip.publishedAt.toLocaleDateString("en-US")}</span>
				</p>

				<p class="text-muted-foreground">
					Descriptions: <span class="text-foreground">{clip.descriptions.length}</span> proposed,
					<span class="text-foreground"
						>{clip.descriptions.filter((it) => it.score >= 3).length}</span
					> accepted
				</p>

				<p class="text-muted-foreground">
					Clip starts at
					<span class="text-foreground">{formatTimestampInMmSs(clip.clipTimestamp)}</span>
				</p>

				<div class="mt-auto grid grid-cols-2 gap-x-2">
					<a
						href={videoUrlWithTimestamp(clip)}
						target="_blank"
						rel="noopener noreferrer"
						class="flex items-center gap-x-2"
					>
						<Button variant="default" class="grow">View Clip</Button>
					</a>

					<a
						href={videoUrlWithoutTimestamp(clip)}
						target="_blank"
						rel="noopener noreferrer"
						class="flex items-center gap-x-2"
					>
						<Button variant="default" class="grow">View Full Video</Button>
					</a>
				</div>

				<Button variant="secondary" class="gap-x-2">
					<Share2 class="h-6 w-6" />

					Share Clip!
				</Button>
			</div>
		</div>

		<div class="flex flex-col gap-y-4">
			<h2 class="text-3xl font-bold">Descriptions</h2>

			<form class="mb-2 flex flex-col gap-y-2" on:submit|preventDefault={postComment}>
				<Textarea placeholder="Add a description..." class="w-full" bind:value={description} />
				<Button variant="default" type="submit" class="w-full">Submit</Button>
			</form>

			<div class="flex flex-col gap-y-4">
				{#each clip.descriptions as description, i}
					{#if i > 0}
						<Separator />
					{/if}

					<div class="flex gap-x-4 gap-y-2">
						<div class="flex flex-col items-center rounded-lg bg-muted p-1">
							<Button
								variant="ghost"
								size="icon"
								class="h-6 w-6 hover:bg-black/10 dark:hover:bg-white/10"
								on:click={voteDescription(i, 1)}
							>
								<ArrowUp class="h-4 w-4" />
							</Button>

							{description.score}

							<Button
								variant="ghost"
								size="icon"
								class="h-6 w-6 hover:bg-black/10 dark:hover:bg-white/10"
								on:click={voteDescription(i, -1)}
							>
								<ArrowDown class="h-4 w-4" />
							</Button>
						</div>

						<div class="flex flex-col gap-y-2">
							<div class="flex gap-x-2">
								<p class="font-bold">{description.author}</p>

								<p class="text-muted-foreground">{description.publishedAt.toLocaleString()}</p>
							</div>

							<p>{description.description}</p>
						</div>
					</div>
				{/each}
			</div>
		</div>
	</div>
{/await}
