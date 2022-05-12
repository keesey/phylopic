import { useRouter } from "next/dist/client/router"
import { ISOTimestamp, Nomen, UUID } from "@phylopic/utils"
import React, { useCallback, useContext, useState, FC } from "react"
import { v4 } from "uuid"
import Context from "~/contexts/NodeEditorContainer/Context"
import NodeSplitEditorContainer from "~/contexts/NodeSplitEditorContainer"
import Modal from "~/ui/Modal"
import NameView from "~/views/NameView"
import NodeSplitEditor from "../NodeSplitEditor"
import Controls from "./Controls"
import NamesEditor from "./NamesEditor"

const NodeEditor: FC = () => {
    const [state] = useContext(Context) ?? []
    const [splitName, setSplitName] = useState<Nomen | undefined>()
    const [now, setNow] = useState<ISOTimestamp>(() => new Date().toISOString())
    const [splitRelationship, setSplitRelationship] = useState<"child" | "parent" | "sibling">("sibling")
    const [splitUUID, setSplitUUID] = useState<UUID>("00000000-0000-0000-0000-000000000000")
    const router = useRouter()
    const handleNodeSplitEditorComplete = useCallback(
        (uuid?: UUID) => {
            setSplitName(undefined)
            if (uuid) {
                if (uuid === state?.uuid) {
                    router.reload()
                } else {
                    router.push(`/nodes/${uuid}`)
                }
            }
        },
        [router, state?.uuid],
    )
    if (!state?.uuid) {
        return null
    }
    return (
        <section>
            <dl>
                <dt>Parent</dt>
                <dd>{state.modified.parentName ? <NameView name={state.modified.parentName} /> : "N/A"}</dd>
                <dt>Names</dt>
                <dd>
                    <NamesEditor
                        onSplit={name => {
                            setNow(new Date().toISOString())
                            setSplitUUID(v4())
                            setSplitName(name)
                        }}
                    />
                </dd>
            </dl>
            <Controls />
            {splitName && (
                <Modal title="Split Node" onClose={() => setSplitName(undefined)}>
                    <dl>
                        <dt>Relationship of Existing Node to New Node</dt>
                        <dd>
                            <select
                                value={splitRelationship}
                                onChange={event =>
                                    setSplitRelationship(event.currentTarget.value as "child" | "parent" | "sibling")
                                }
                            >
                                <option value="sibling">Sibling</option>
                                <option value="parent">Parent</option>
                                <option value="child">Child</option>
                            </select>
                        </dd>
                    </dl>
                    <NodeSplitEditorContainer
                        created={now}
                        newCanonicalName={splitName}
                        newUUID={splitUUID}
                        node={state.modified.node}
                        parentName={state.modified.parentName}
                        relationship={splitRelationship}
                        uuid={state.uuid}
                    >
                        <NodeSplitEditor onComplete={handleNodeSplitEditorComplete} />
                    </NodeSplitEditorContainer>
                </Modal>
            )}
        </section>
    )
}
export default NodeEditor
