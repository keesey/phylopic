import { Entity, Node } from "@phylopic/source-models"
import { Nomen } from "@phylopic/utils"
import Link from "next/link"
import React, { FC } from "react"
import NameView from "./NameView"

export interface Props {
    name: Nomen
    parent?: Partial<Entity<Node>>
}
const NameTitleView: FC<Props> = ({ name, parent }) => (
    <span>
        {parent?.uuid && parent?.value && (
            <>
                <Link href={`/nodes/${parent.uuid}`}>
                    {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                    <a>
                        <NameView name={parent.value.names[0]} short />
                    </a>
                </Link>
                {": "}
            </>
        )}
        <NameView name={name} short />
    </span>
)
export default NameTitleView
