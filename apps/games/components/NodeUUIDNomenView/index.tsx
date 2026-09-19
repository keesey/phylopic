"use client"
import { Node } from "@phylopic/api-models"
import { NomenViewProps } from "@phylopic/ui"
import { UUID } from "@phylopic/utils"
import { fetchJSON } from "@phylopic/utils-api"
import { FC } from "react"
import useSWR from "swr"
import NomenView from "../NomenView"
export type Props = Omit<NomenViewProps, "value"> & {
    uuid: UUID
}
export const NodeUUIDNomenView: FC<Props> = ({ uuid, ...props }) => {
    const { data } = useSWR<Node>(`${process.env.NEXT_PUBLIC_API_URL}/nodes/${encodeURIComponent(uuid)}`, fetchJSON)
    return <NomenView value={data ? data.names[0] : [{ class: "comment", text: "…" }]} {...props} />
}
