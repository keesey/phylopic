import type { ClientBase } from "pg"
import { Editable } from "../../interfaces/Editable"
import { EditField } from "./fields/EditField"
import { IDField } from "./fields/IDField"
import PGReader from "./PGReader"
export default class PGEditor<T> extends PGReader<T> implements Editable<T> {
    constructor(
        getClient: () => ClientBase,
        table: string,
        identifiers: readonly IDField[],
        protected fields: readonly EditField<T>[],
        normalize?: (value: T) => T,
    ) {
        super(getClient, table, identifiers, fields, normalize)
    }
    public async delete() {
        await this.getClient().query(
            `DELETE FROM ${this.table} WHERE ${this.identification()} LIMIT 1`,
            this.identificationValues(),
        )
    }
    public async put(value: T) {
        if (await this.exists()) {
            await this.getClient().query(
                `UPDATE ${this.table} SET ${this.updates()} WHERE ${this.identification()} LIMIT 1`,
                [...this.identificationValues(), ...this.putValues(value)],
            )
        } else {
            await this.getClient().query(
                `INSERT INTO ${
                    this.table
                } ("uuid",${this.insertFields()}) VALUES (${this.identificationValuesInQuery()},${this.insertValues()})`,
                [...this.identificationValues(), ...this.putValues(value)],
            )
        }
    }
    protected identificationValuesInQuery() {
        return this.identifiers.map((field, index) => `$${index + 1}::${field.type}`).join(",")
    }
    protected insertFields() {
        return this.fields
            .filter(field => field.insertable)
            .map(field => field.column)
            .join(",")
    }
    protected insertValues() {
        return this.fields
            .filter(field => field.insertable)
            .map((field, index) => `$${index + this.identifiers.length + 1}::${field.type}`)
            .join(",")
    }
    protected putValues(value: T) {
        return this.fields.filter(field => field.updateable).map(field => value[field.property])
    }
    protected updates() {
        return this.fields
            .filter(field => field.updateable)
            .map((field, index) => `${field.column}=$${index + this.identifiers.length + 1}::${field.type}`)
            .join(",")
    }
}
