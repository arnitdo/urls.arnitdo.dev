"use client"

import { createUrl } from "@/actions/urls"
import { useState } from "react"

export default function UrlForm() {
	const [urlTarget, setUrlTarget] = useState<string>("")
	const [urlSlug, setUrlSlug] = useState<string | undefined>(undefined)

	const [urlCopied, setUrlCopied] = useState<boolean>(false)

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault()
		const formData = new FormData(e.currentTarget)
		const urlTarget = formData.get("urlTarget") as string
		const urlSlug = (formData.get("urlSlug") as string) || undefined

		await createUrl({
			urlTarget: urlTarget,
			urlSlug: urlSlug,
		})

		await navigator.clipboard.writeText(
			`${window.location.origin}/${urlSlug || ""}`,
		)

		setUrlCopied(true)

		setTimeout(() => {
			setUrlTarget("")
			setUrlSlug("")
			setUrlCopied(false)
		}, 5000)
	}

	return (
		<div
			className={
				"flex w-full flex-grow flex-col items-center justify-between"
			}
		>
			<form
				className={"grid w-full grid-cols-3 gap-4"}
				onSubmit={handleSubmit}
			>
				<input
					className={
						"col-span-3 rounded border-b-2 border-gray-500 bg-transparent p-2"
					}
					type={"url"}
					placeholder={"Target Url"}
					name={"urlTarget"}
					value={urlTarget}
					onChange={(e) => {
						setUrlTarget(e.target.value)
					}}
					required
				/>
				<input
					className={
						"col-span-2 rounded border-b-2 border-gray-500 bg-transparent p-2"
					}
					type={"text"}
					required={false}
					placeholder={"Slug (Optional)"}
					name={"urlSlug"}
					value={urlSlug}
					onChange={(e) => {
						setUrlSlug(e.target.value)
					}}
				/>
				<button
					type={"submit"}
					className={
						"col-span-1 rounded bg-neutral-200 p-2 text-center text-xl text-black"
					}
				>
					{urlCopied ? "Copied!" : "Shorten"}
				</button>
			</form>
		</div>
	)
}
