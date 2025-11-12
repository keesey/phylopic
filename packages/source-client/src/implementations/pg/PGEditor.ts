import { Editable } from "../../interfaces/Editable"
import { PGClientProvider } from "../../interfaces/PGClientProvider"
import { EditField } from "./fields/EditField"
import { IDField } from "./fields/IDField"
import { PGReader } from "./PGReader"
import { prepareValue } from "./preparation/prepareValue"
export class PGEditor<T> extends PGReader<T> implements Editable<T> {
    constructor(
        provider: PGClientProvider,
        table: string,
        identifiers: readonly IDField[],
        protected fields: readonly EditField<T>[],
        normalize?: (value: T) => T,
    ) {
        super(provider, table, identifiers, fields, normalize)
    }
    public async delete() {
        const client = await this.provider.getPG()
        await client.query(
            `UPDATE ${this.table} SET disabled=1::bit WHERE ${this.identification()}`,
            this.identificationValues(),
        )
    }
    public async isRestorable(): Promise<boolean> {
        const client = await this.provider.getPG()
        const output = await client.query(
            `SELECT ${this.identificationColumns()} FROM ${this.table} WHERE ${this.identification()}`,
            this.identificationValues(),
        )
        return (output.rowCount ?? 0) >= 1
    }
    public async put(value: T) {
        const client = await this.provider.getPG()
        if (await this.exists()) {
            await client.query(
                `UPDATE ${this.table} SET ${this.updates()} WHERE ${this.identification()} AND disabled=0::bit`,
                [...this.identificationValues(), ...this.updateValues(value)],
            )
        } else if (await this.isRestorable()) {
            await client.query(
                `UPDATE ${this.table} SET ${this.updates()},disabled=0::bit WHERE ${this.identification()}`,
                [...this.identificationValues(), ...this.updateValues(value)],
            )
        } else {
            await client.query(
                `INSERT INTO ${
                    this.table
                } (${this.insertColumns()},disabled) VALUES (${this.insertValuesInQuery()},0::bit)`,
                this.insertValues(value),
            )
        }
    }
    public async restore() {
        if (await this.isRestorable()) {
            const client = await this.provider.getPG()
            await client.query(
                `UPDATE ${this.table} SET disabled=0::bit WHERE ${this.identification()}`,
                this.identificationValues(),
            )
            return this.get()
        }
        throw new Error("Cannot restore.")
    }
    protected insertColumns() {
        return this.fields
            .filter(field => field.insertable)
            .map(field => field.column)
            .join(",")
    }
    protected insertValuesInQuery() {
        return this.fields
            .filter(field => field.insertable)
            .map((field, index) => `$${index + 1}::${field.type}`)
            .join(",")
    }
    protected insertValues(value: T) {
        return this.fields
            .filter(field => field.insertable)
            .map(field => prepareValue(value[field.property], field.type))
    }
    protected updates() {
        return this.fields
            .filter(field => field.updateable)
            .map((field, index) => `${field.column}=$${index + this.identifiers.length + 1}::${field.type}`)
            .join(",")
    }
    protected updateValues(value: T) {
        return this.fields
            .filter(field => field.updateable)
            .map(field => prepareValue(value[field.property], field.type))
    }
}
