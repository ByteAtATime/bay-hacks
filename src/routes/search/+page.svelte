<script lang="ts">
	import * as Table from "$lib/components/ui/table/index.js";
	import { AspectRatio } from "$lib/components/ui/aspect-ratio";
	import { Skeleton } from "$lib/components/ui/skeleton";
	import { ExternalLink } from "lucide-svelte";
	import { Button } from "$lib/components/ui/button";
	import * as HoverCard from "$lib/components/ui/hover-card";
	import { builderActions } from "bits-ui";

	export let data;

	$: results = data.results;
</script>

{#await results}
	<Table.Root>
		<Table.Header>
			<Table.Row>
				<Table.Head>Rank</Table.Head>
				<Table.Head>Thumbnail</Table.Head>
				<Table.Head>Title</Table.Head>
				<Table.Head>Published At</Table.Head>
				<Table.Head>Confidence</Table.Head>
				<Table.Head>Link</Table.Head>
			</Table.Row>
		</Table.Header>
		<Table.Body>
			{#each Array(5) as _, i (i)}
				<Table.Row>
					<Table.Cell class="w-12 text-muted-foreground">#{i + 1}</Table.Cell>
					<Table.Cell class="w-32">
						<AspectRatio ratio={16 / 9}>
							<Skeleton class="h-full w-full rounded-xl" />
						</AspectRatio>
					</Table.Cell>
					<Table.Cell>
						<Skeleton class="h-4 w-52 rounded-full" />
					</Table.Cell>
					<Table.Cell>
						<Skeleton class="h-4 w-24 rounded-full" />
					</Table.Cell>
					<Table.Cell>
						<Skeleton class="h-4 w-16 rounded-full" />
					</Table.Cell>
					<Table.Cell>
						<Skeleton class="h-10 w-10 rounded-lg" />
					</Table.Cell>
				</Table.Row>
			{/each}
		</Table.Body>
	</Table.Root>
{:then videos}
	{#if videos}
		<Table.Root>
			<Table.Header>
				<Table.Row>
					<Table.Head>Rank</Table.Head>
					<Table.Head>Thumbnail</Table.Head>
					<Table.Head>Title</Table.Head>
					<Table.Head>Matched Description</Table.Head>
					<Table.Head>Published At</Table.Head>
					<Table.Head>Confidence</Table.Head>
					<Table.Head>Link</Table.Head>
				</Table.Row>
			</Table.Header>
			<Table.Body>
				{#each videos as video, i (i)}
					<Table.Row>
						<Table.Cell class="w-12 text-muted-foreground">#{i + 1}</Table.Cell>
						<Table.Cell class="w-32">
							<AspectRatio ratio={16 / 9}>
								<img src={video.thumbnailUri} class="w-full rounded-xl" alt="Thumbnail" />
							</AspectRatio>
						</Table.Cell>
						<Table.Cell class="underline"
							><a href="/clips/{video.id}">{video.videoTitle}</a></Table.Cell
						>
						<HoverCard.Root>
							<Table.Cell class="max-w-44 truncate">
								<HoverCard.Trigger class="block w-44 truncate"
									>{video.matchedDescription}</HoverCard.Trigger
								>
							</Table.Cell>
							<HoverCard.Content side="bottom">{video.matchedDescription}</HoverCard.Content>
						</HoverCard.Root>
						<Table.Cell>{video.publishedAt.toLocaleDateString("en-US")}</Table.Cell>
						<Table.Cell>{Math.round(video.confidence * 100)}%</Table.Cell>
						<Table.Cell>
							<Button variant="ghost" size="icon">
								<a
									href="https://youtu.be/{video.videoId}?t={video.clipTimestamp / 1000}s"
									target="_blank"
									rel="noopener noreferrer"
									class="underline"
								>
									<ExternalLink />
								</a>
							</Button>
						</Table.Cell>
					</Table.Row>
				{/each}
			</Table.Body>
		</Table.Root>
	{/if}
{/await}
