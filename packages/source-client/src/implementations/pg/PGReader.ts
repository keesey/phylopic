import { QueryResultRow } from "pg"
import { PGClientProvider } from "../../interfaces/PGClientProvider"
import { Readable } from "../../interfaces/Readable"
import { getFields } from "./fields/getFields"
import { IDField } from "./fields/IDField"
import { ReadField } from "./fields/ReadField"
export class PGReader<T> implements Readable<T> {
    constructor(
        protected provider: PGClientProvider,
        protected table: string,
        protected identifiers: readonly IDField[],
        protected fields: ReadonlyArray<(string & keyof T) | ReadField<T>>,
        protected normalize?: (value: T) => T,
    ) {}
    public async get() {
        const client = await this.provider.getPG()
        const output = await client.query<T & QueryResultRow>(
            `SELECT ${this.getFields()} FROM ${this.table} WHERE ${this.identification()} AND disabled=0::bit`,
            this.identificationValues(),
        )
        if (!output.rowCount) {
            throw new Error("Entity not found.")
        }
        if (output.rowCount > 1) {
            throw new Error("Multiple entities found.")
        }
        return this.normalize ? this.normalize(output.rows[0]) : output.rows[0]
    }
    public async exists(): Promise<boolean> {
        const client = await this.provider.getPG()
        const output = await client.query(
            `SELECT ${this.identificationColumns()} FROM ${
                this.table
            } WHERE ${this.identification()} AND disabled=0::bit`,
            this.identificationValues(),
        )
        return (output.rowCount ?? 0) >= 1
    }
    protected identification() {
        return this.identifiers.map((field, index) => `${field.column}=$${index + 1}::${field.type}`).join(" AND ")
    }
    protected identificationColumns() {
        return this.identifiers.map(field => field.column).join(",")
    }
    protected identificationValues() {
        return this.identifiers.map(field => field.value)
    }
    protected getFields() {
        return getFields(this.fields)
    }
}
