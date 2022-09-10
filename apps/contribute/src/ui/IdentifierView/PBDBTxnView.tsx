import { INCOMPLETE_STRING } from "@phylopic/source-models"
import { fetchJSON } from "@phylopic/ui"
import { parseNomen } from "parse-nomen"
import { FC, useMemo } from "react"
import useSWRImmutable from "swr/immutable"
import NameView from "../NameView"
export type Props = {
    oid: number
}
const PBDBTxnView: FC<Props> = ({ oid }) => {
    const { data } = useSWRImmutable<{ records: [{ nam: string }] }>(
        `https://training.paleobiodb.org/data1.2/taxa/single.json?id=txn:${encodeURIComponent(oid)}`,
        fetchJSON,
    )
    const name = useMemo(
        () => (data?.records?.[0]?.nam ? parseNomen(data.records[0].nam) : null),
        [data?.records?.[0]?.nam],
    )
    if (!name) {
        return <>{INCOMPLETE_STRING}</>
    }
    return <NameView value={name} />
}
export default PBDBTxnView
