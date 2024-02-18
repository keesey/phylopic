const getAgeUrl = (ncbiTaxIds: readonly string[]) =>
    "/api/external/timetree.org/id/" + encodeURIComponent(ncbiTaxIds.join(" ")) + "/age"
export default getAgeUrl
