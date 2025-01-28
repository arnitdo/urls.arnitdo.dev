import { getUrlCount } from "@/actions/urls"
import UrlForm from "@/components/urlform"
import Link from "next/link"

const timeFrames = [
	1, // 1 Hour,
	6, // 6 Hours,
	12, // 12 Hours,
	24, // 24 Hours,
]

export default async function Page() {
	const randomTimeframe =
		timeFrames[Math.floor(Math.random() * timeFrames.length)]

	const urlCount = await getUrlCount({
		timeframeMs: randomTimeframe /*h*/ * 60 /*m*/ * 60 /*s*/ * 1000 /*ms*/,
	})

	return (
		<main
			className={
				"min-w-screen flex min-h-screen flex-col items-center justify-center"
			}
		>
			<div
				className={
					"flex flex-col items-center justify-between gap-32 p-16"
				}
			>
				<h1 className={"text-4xl"}>
					{urlCount} URLs shortened in the last {randomTimeframe}{" "}
					hour(s) {urlCount === 0 ? ":(" : ""}
				</h1>
				<UrlForm />
				<Link
					className={"text-2xl text-neutral-400 underline"}
					href={"https://arnitdo.dev"}
					target={"_blank"}
				>
					Made with &lt;3 by arnitdo.dev
				</Link>
			</div>
		</main>
	)
}
