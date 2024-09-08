import type { RequestHandler } from "./$types";
import { json } from "@sveltejs/kit";
import { index } from "$lib/upstash";
import { doc, getDoc } from "firebase/firestore";
import { firestore } from "$lib/firebase";

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const GET: RequestHandler = async ({ url }) => {
	const query = url.searchParams.get("q");

	if (!query) return new Response("query parameter is required", { status: 400 });

	const results = await index.query({
		data: query,
		topK: 5,
		includeData: true
	});
	const ids = results.map((res) => String(res.id).split("-")[0]);
	const dataPromises = ids.map(async (id, index) => {
		const clipDoc = doc(firestore, `clips/${id}`);
		const clipData = (await getDoc(clipDoc)).data();
		const result = results[index];
		return {
			...clipData,
			id: clipDoc.id,
			matchedDescription: result.data,
			confidence: result.score
		};
	});

	return json(await Promise.all(dataPromises));
};
