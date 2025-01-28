"use server"

import type { Url } from "@prisma/client"

import db from "@/util/db"

type CreateUrlArgs = Partial<Pick<Url, "urlSlug">> & Pick<Url, "urlTarget">

export async function createUrl(createArgs: CreateUrlArgs) {
	return db.url.upsert({
		where: {
			urlSlug: createArgs.urlSlug,
		},
		update: {
			urlTarget: createArgs.urlTarget,
			urlTimestamp: new Date(),
		},
		create: {
			urlTarget: createArgs.urlTarget,
			urlSlug: createArgs.urlSlug,
			urlTimestamp: new Date(),
		},
	})
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
