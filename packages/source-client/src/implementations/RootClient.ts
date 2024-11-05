import { Node } from "@phylopic/source-models"
import { UUID } from "@phylopic/utils"
import { Patchable } from "../interfaces"
import { PGClientProvider } from "../interfaces/PGClientProvider"
import { NodeClient } from "./NodeClient"
export class RootClient implements Patchable<Node & { uuid: UUID }> {
    constructor(protected provider: PGClientProvider) {}
    async patch(value: Partial<Node & { uuid: string }>): Promise<void> {
        return (await this.getNodeClient()).patch(value)
    }
    async put(value: Node & { uuid: string }): Promise<void> {
        return (await this.getNodeClient()).put(value)
    }
    async delete(): Promise<void> {
        return (await this.getNodeClient()).delete()
    }
    async get(): Promise<Node & { uuid: string }> {
        return (await this.getNodeClient()).get()
    }
    async exists(): Promise<boolean> {
        return (await this.getNodeClient()).exists()
    }
    private nodeClient: NodeClient | null = null
    protected getNodeClient = async () => {
        if (!this.nodeClient) {
            const client = await this.provider.getPG()
            const output = await client.query<{ uuid: UUID }>(
                `SELECT "uuid" FROM node WHERE parent_uuid IS NULL AND disabled=0::bit`,
            )
            if (output.rowCount !== 1) {
                throw new Error("Cannot find root node.")
            }
            return (this.nodeClient = new NodeClient(this.provider, output.rows[0].uuid))
        }
        return this.nodeClient
    }
}
