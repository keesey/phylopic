import { Image } from "@phylopic/source-models"
import { fetchJSON } from "@phylopic/ui"
import { Tag, UUID, normalizeTag } from "@phylopic/utils"
import Link from "next/link"
import { FC, useCallback, useState } from "react"
import useSWR from "swr"
import useModifiedPatcher from "~/swr/useModifiedPatcher"
import BubbleItem from "~/ui/BubbleItem"
import BubbleList from "~/ui/BubbleList"
export type Props = {
    uuid: UUID
}
const TagsEditor: FC<Props> = ({ uuid }) => {
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
                if (tag) {
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
                    <input type="text" value={newTag} onChange={event => setNewTag(event.currentTarget.value)} />
                </form>
            </BubbleList>
        </section>
    )
}
export default TagsEditor
