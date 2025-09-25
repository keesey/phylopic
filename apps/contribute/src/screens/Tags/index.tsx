import { type Tags as TagsModel } from "@phylopic/api-models"
import { Hash, isTag, normalizeTag, Tag } from "@phylopic/utils"
import { useAPIFetcher, useAPISWRKey } from "@phylopic/utils-api"
import { FC, useMemo, useState } from "react"
import useSWRImmutable from "swr/immutable"
import useSubmission from "~/editing/useSubmission"
import useSubmissionMutator from "~/editing/useSubmissionMutator"
import Dialogue from "~/ui/Dialogue"
import FileView from "~/ui/FileView"
import { ICON_CHECK, ICON_PLUS, ICON_X } from "~/ui/ICON_SYMBOLS"
import Speech from "~/ui/Speech"
import SpeechStack from "~/ui/SpeechStack"
import UserButton from "~/ui/UserButton"
import UserOptions from "~/ui/UserOptions"
import LoadingState from "../LoadingState"
import UserInput from "~/ui/UserInput"
import UserTextForm from "~/ui/UserTextForm"
import UserLinkButton from "~/ui/UserLinkButton"
export type Props = {
    hash: Hash
}
const Tags: FC<Props> = ({ hash }) => {
    const [newTag, setNewTag] = useState("")
    const tagKey = useAPISWRKey(`${process.env.NEXT_PUBLIC_API_URL}/imagetags`)
    const fetcher = useAPIFetcher<TagsModel>()
    const tagsResponse = useSWRImmutable(tagKey, fetcher)
    const existingTags = useMemo(() => tagsResponse?.data?.tags ?? [], [tagsResponse])
    const submission = useSubmission(hash)
    const submissionTags = useMemo(
        () => new Set<Tag>(submission?.tags?.split(",").filter(tag => isTag(tag))),
        [submission?.tags],
    )
    const allTags = useMemo(
        () => Array.from(new Set<Tag>([...existingTags, ...Array.from(submissionTags)])).sort(),
        [existingTags, submissionTags],
    )
    const mutate = useSubmissionMutator(hash)
    if (!submission) {
        return <LoadingState>One moment&hellip;</LoadingState>
    }
    const addNewTag = (tag: Tag) => {
        console.debug({ tag })
        tag = normalizeTag(tag) ?? ""
        if (isTag(tag)) {
            if (!submissionTags.has(tag)) {
                const newTags = new Set(submissionTags)
                newTags.add(tag)
                void mutate({ tags: Array.from(newTags).sort().join(",") }).then(() => setNewTag(""))
            }
        } else {
            setNewTag(tag)
            alert("Please enter a tag of at least two characters.")
        }
    }
    const toggleTag = (tag: Tag) => {
        const newTags = new Set(submissionTags)
        if (submissionTags.has(tag)) {
            newTags.delete(tag)
        } else {
            newTags.add(tag)
        }
        void mutate({ tags: Array.from(newTags).sort().join(",") })
    }
    return (
        <>
            <datalist id="tag-list">
                {allTags.map(tag => (
                    <option key={tag} value={tag} />
                ))}
            </datalist>
            <Dialogue>
                <Speech mode="system">
                    <SpeechStack collapsible>
                        <figure>
                            <FileView
                                src={`${process.env.NEXT_PUBLIC_UPLOADS_URL}/files/${encodeURIComponent(hash)}`}
                                mode="light"
                            />
                        </figure>
                        {submission.tags ? (
                            <p>
                                You may add or remove tags for your silhouette.
                                {existingTags.length > 0 && <> Use any of the tags below, or add new tags.</>}
                            </p>
                        ) : (
                            <p>
                                <strong>Tags</strong> can be used to specify an aspect of your silhouette&rsquo;s
                                subject, such as life stage.
                                {existingTags.length > 0 && <> You may use any of the tags below, or add new tags.</>}
                            </p>
                        )}
                    </SpeechStack>
                </Speech>
                {allTags.length && (
                    <UserOptions>
                        {allTags.map(tag => (
                            <UserButton
                                danger={submissionTags.has(tag)}
                                icon={submissionTags.has(tag) ? ICON_X : ICON_PLUS}
                                key={tag}
                                onClick={() => toggleTag(tag)}
                            >
                                {tag}
                            </UserButton>
                        ))}
                    </UserOptions>
                )}
                <UserOptions>
                    <UserTextForm
                        editable
                        onSubmit={value => addNewTag(value)}
                        value={newTag}
                        prefix="I want to add a new tag:"
                    >
                        {(value, setValue) => (
                            <UserInput list="tag-list" maxLength={32} onChange={setValue} value={value} />
                        )}
                    </UserTextForm>
                </UserOptions>
                <UserOptions>
                    <UserLinkButton icon={ICON_CHECK} href={`/edit/${encodeURIComponent(hash)}`}>
                        I&rsquo;m done.
                    </UserLinkButton>
                </UserOptions>
            </Dialogue>
        </>
    )
}
export default Tags
