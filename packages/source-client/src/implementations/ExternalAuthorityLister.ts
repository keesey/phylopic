import { Authority } from "@phylopic/utils"
import { Listable } from "../interfaces/Listable"
import { Page } from "../interfaces/Page"
import { PGClientProvider } from "../interfaces/PGClientProvider"
import EXTERNAL_TABLE from "./pg/constants/EXTERNAL_TABLE"
export default class ExternalAuthorityLister implements Listable<Authority, number> {
    constructor(protected readonly provider: PGClientProvider, protected readonly pageSize: number) {}
    async page(index = 0): Promise<Page<string, number>> {
        const client = await this.provider.getPG()
        const output = await client.query<{ authority: Authority }>(
            `SELECT authority FROM ${EXTERNAL_TABLE} WHERE disabled=0::bit GROUP BY authority ORDER BY authority OFFSET $1::bigint LIMIT $2::bigint`,
            [index * this.pageSize, this.pageSize],
        )
        return {
            items: output.rows.map(({ authority }) => authority),
            next: output.rows.length < this.pageSize ? undefined : index + 1,
        }
    }
    public async totalItems() {
        const client = await this.provider.getPG()
        const output = await client.query<{ total: number }>(
            `SELECT COUNT(authority) AS total FROM ${EXTERNAL_TABLE} WHERE disabled=0::bit GROUP BY authority`,
        )
        return output.rows?.[0]?.total ?? 0
    }
    public async totalPages() {
        return Math.ceil((await this.totalItems()) / this.pageSize)
    }
}
