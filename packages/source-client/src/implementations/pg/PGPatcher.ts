import { Patchable } from "../../interfaces/Patchable"
import { PGClientProvider } from "../../interfaces/PGClientProvider"
import { EditField } from "./fields/EditField"
import { IDField } from "./fields/IDField"
import PGEditor from "./PGEditor"
import prepareValue from "./preparation/prepareValue"
export default class PGPatcher<T> extends PGEditor<T> implements Patchable<T> {
    constructor(
        provider: PGClientProvider,
        table: string,
        identifiers: readonly IDField[],
        fields: readonly EditField<T>[],
        normalize?: (value: T) => T,
    ) {
        super(provider, table, identifiers, fields, normalize)
    }
    public async patch(value: Partial<T>) {
        const keys = Object.keys(value)
        if (keys.length >= 1) {
            const client = await this.provider.getPG()
            await client.query(
                `UPDATE ${this.table} SET ${this.patchUpdates(keys)} WHERE ${this.identification()} LIMIT 1`,
                [this.identificationValues(), ...this.patchValues(value)],
            )
        }
    }
    protected patchUpdates(keys: readonly string[]) {
        return this.fields
            .filter(field => field.updateable && keys.includes(field.property))
            .map((field, index) => `${field.column}=$${index + this.identifiers.length + 1}::${field.type}`)
            .join(",")
    }
    protected patchValues(value: Partial<T>) {
        const keys = Object.keys(value)
        return this.fields
            .filter(field => field.updateable && keys.includes(field.property))
            .map(field => prepareValue(value[field.property]))
    }
}
