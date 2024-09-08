import type { RequestHandler } from "./$types";
import { clipSchema, type Clip } from "$lib/types";
import { json } from "@sveltejs/kit";
import { arrayUnion, doc, getDoc, updateDoc } from "firebase/firestore";
import { firestore } from "$lib/firebase";

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const GET: RequestHandler = async ({ params }) => {
	const { clipId } = params;

	const clip = await getDoc(doc(firestore, `clips/${clipId}`)).then((doc) => {
		const data = { ...doc.data(), id: doc.id };
		console.log(data);
		return clipSchema.parse(data);
	});

	return json(clip);
};

export const PUT: RequestHandler = async ({ params, request }) => {
	const token = request.headers.get("Authorization")?.split("Bearer ")[1];

	if (!token) {
		return json({ error: "Unauthorized" }, { status: 401 });
	}

	const body = await request.json();

	await updateDoc(doc(firestore, `clips/${params.clipId}`), {
		descriptions: arrayUnion({
			description: body.description,
			author: body.author,
			publishedAt: new Date(),
			score: 0
		})
	});

	return json({ success: true });
};
