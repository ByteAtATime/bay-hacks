import { Timestamp } from "firebase/firestore";
import { z } from "zod";

export const descriptionInputSchema = z.object({
	description: z.string(),
	timestamp: z.number()
});

export type DescriptionInput = z.infer<typeof descriptionInputSchema>;

export const descriptionSchema = z.object({
	description: z.string(),
	author: z.string(),
	publishedAt: z
		.string()
		.or(z.date())
		.or(z.custom<Timestamp>())
		.transform((value) => {
			if (value instanceof Timestamp) {
				console.log(value, value.toDate());
				return value.toDate();
			}

			return new Date(value);
		}),
	score: z.number().int()
});

export const clipSchema = z.object({
	id: z.string(),
	videoTitle: z.string(),
	videoId: z.string(),
	thumbnailUri: z.string(),
	publishedAt: z
		.string()
		.or(z.date())
		.or(z.custom<Timestamp>())
		.transform((value) => {
			if (value instanceof Timestamp) {
				console.log(value, value.toDate());
				return value.toDate();
			}

			return new Date(value);
		}),
	clipTimestamp: z.number(),
	descriptions: z.array(descriptionSchema)
});

export type Clip = z.infer<typeof clipSchema>;

export const searchResultSchema = z.object({
	id: z.string(),
	videoTitle: z.string(),
	videoId: z.string(),
	thumbnailUri: z.string(),
	publishedAt: z
		.string()
		.or(z.date())
		.or(z.custom<{ seconds: number; nanoseconds: number }>())
		.transform((value) => {
			if (Object.keys(value).includes("seconds")) {
				return new Date(value.seconds * 1000 + value.nanoseconds / 1000000);
			}

			return new Date(value);
		}),
	clipTimestamp: z.number(),
	confidence: z.number().min(0).max(1),
	matchedDescription: z.string()
});
