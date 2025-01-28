import { getUrlTarget } from "@/actions/urls"
import { type NextRequest, NextResponse } from "next/server"

import db from "@/util/db"

type RequestParams = {
	params: Promise<{ slug: string }>
}

export const GET = async (req: NextRequest, reqParams: RequestParams) => {
	const { slug } = await reqParams.params
	const visitReferrer =
		req.headers.get("referer") ?? req.headers.get("referrer") ?? "direct"
	const visitIp = (req.headers.get("x-forwarded-for") ?? "0.0.0.0").split(
		",",
	)[0]
	const visitUa = req.headers.get("user-agent") ?? "unknown"

	const urlDoc = await getUrlTarget(slug)
	if (!urlDoc) {
		return NextResponse.redirect(new URL("/", req.url), { status: 307 })
	}

	await db.urlVisit.create({
		data: {
			visitIp: visitIp,
			visitReferrer: visitReferrer,
			visitTimestamp: new Date(),
			visitUserAgent: visitUa,
			visitSlug: slug,
		},
	})

	return NextResponse.redirect(urlDoc.urlTarget, {
		status: 307,
	})
}
