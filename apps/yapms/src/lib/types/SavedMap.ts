import { z } from 'zod';
import { CandidateSchema } from './Candidate';
import { SavedRegionSchema } from './Region';

export const SavedMapSchema = z.object({
	map: z.object({
		country: z.string().regex(/^[\w-]+$/),
		type: z.string().regex(/^[\w-]+$/),
		year: z.string().regex(/^[\w-]+$/),
		variant: z.string().regex(/^[\w-]+$/)
	}),
	tossup: CandidateSchema,
	candidates: CandidateSchema.array(),
	regions: SavedRegionSchema.array()
});

type SavedMap = z.infer<typeof SavedMapSchema>;

export default SavedMap;
