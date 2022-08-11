import { UUID } from "@phylopic/utils"
import { ClientBase } from "pg"
import { Readable } from "../../interfaces/Readable"
import getFields from "./fields/getFields"
import { IdentifyingField } from "./fields/IdentifyingField"
import { ReadField } from "./fields/ReadField"
export default class PGReader<T> implements Readable<T> {
    constructor(
        protected getClient: () => ClientBase,
        protected table: string,
        protected identifiers: readonly IdentifyingField[],
        protected fields: ReadonlyArray<(string & keyof T) | ReadField<T>>,
        protected normalize?: (value: T) => T,
    ) {}
    public async get() {
        const output = await this.getClient().query<T>(
            `SELECT ${this.getFields()} FROM ${this.table} WHERE ${this.identification()} LIMIT 1`,
            this.identificationValues(),
        )
        if (output.rowCount !== 1) {
            throw new Error("Entity not found.")
        }
        return this.normalize ? this.normalize(output.rows[0]) : output.rows[0]
    }
    public async exists(): Promise<boolean> {
        const output = await this.getClient().query<{ uuid: UUID }>(
            `SELECT ${this.identificationColumns()} FROM ${this.table} WHERE ${this.identification()} LIMIT 1`,
            this.identificationValues(),
        )
        return output.rowCount === 1
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
