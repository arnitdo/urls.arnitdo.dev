"use server"

import type { Url } from "@prisma/client"

import db from "@/util/db"

export type CreateUrlArgs = Partial<Pick<Url, "urlSlug">> &
	Pick<Url, "urlTarget" | "urlUsername" | "urlPassword">

export async function createUrl(createArgs: CreateUrlArgs) {
	const urlObject = await db.url.upsert({
		where: {
			urlSlug: createArgs.urlSlug,
		},
		update: {
			urlTarget: createArgs.urlTarget,
			urlTimestamp: new Date(),
			urlUsername: createArgs.urlUsername || null,
			urlPassword: createArgs.urlPassword || null,
		},
		create: {
			urlSlug: createArgs.urlSlug,
			urlTarget: createArgs.urlTarget,
			urlTimestamp: new Date(),
			urlUsername: createArgs.urlUsername || null,
			urlPassword: createArgs.urlPassword || null,
		},
	})

	return urlObject
}

type GetUrlCountArgs = {
	timeframeMs?: number
}

export async function getUrlCount(args: GetUrlCountArgs = {}) {
	return db.url.count({
		where: {
			urlTimestamp: {
				gte: args.timeframeMs
					? new Date(Date.now() - args.timeframeMs)
					: undefined,
			},
		},
	})
}

export async function getUrlTarget(urlSlug: string) {
	return db.url.findUnique({
		where: {
			urlSlug: urlSlug,
		},
	})
}
