export interface DataRequestHeaders extends Readonly<Record<string, string | undefined>> {
    accept?: string
    "if-none-match"?: string
}
