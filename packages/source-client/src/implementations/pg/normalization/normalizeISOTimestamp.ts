const normalizeISOTimestamp = (value: string) => new Date(value).toISOString()
export default normalizeISOTimestamp
