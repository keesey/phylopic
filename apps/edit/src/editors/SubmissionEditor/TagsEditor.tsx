import { Tags } from "@phylopic/api-models"
import { Submission } from "@phylopic/source-models"
import { fetchJSON } from "@phylopic/ui"
import { Hash, Tag, isTag, normalizeTag } from "@phylopic/utils"
import { useAPIFetcher, useAPISWRKey } from "@phylopic/utils-api"
import Link from "next/link"
import { FC, useCallback, useMemo, useState } from "react"
import useSWR from "swr"
import useSWRImmutable from "swr/immutable"
import usePatcher from "~/swr/usePatcher"
import BubbleItem from "~/ui/BubbleItem"
import BubbleList from "~/ui/BubbleList"
export type Props = {
    hash: Hash
}
const TagsEditor: FC<Props> = ({ hash }) => {
    const [newTag, setNewTag] = useState("")
    const imageTagsKey = useAPISWRKey(`${process.env.NEXT_PUBLIC_API_URL}/imagetags`)
    const imageTagsFetcher = useAPIFetcher<Tags>()
    const imageTagsSWR = useSWRImmutable<Tags>(imageTagsKey, imageTagsFetcher)
    const key = `/api/submissions/_/${encodeURIComponent(hash)}`
    const response = useSWR<Submission & { hash: Hash }>(key, fetchJSON)
    const patcher = usePatcher(key, response)
    const { data } = response
    const tags = useMemo(
        () =>
            data?.tags
                ?.split(",")
                .filter(tag => isTag(tag))
                .sort() ?? [],
        [data?.tags],
    )
    const addTag = useCallback(
        (tag: Tag | null) => {
            if (tag) {
                tag = normalizeTag(tag)
                if (isTag(tag)) {
                    const newTags = new Set(tags)
                    if (!newTags.has(tag)) {
                        newTags.add(tag)
                        patcher({ tags: Array.from(newTags).sort().join(",") })
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
                patcher({ tags: Array.from(newTags).sort().join(",") })
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
                {tags.map(tag => (
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
                    {imageTagsSWR.data?.tags.map(tag => <option key={tag} value={tag} />)}
                </datalist>
            </BubbleList>
        </section>
    )
}
export default TagsEditor
