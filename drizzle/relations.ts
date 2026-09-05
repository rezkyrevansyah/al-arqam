import { defineRelations } from "drizzle-orm";
import * as schema from "./schema";

export const relations = defineRelations(schema, (r) => ({
	eventCategories: {
		eventProgram: r.one.eventPrograms({
			from: r.eventCategories.programId,
			to: r.eventPrograms.id
		}),
		eventWinners: r.many.eventWinners(),
	},
	eventPrograms: {
		eventCategories: r.many.eventCategories(),
	},
	eventWinners: {
		eventCategory: r.one.eventCategories({
			from: r.eventWinners.categoryId,
			to: r.eventCategories.id
		}),
	},
	infaqTarawihEntries: {
		transparencyProgram: r.one.transparencyPrograms({
			from: r.infaqTarawihEntries.programId,
			to: r.transparencyPrograms.id
		}),
	},
	transparencyPrograms: {
		infaqTarawihEntries: r.many.infaqTarawihEntries(),
		santunanYatimEntries: r.many.santunanYatimEntries(),
		transparencyDonors: r.many.transparencyDonors(),
		transparencyMetrics: r.many.transparencyMetrics(),
		zisEntries: r.many.zisEntries(),
	},
	santunanYatimEntries: {
		transparencyProgram: r.one.transparencyPrograms({
			from: r.santunanYatimEntries.programId,
			to: r.transparencyPrograms.id
		}),
	},
	transparencyDonors: {
		transparencyProgram: r.one.transparencyPrograms({
			from: r.transparencyDonors.programId,
			to: r.transparencyPrograms.id
		}),
	},
	transparencyMetrics: {
		transparencyProgram: r.one.transparencyPrograms({
			from: r.transparencyMetrics.programId,
			to: r.transparencyPrograms.id
		}),
	},
	zisEntries: {
		transparencyProgram: r.one.transparencyPrograms({
			from: r.zisEntries.programId,
			to: r.transparencyPrograms.id
		}),
	},
}))