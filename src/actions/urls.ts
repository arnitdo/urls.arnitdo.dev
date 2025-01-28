"use server"

import type { Url } from "@prisma/client"

import db from "@/util/db"

type CreateUrlArgs = Partial<Pick<Url, "urlSlug">> & Pick<Url, "urlTarget">

export async function createUrl(createArgs: CreateUrlArgs) {
	return db.url.create({
		data: {
			urlTarget: createArgs.urlTarget,
			urlSlug: createArgs.urlSlug,
		},
	})
}

export async function getUrlCount() {
	return db.url.count()
}
