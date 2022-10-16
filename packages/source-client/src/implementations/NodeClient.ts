import { External, Node } from "@phylopic/source-models"
import {
    Authority,
    isUUIDv4,
    Namespace,
    Nomen,
    normalizeNomina,
    normalizeUUID,
    ObjectID,
    stringifyNomen,
    stringifyNormalized,
    UUID,
} from "@phylopic/utils"
import { Listable } from "../interfaces"
import { PGClientProvider } from "../interfaces/PGClientProvider"
import { SourceClient } from "../interfaces/SourceClient"
import ExternalClient from "./ExternalClient"
import NodeExternalsClient from "./NodeExternalsClient"
import NodeLineageClient from "./NodeLineageClient"
import NODE_FIELDS from "./pg/constants/NODE_FIELDS"
import NODE_TABLE from "./pg/constants/NODE_TABLE"
import normalizeNode from "./pg/normalization/normalizeNode"
import PGLister from "./pg/PGLister"
import PGPatcher from "./pg/PGPatcher"
export default class NodeClient extends PGPatcher<Node & { uuid: UUID }> implements ReturnType<SourceClient["node"]> {
    constructor(protected provider: PGClientProvider, protected uuid: UUID) {
        if (!isUUIDv4(uuid)) {
            throw new Error("Invalid UUID.")
        }
        super(provider, NODE_TABLE, [{ column: "uuid", type: "uuid", value: uuid }], NODE_FIELDS, normalizeNode)
        this.externals = new NodeExternalsClient(provider, uuid)
        this.children = new PGLister<Node & { uuid: UUID }, number>(
            this.provider,
            NODE_TABLE,
            64,
            NODE_FIELDS,
            normalizeNode,
            "uuid",
            [{ column: "parent_uuid", type: "uuid", value: uuid }],
        )
        this.lineage = new NodeLineageClient(provider, uuid)
    }
    async absorb(suppressedUUID: UUID) {
        if (!isUUIDv4(suppressedUUID)) {
            throw new Error("Not a valid UUID.")
        }
        suppressedUUID = normalizeUUID(suppressedUUID)
        if (this.uuid !== suppressedUUID) {
            const suppressedClient = new NodeClient(this.provider, suppressedUUID)
            const [conserved, suppressed] = await Promise.all([this.get(), suppressedClient.get()])
            const pgClient = await this.provider.getPG()
            await Promise.all([
                pgClient.query(
                    "UPDATE image SET specific_uuid=$1::uuid, modified=NOW() WHERE specific_uuid=$2::uuid AND disabled=0::bit",
                    [this.uuid, suppressedUUID],
                ),
                pgClient.query(
                    "UPDATE image SET general_uuid=$1::uuid, modified=NOW() WHERE general_uuid=$2::uuid AND disabled=0::bit",
                    [this.uuid, suppressedUUID],
                ),
                pgClient.query("UPDATE external SET node_uuid=$1::uuid WHERE node_uuid=$2::uuid AND disabled=0::bit", [
                    this.uuid,
                    suppressedUUID,
                ]),
                pgClient.query(
                    "UPDATE node SET parent_uuid=$1::uuid, modified=NOW() WHERE parent_uuid=$2::uuid AND disabled=0::bit",
                    [this.uuid, suppressedUUID],
                ),
            ])
            await Promise.all([
                this.patch({
                    modified: new Date().toISOString(),
                    names: normalizeNomina([...conserved.names, ...suppressed.names]),
                    ...(conserved.parent === suppressed.uuid ? { parent: suppressed.parent } : null),
                }),
                new ExternalClient(this.provider, "phylopic.org", "nodes", suppressedUUID).put({
                    authority: "phylopic.org",
                    namespace: "nodes",
                    node: this.uuid,
                    objectID: suppressedUUID,
                    title: stringifyNomen(suppressed.names[0]),
                }),
                suppressedClient.delete(),
            ])
        }
    }
    readonly children: Listable<Node & { uuid: UUID }, number>
    readonly externals: Listable<
        External & { authority: Authority; namespace: Namespace; objectID: ObjectID },
        number
    > & {
        namespace: (
            authority: Authority,
            namespace: Namespace,
        ) => Listable<External & { authority: Authority; namespace: Namespace; objectID: ObjectID }, number>
    }
    readonly lineage: Listable<Node & { uuid: UUID }, number>
    async split(
        newUUID: UUID,
        newNames: readonly Nomen[],
        newExternals: readonly Readonly<{ authority: string; namespace: string; objectID: string }>[],
    ): Promise<void> {
        if (!isUUIDv4(newUUID)) {
            throw new Error("Not a valid UUID.")
        }
        if (newNames.length === 0) {
            throw new Error("Can't split without at least one name for the new node.")
        }
        newUUID = normalizeUUID(newUUID)
        if (this.uuid !== newUUID) {
            const oldNode = await this.get()
            const newNamesJSON = newNames.map(name => stringifyNormalized(name))
            const oldNames = oldNode.names.filter(oldName => {
                const oldNameJSON = stringifyNormalized(oldName)
                return newNamesJSON.every(newNameJSON => newNameJSON !== oldNameJSON)
            })
            if (oldNames.length === 0) {
                throw new Error("Can't split without leaving at least one name for the original node.")
            }
            const newNodeClient = new NodeClient(this.provider, newUUID)
            const now = new Date().toISOString()
            await newNodeClient.put({
                created: now,
                modified: now,
                names: normalizeNomina(newNames),
                parent: oldNode.parent,
                uuid: newUUID,
            })
            await this.patch({
                modified: now,
                names: normalizeNomina(oldNames),
            })
            await Promise.all(
                newExternals.map(external =>
                    new ExternalClient(this.provider, external.authority, external.namespace, external.objectID).patch({
                        node: newUUID,
                    }),
                ),
            )
        }
    }
}
