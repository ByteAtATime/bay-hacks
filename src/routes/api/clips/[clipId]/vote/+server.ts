import { doc, getDoc, updateDoc } from "firebase/firestore";
import type { RequestHandler } from "./$types";
import { firestore } from "$lib/firebase";
import { json } from "@sveltejs/kit";
import { index } from "$lib/upstash";

export const POST: RequestHandler = async ({ params, request }) => {
	const body = await request.json();
	const { descriptionIndex, voteChange } = body;

	const descriptions = await getDoc(doc(firestore, `clips/${params.clipId}`)).then(
		(doc) => doc.data()?.descriptions
	);
	if (!descriptions) {
		return json({ error: "Clip not found" }, { status: 404 });
	}
	const newDescriptions = descriptions.map((description: { score: number }, index: number) => {
		if (index === descriptionIndex) {
			return {
				...description,
				score: description.score + voteChange
			};
		}
		return description;
	});

	await updateDoc(doc(firestore, `clips/${params.clipId}`), {
		descriptions: newDescriptions
	});

	const prevScore = descriptions[descriptionIndex].score;
	const newScore = newDescriptions[descriptionIndex].score;

	if (prevScore < 3 && newScore >= 3) {
		await index.upsert({
			id: `${params.clipId}-${descriptionIndex}`,
			data: newDescriptions[descriptionIndex].description
		});
	}

	if (prevScore > -3 && newScore <= -3) {
		await index.delete(`${params.clipId}-${descriptionIndex}`);
	}

	return json({ success: true });
};
