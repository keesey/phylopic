const getAgeUrl = (ncbiTaxId: string) => "/api/external/timetree.org/id/" + encodeURIComponent(ncbiTaxId) + "/age"
export default getAgeUrl
