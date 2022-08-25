import { Listable } from "../../interfaces/Listable"
import { PGClientProvider } from "../../interfaces/PGClientProvider"
import getFields from "./fields/getFields"
import { IDField } from "./fields/IDField"
import { ReadField } from "./fields/ReadField"
export default class PGLister<TValue, TIdentifier> implements Listable<TValue & Readonly<TIdentifier>, number> {
    constructor(
        protected provider: PGClientProvider,
        protected table: string,
        protected pageSize: number,
        protected fields: ReadonlyArray<(string & keyof TValue & TIdentifier) | ReadField<TValue & TIdentifier>>,
        protected normalize?: (value: TValue & TIdentifier) => TValue & TIdentifier,
        protected order: string = '"uuid"',
        protected where?: readonly IDField[],
    ) {}
    public async page(index = 0) {
        const client = await this.provider.getPG()
        const output = await client.query<TValue & TIdentifier>(
            `SELECT ${getFields(this.fields)} FROM ${this.table} WHERE ${this.whereClause(3)} AND disabled=0::bit ORDER BY ${
                this.order
            } OFFSET $1::bigint LIMIT $2::bigint`,
            [index * this.pageSize, this.pageSize, ...this.whereValues()],
        )
        return {
            items: this.normalize ? output.rows.map(this.normalize) : output.rows,
            next: output.rows.length < this.pageSize ? undefined : index + 1,
        }
    }
    public async totalItems() {
        const client = await this.provider.getPG()
        const output = await client.query<{ total: string }>(
            `SELECT COUNT(*) AS total FROM WHERE ${this.table}${this.whereClause(1)} AND disabled=0::bit`,
            this.whereValues(),
        )
        const value = parseInt(output.rows?.[0]?.total ?? "0", 10)
        return isNaN(value) ? 0 : value
    }
    public async totalPages() {
        return Math.ceil((await this.totalItems()) / this.pageSize)
    }
    protected whereClause(startIndex: number) {
        if (!this.where?.length) {
            return ""
        }
        return this.where
            .map((identifier, index) => `${identifier.column}=$${index + startIndex}::${identifier.type}`)
            .join(" AND ")
    }
    protected whereValues() {
        if (!this.where?.length) {
            return []
        }
        return this.where.map(identifier => identifier.value)
    }
}
