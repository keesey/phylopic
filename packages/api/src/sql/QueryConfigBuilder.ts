import { QueryConfig } from "pg"
export class QueryConfigBuilder {
    private clauses: string[] = []
    private values: unknown[] = []
    constructor(clause?: string, values?: readonly unknown[]) {
        if (clause) {
            this.add(clause, values)
        }
    }
    public add(builder: QueryConfigBuilder): void
    public add(clause: string, values?: readonly unknown[]): void
    public add(clauseOrBuilder: QueryConfigBuilder | string, values?: readonly unknown[]) {
        if (typeof clauseOrBuilder === "string") {
            const numValues = values?.length ?? 0
            const match = clauseOrBuilder.match(/\$/g)
            if ((match?.length ?? 0) !== numValues) {
                throw new Error("Value mismatch in query construction.")
            }
            this.clauses.push(clauseOrBuilder)
            if (values?.length) {
                this.values.push(...values)
            }
        } else {
            this.clauses.push(...clauseOrBuilder.clauses)
            this.values.push(...clauseOrBuilder.values)
        }
    }
    public build(): QueryConfig {
        let nextIndex = 1
        const text = this.clauses
            .map(clause =>
                clause
                    .split(/\$/g)
                    .map((part, index) => (index ? `$${nextIndex++}${part}` : part))
                    .join(""),
            )
            .join(" ")
        const values = [...this.values]
        console.debug("[QUERY]", text, values)
        return { text, values }
    }
}
export default QueryConfigBuilder
