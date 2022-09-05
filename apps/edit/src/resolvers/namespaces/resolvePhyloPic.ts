import { Resolver } from "../Resolver"
const resolvePhyloPic: Resolver = async (client, objectID) => {
    return await client.node(objectID).get()
}
export default resolvePhyloPic
