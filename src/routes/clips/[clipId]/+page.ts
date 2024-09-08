import type { PageLoad } from "./$types";
import { clipSchema } from "$lib/types";

export const load: PageLoad = async ({ params, fetch }) => {
	const { clipId } = params;

	const data = fetch(`/api/clips/${clipId}`).then((res) => res.json());

	return {
		clipPromise: data.then((rawClip) => {
			console.log(rawClip);
			return clipSchema.parse(rawClip);
		})
	};
};
