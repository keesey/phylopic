import type { ClientBase } from "pg"
import { Listable } from "../../interfaces/Listable"
import getFields from "./fields/getFields"
import { IDField } from "./fields/IDField"
import { ReadField } from "./fields/ReadField"
export default class PGLister<TValue, TIdentifier> implements Listable<TValue & Readonly<TIdentifier>, number> {
    constructor(
        protected getClient: () => Promise<ClientBase>,
        protected table: string,
        protected pageSize: number,
        protected fields: ReadonlyArray<(string & keyof TValue & TIdentifier) | ReadField<TValue & TIdentifier>>,
        protected normalize?: (value: TValue & TIdentifier) => TValue & TIdentifier,
        protected order: string = '"uuid"',
        protected where?: readonly IDField[],
    ) {}
    public async page(index = 0) {
        const client = await this.getClient()
        const output = await client.query<TValue & TIdentifier>(
            `SELECT ${getFields(this.fields)} FROM ${
                this.table
            } OFFSET $2::bigint LIMIT $1::bigint${this.whereClause()} ORDER BY ${this.order}`,
            [index * this.pageSize, this.pageSize, ...this.whereValues()],
        )
        return {
            items: this.normalize ? output.rows.map(this.normalize) : output.rows,
            next: output.rows.length < this.pageSize ? undefined : index + 1,
        }
    }
    public async totalItems() {
        const client = await this.getClient()
        const output = await client.query<{ total: number }>(
            `SELECT COUNT(*) AS total FROM ${this.table}${this.whereClause()}`,
            this.whereValues(),
        )
        return output.rows?.[0]?.total ?? 0
    }
    public async totalPages() {
        return Math.ceil((await this.totalItems()) / this.pageSize)
    }
    protected whereClause() {
        if (!this.where?.length) {
            return ""
        }
        return ` WHERE ${this.where
            .map((identifier, index) => `${identifier.column}=$${index + 3}::${identifier.type}`)
            .join(" AND ")}`
    }
    protected whereValues() {
        if (!this.where?.length) {
            return []
        }
        return this.where.map(identifier => identifier.value)
    }
}
