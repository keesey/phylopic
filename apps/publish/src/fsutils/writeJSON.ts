import writeBuffer from "./writeBuffer"
const writeJSON = async (filePath: string, o: unknown) => {
    await writeBuffer(filePath, Buffer.from(JSON.stringify(o)))
}
export default writeJSON
