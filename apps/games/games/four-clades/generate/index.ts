import { getBuild } from "~/lib/api"
import { generate } from "./generate"
export * from "./generate"
export default async () => {
    return await generate(await getBuild(), 6, 4, 4)
}
