import type { RequestHandler } from "./$types";
import { descriptionInputSchema, type Clip } from "$lib/types";
import { json } from "@sveltejs/kit";
import { z } from "zod";
import { auth, firestore } from "$lib/firebase";
import { addDoc, collection } from "firebase/firestore";
import { index } from "$lib/upstash";

const bodySchema = z.object({
	videoId: z.string(),
	descriptionInputs: descriptionInputSchema.array()
});

export const POST: RequestHandler = async ({ request }) => {
	const body = bodySchema.parse(await request.json());
	const userToken = request.headers.get("Authorization")?.split(" ")[1];

	if (!userToken) {
		return json({ error: "Unauthorized" }, { status: 401 });
	}

	const videoDetails = await fetch(
		`https://noembed.com/embed?url=https://www.youtube.com/watch?v=${body.videoId}`
	).then((res) => res.json());

	for (const descriptionInput of body.descriptionInputs) {
		const doc = await addDoc(collection(firestore, "clips"), {
			videoId: body.videoId,
			videoTitle: videoDetails.title,
			descriptions: [
				{
					description: descriptionInput.description,
					publishedAt: new Date(),
					author: "SYSTEM",
					score: 5
				}
			],
			thumbnailUri: videoDetails.thumbnail_url,
			publishedAt: new Date(),
			clipTimestamp: descriptionInput.timestamp
		} satisfies Omit<Clip, "id">);

		const id = doc.id;

		await index.upsert({
			id,
			data: descriptionInput.description
		});
	}

	return json({ success: true }, { status: 201 });
};
