import { Tags } from "@phylopic/api-models"
import { Image } from "@phylopic/source-models"
import { fetchJSON } from "@phylopic/ui"
import { Tag, UUID, isTag, normalizeTag } from "@phylopic/utils"
import { useAPIFetcher, useAPISWRKey } from "@phylopic/utils-api"
import Link from "next/link"
import { FC, useCallback, useState } from "react"
import useSWR from "swr"
import useSWRImmutable from "swr/immutable"
import useModifiedPatcher from "~/swr/useModifiedPatcher"
import BubbleItem from "~/ui/BubbleItem"
import BubbleList from "~/ui/BubbleList"
export type Props = {
    uuid: UUID
}
const TagsEditor: FC<Props> = ({ uuid }) => {
    const imageTagsKey = useAPISWRKey(`${process.env.NEXT_PUBLIC_API_URL}/imagetags`)
    const imageTagsFetcher = useAPIFetcher<Tags>()
    const imageTagsSWR = useSWRImmutable<Tags>(imageTagsKey, imageTagsFetcher)
    const [newTag, setNewTag] = useState("")
    const key = `/api/images/_/${encodeURIComponent(uuid)}`
    const response = useSWR<Image & { uuid: UUID }>(key, fetchJSON)
    const patcher = useModifiedPatcher(key, response)
    const { data } = response
    const { tags } = data ?? {}
    const addTag = useCallback(
        (tag: Tag | null) => {
            if (tag) {
                tag = normalizeTag(tag)
                if (isTag(tag)) {
                    const newTags = new Set(tags)
                    if (!newTags.has(tag)) {
                        newTags.add(tag)
                        patcher({ tags: Array.from(newTags).sort() })
                        setNewTag("")
                    }
                }
            }
        },
        [patcher, tags],
    )
    const removeTag = useCallback(
        (tag: Tag) => {
            const newTags = new Set(tags)
            if (newTags.has(tag)) {
                newTags.delete(tag)
                patcher({ tags: Array.from(newTags).sort() })
            }
        },
        [patcher, tags],
    )
    if (!data) {
        return null
    }
    return (
        <section>
            <BubbleList>
                {data.tags?.map(tag => (
                    <BubbleItem key={tag}>
                        <Link href={`/tags/${encodeURIComponent(tag)}`}>{tag}</Link>
                        <button onClick={() => removeTag(tag)} title="Remove Tag">
                            ✗
                        </button>
                    </BubbleItem>
                ))}
                <form
                    onSubmit={event => {
                        event.preventDefault()
                        addTag(newTag)
                    }}
                >
                    <input
                        type="text"
                        list="tag-list"
                        value={newTag}
                        onChange={event => setNewTag(event.currentTarget.value)}
                    />
                </form>
                <datalist id="tag-list">
                    {imageTagsSWR.data?.tags.map(tag => (
                        <option key={tag} value={tag} />
                    ))}
                </datalist>
            </BubbleList>
        </section>
    )
}
export default TagsEditor
