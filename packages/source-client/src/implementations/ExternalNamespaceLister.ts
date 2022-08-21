import { Authority, Namespace } from "@phylopic/utils"
import { Listable } from "../interfaces/Listable"
import { Page } from "../interfaces/Page"
import { PGClientProvider } from "../interfaces/PGClientProvider"
import EXTERNAL_TABLE from "./pg/constants/EXTERNAL_TABLE"
export default class ExternalNamespaceLister implements Listable<Namespace, number> {
    constructor(
        protected readonly provider: PGClientProvider,
        protected readonly pageSize: number,
        protected readonly authority: Authority,
    ) {}
    async page(index = 0): Promise<Page<string, number>> {
        const client = await this.provider.getPG()
        const output = await client.query<{ namespace: Namespace }>(
            `SELECT "namespace" FROM ${EXTERNAL_TABLE} WHERE authority=$1::character varying GROUP BY authority,"namespace" ORDER BY authority,"namespace" OFFSET $2::bigint LIMIT $3::bigint`,
            [this.authority, index * this.pageSize, this.pageSize],
        )
        return {
            items: output.rows.map(({ namespace }) => namespace),
            next: output.rows.length < this.pageSize ? undefined : index + 1,
        }
    }
    public async totalItems() {
        const client = await this.provider.getPG()
        const output = await client.query<{ total: number }>(
            `SELECT COUNT("namespace") AS total FROM ${EXTERNAL_TABLE} WHERE authority=$1::character varying GROUP BY authority,"namespace"`,
            [this.authority],
        )
        return output.rows?.[0]?.total ?? 0
    }
    public async totalPages() {
        return Math.ceil((await this.totalItems()) / this.pageSize)
    }
}
