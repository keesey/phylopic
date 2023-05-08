import { CSV } from "./CSV"
import axios from "axios"
const parseLine = (line: string) => line.split(",").map(value => value.trim())
const fetchCsv = async <THeader extends string = string>(url: string): Promise<CSV<THeader>> => {
    const response = await axios.get<string>(url)
    if (!response.data) {
        return { columns: [], items: [] }
    }
    const lines = response.data
        .split("\n")
        .map(line => parseLine(line))
        .filter(line => line.length > 0)
    if (!lines.length) {
        return { columns: [], items: [] }
    }
    const columns = lines[0] as unknown as readonly THeader[]
    const items = lines
        .slice(1)
        .map(
            line =>
                line.reduce<Partial<Record<THeader, string>>>(
                    (prev, value, index) => ({ ...prev, [columns[index]]: value }),
                    {},
                ) as Record<THeader, string>,
        )
    return { columns, items }
}
export default fetchCsv
