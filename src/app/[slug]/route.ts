import { getUrlTarget } from "@/actions/urls"
import { type NextRequest, NextResponse } from "next/server"

import { BASIC_AUTH_PREFIX } from "@/util/constants"
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

	const { urlUsername, urlPassword } = urlDoc

	let urlAuth: string | null = null

	if (urlUsername && urlPassword) {
		// Authentication is required

		const visitAuthHeader = req.headers.get("authorization")?.trim()
		if (
			!visitAuthHeader ||
			!visitAuthHeader.startsWith(BASIC_AUTH_PREFIX)
		) {
			return new NextResponse(null, {
				status: 401,
				headers: {
					"WWW-Authenticate": `Basic realm="${slug} ${new Date().toLocaleString()}"`,
				},
			})
		}

		const authValueBase64 = visitAuthHeader.slice(BASIC_AUTH_PREFIX.length)
		const authUsernameAndPassword = atob(authValueBase64)
		const [authUsername, authPassword] = authUsernameAndPassword.split(":")

		const usernameRegex = new RegExp(urlUsername)

		const passwordRegex = new RegExp(urlPassword)

		const [usernameMatch, passwordMatch] = [
			usernameRegex.test(authUsername),
			passwordRegex.test(authPassword),
		]

		const authValid = usernameMatch && passwordMatch
		if (!authValid) {
			return new NextResponse(null, {
				status: 401,
				headers: {
					"WWW-Authenticate": `Basic realm="${slug}"`,
				},
			})
		}

		urlAuth = authUsernameAndPassword
	}

	await db.urlVisit.create({
		data: {
			visitIp: visitIp,
			visitReferrer: visitReferrer,
			visitTimestamp: new Date(),
			visitUserAgent: visitUa,
			visitSlug: slug,
			visitAuth: urlAuth,
		},
	})

	return NextResponse.redirect(urlDoc.urlTarget, {
		status: 307,
	})
}
