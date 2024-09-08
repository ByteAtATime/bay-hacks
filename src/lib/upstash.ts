import { UPSTASH_VECTOR_REST_TOKEN, UPSTASH_VECTOR_REST_URL } from "$env/static/private";
import { Index } from "@upstash/vector";

export const index = new Index({
	url: UPSTASH_VECTOR_REST_URL,
	token: UPSTASH_VECTOR_REST_TOKEN
});
