import { type Tags as TagsModel } from "@phylopic/api-models"
import { Hash, Tag } from "@phylopic/utils"
import { useAPIFetcher, useAPISWRKey } from "@phylopic/utils-api"
import { FC, useMemo } from "react"
import useSWRImmutable from "swr/immutable"
import useSubmission from "~/editing/useSubmission"
import useSubmissionMutator from "~/editing/useSubmissionMutator"
import Dialogue from "~/ui/Dialogue"
import FileView from "~/ui/FileView"
import { ICON_PLUS, ICON_X } from "~/ui/ICON_SYMBOLS"
import Speech from "~/ui/Speech"
import SpeechStack from "~/ui/SpeechStack"
import UserButton from "~/ui/UserButton"
import UserOptions from "~/ui/UserOptions"
import LoadingState from "../LoadingState"
export type Props = {
    hash: Hash
}
const Tags: FC<Props> = ({ hash }) => {
    const tagKey = useAPISWRKey(`${process.env.NEXT_PUBLIC_API_URL}/imagetags`)
    const fetcher = useAPIFetcher<TagsModel>()
    const tagsResponse = useSWRImmutable(tagKey, fetcher)
    const existingTags = tagsResponse?.data?.tags ?? []
    const submission = useSubmission(hash)
    const submissionTags = useMemo(() => new Set<Tag>(submission?.tags?.split(",")), [submission?.tags])
    const mutate = useSubmissionMutator(hash)
    const toggleTag = (tag: Tag) => {
        const newTags = new Set(submissionTags)
        if (submissionTags.has(tag)) {
            newTags.delete(tag)
        } else {
            newTags.add(tag)
        }
        mutate({ tags: Array.from(newTags).sort().join(",") })
    }
    if (!submission) {
        return <LoadingState>One moment&hellip;</LoadingState>
    }
    return (
        <Dialogue>
            {!submission.tags && (
                <>
                    <Speech mode="system">
                        <SpeechStack collapsible>
                            <FileView
                                src={`${process.env.NEXT_PUBLIC_UPLOADS_URL}/files/${encodeURIComponent(hash)}`}
                                mode="light"
                            />
                            <p>
                                <strong>Tags</strong> can be used to specify an aspect of your silhouette&rapos;s
                                subject, such as life stage. You may use any of the tags below, or add new tags.
                            </p>
                        </SpeechStack>
                    </Speech>
                    <UserOptions>
                        {existingTags?.map(tag => (
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
                </>
            )}
        </Dialogue>
    )
}
export default Tags
