import { Authority, Namespace } from "@phylopic/utils"
import { ClientBase } from "pg"
import { Listable } from "../interfaces/Listable"
import { Page } from "../interfaces/Page"
import EXTERNAL_TABLE from "./pg/constants/EXTERNAL_TABLE"
export default class ExternalNamespaceLister implements Listable<Namespace, number> {
    constructor(protected getClient: () => ClientBase, protected pageSize: number, protected authority: Authority) {}
    async page(index = 0): Promise<Page<string, number>> {
        const output = await this.getClient().query<{ namespace: Namespace }>(
            `SELECT "namespace" FROM ${EXTERNAL_TABLE} WHERE authority=$1::character varying GROUP BY authority,"namespace" ORDER BY "namespace" OFFSET $2::bigint LIMIT $3::bigint`,
            [this.authority, index * this.pageSize, this.pageSize],
        )
        return {
            items: output.rows.map(({ namespace }) => namespace),
            next: output.rows.length < this.pageSize ? undefined : index + 1,
        }
    }
    public async totalItems() {
        const output = await this.getClient().query<{ total: number }>(
            `SELECT COUNT("namespace") AS total FROM ${EXTERNAL_TABLE} WHERE authority=$1::character varying GROUP BY authority,"namespace"`,
            [this.authority],
        )
        return output.rows?.[0]?.total ?? 0
    }
    public async totalPages() {
        return Math.ceil((await this.totalItems()) / this.pageSize)
    }
}
