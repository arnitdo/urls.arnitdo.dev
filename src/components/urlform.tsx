"use client"

import { CreateUrlArgs, createUrl } from "@/actions/urls"
import { useState } from "react"

type UrlFormState = CreateUrlArgs

const initFormState: UrlFormState = {
	urlTarget: "",
	urlSlug: undefined,
	urlUsername: null,
	urlPassword: null,
}

export default function UrlForm() {
	const [formState, setFormState] = useState<UrlFormState>(initFormState)
	const [urlCopied, setUrlCopied] = useState<boolean>(false)

	const { urlTarget, urlSlug, urlUsername, urlPassword } = formState

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault()

		await createUrl(formState)

		await navigator.clipboard.writeText(
			`${window.location.origin}/${urlSlug || ""}`,
		)

		setUrlCopied(true)

		setTimeout(() => {
			setUrlCopied(false)
			setFormState(initFormState)
		}, 5000)
	}

	return (
		<div
			className={
				"flex w-full flex-grow flex-col items-center justify-between"
			}
		>
			<form
				className={"grid w-full grid-cols-6 gap-4"}
				onSubmit={handleSubmit}
			>
				<input
					className={
						"col-span-6 rounded border-b-2 border-gray-500 bg-transparent p-2"
					}
					type={"url"}
					placeholder={"Target Url"}
					name={"urlTarget"}
					value={urlTarget}
					onChange={(e) => {
						setFormState((prevState) => {
							return {
								...prevState,
								urlTarget: e.target.value,
							}
						})
					}}
					required
				/>
				<input
					className={
						"col-span-4 rounded border-b-2 border-gray-500 bg-transparent p-2"
					}
					type={"text"}
					required={false}
					placeholder={"Slug (Optional)"}
					name={"urlSlug"}
					value={urlSlug}
					onChange={(e) => {
						setFormState((prevState) => {
							return {
								...prevState,
								urlSlug: e.target.value,
							}
						})
					}}
				/>
				<button
					type={"submit"}
					className={
						"col-span-2 rounded bg-neutral-200 p-2 text-center text-xl text-black"
					}
				>
					{urlCopied ? "Copied!" : "Shorten"}
				</button>
				<input
					type={"text"}
					required={!!urlPassword}
					placeholder={"Username Regex (Optional)"}
					value={urlUsername || ""}
					name={"urlUsername"}
					onChange={(e) => {
						setFormState((prevState) => {
							return {
								...prevState,
								urlUsername: e.target.value,
							}
						})
					}}
					className={
						"col-span-3 rounded border-b-2 border-gray-500 bg-transparent p-2"
					}
				/>
				<input
					type={"text"}
					required={!!urlUsername}
					placeholder={"Password Regex (Optional)"}
					value={urlPassword || ""}
					name={"urlPassword"}
					onChange={(e) => {
						setFormState((prevState) => {
							return {
								...prevState,
								urlPassword: e.target.value,
							}
						})
					}}
					className={
						"col-span-3 rounded border-b-2 border-gray-500 bg-transparent p-2"
					}
				/>
			</form>
		</div>
	)
}
