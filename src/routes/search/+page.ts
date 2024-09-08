import type { PageLoad } from "./$types";
import { searchResultSchema } from "$lib/types";

export const load: PageLoad = async ({ url, fetch }) => {
	const query = url.searchParams.get("q");

	if (!query) {
		return { status: 400, error: new Error("Missing query parameter") };
	}

	const resultsPromise = fetch(`/api/search?q=${query}`).then((res) => res.json());

	return {
		results: resultsPromise.then((searchResults) => searchResultSchema.array().parse(searchResults))
	};
};
