import { BuildContext } from "@phylopic/utils-api"
import type { NextPage } from "next"
import { NextSeo } from "next-seo"
import { FC, useContext } from "react"
import PageLayout from "~/pages/PageLayout"
import Breadcrumbs from "~/ui/Breadcrumbs"
import CurlBox from "~/ui/CurlBox"
import SiteTitle from "~/ui/SiteTitle"
const PageComponent: NextPage = () => (
    <PageLayout>
        <NextSeo
            canonical={`${process.env.NEXT_PUBLIC_WWW_URL}/api-recipes`}
            description="A gentle introduction for software engineers to the PhyloPic Application Programming Interface (API). Examples including searching for silhouette images of biological taxa."
            title="Code Recipes for the PhyloPic API"
        />
        <header>
            <Breadcrumbs items={[{ children: "Home", href: "/" }, { children: <strong>API Recipes</strong> }]} />
            <h1>
                <abbr title="Application Programming Interface">API</abbr> Recipes
            </h1>
        </header>
        <Article />
    </PageLayout>
)
const Article: FC = () => {
    const [build] = useContext(BuildContext) ?? [""]
    return (
        <article>
            <section id="introduction">
                <p>
                    The <SiteTitle /> <abbr title="Application Programming Interface">API</abbr> is thoroughly
                    documented at the <a href="http://api-docs.phylopic.org">API Documentation Website</a>. As an
                    alternative or introduction, this page offers a simpler but non-comprehensive guide to using the{" "}
                    <abbr title="Application Programming Interface">API</abbr>, with some examples of commonly-needed
                    functionality, like listing image files and searching for taxa. As well, it documents how{" "}
                    <SiteTitle /> uses external resources to augment searching capabilities.
                </p>
                <p>
                    This page is intended for readers who are familiar with:
                    <ul style={{ listStyleType: "disc", marginInlineStart: "1em" }}>
                        <li>using a command prompt (UNIX, etc.)</li>
                        <li>basic World Wide Web terms (URL, HTTP, POST, GET, etc.)</li>
                        <li>JSON data format</li>
                    </ul>
                </p>
                <p>
                    Examples are given as{" "}
                    <a href="//curl.se/" rel="noreferrer">
                        curl
                    </a>{" "}
                    statements which may be run in a command prompt. Or, click the &ldquo;play&ldquo; icon to run
                    queries and see results in your browser. As an example, this call loads the index for the{" "}
                    <a href="//en.wikipedia.org/wiki/Representational_state_transfer" rel="noreferrer">
                        RESTful
                    </a>{" "}
                    <abbr title="Application Programming Interface">API</abbr>.
                </p>
                <CurlBox url={`${process.env.NEXT_PUBLIC_API_URL}`} options={{ location: true }} />
                <p>
                    Loading this endpoint returns{" "}
                    <a href="//www.json.org/" rel="noreferrer">
                        JSON
                    </a>{" "}
                    data detailing other resource endpoints and general metadata about the site.
                </p>
                <p>
                    For compatibility with future versions of the API, it is <em>strongly recommended</em> that you
                    include the <strong>major API version</strong> in the HTTP headers thusly:
                </p>
                <CurlBox
                    url={`${process.env.NEXT_PUBLIC_API_URL}`}
                    options={{ headers: { "Content-Type": "application/vnd.phylopic.v2+json" }, location: true }}
                />
                <p>
                    This is not a strict requirement, and for brevity the ensuing examples will forgo it (except for
                    POST calls).
                </p>
            </section>
            <section id="builds">
                <h2>Builds</h2>
                <p>
                    You may notice that the response includes properties called <code>"build"</code> and{" "}
                    <code>"buildTimestamp"</code>. Updates to <SiteTitle /> are published in discrete{" "}
                    <strong>builds</strong> in order to improve caching. In order to return data, each API call must
                    including a build number in the query string. If a build number is not including, a{" "}
                    <code>307 Temporary Redirect</code> response is returned indicating a modified URL (
                    <code>Location</code> header) with the current build number added in the query string. (This is why
                    the command above includes the <code style={{ whiteSpace: "pre" }}>--location</code> option.) The
                    response to that URL will always include a<code>"build"</code> property with the current build
                    number.
                </p>
                <p>
                    {" "}
                    To skip the redirect, simply place the current <code>build</code> in the query string:
                </p>
                <CurlBox url={`${process.env.NEXT_PUBLIC_API_URL}?build=${build}`} />
                <p>
                    URLs that specify a build other than the current build will result in a <code>410 Gone</code>,{" "}
                    <code>404 Not Found</code>, or <code>400 Invalid Request</code> error response.
                </p>
            </section>
            <section id="entities">
                <h2>Entities</h2>
                <p>
                    There are three major type of entity in <SiteTitle />
                    &rsquo;s database: <strong>images</strong>, <strong>nodes</strong>, and{" "}
                    <strong>contributors</strong>. Each individual entity is identified by a{" "}
                    <a href="//wikipedia.org/wiki/Universally_unique_identifier" rel="noreferrer">
                        <abbr title="Universsaluy Unique Identifier">UUID</abbr>
                    </a>
                    , which can be included in the <abbr title="Uniform Resource Locator">URL</abbr> to retrieve data
                    about it. Examples:
                </p>
                <CurlBox
                    url={`${process.env.NEXT_PUBLIC_API_URL}/images/045279d5-24e5-4838-bec9-0bea86812e35`}
                    options={{ location: true }}
                />
                <br />
                <CurlBox
                    url={`${process.env.NEXT_PUBLIC_API_URL}/nodes/8f901db5-84c1-4dc0-93ba-2300eeddf4ab`}
                    options={{ location: true }}
                />
                <br />
                <CurlBox
                    url={`${process.env.NEXT_PUBLIC_API_URL}/contributors/060f03a9-fafd-4d08-81d1-b8f82080573f`}
                    options={{ location: true }}
                />
                <p>
                    Each entity may includes links to other individual entities, in the <code>_links</code> object. For
                    example, nodes include a link to <code>parentNode</code> (except for the root node) and{" "}
                    <code>primaryImage</code>. Images include a link to their <code>contributor</code>,{" "}
                    <code>specificNode</code>, and sometimes a <code>generalNode</code>, as well as a list of{" "}
                    <code>nodes</code>a lineage including <code>specificNode</code> and <code>generalNode</code>.
                </p>
                <p>These linked entities may be embedded in the response directly using certain query parameters.</p>
                <CurlBox
                    url={`${process.env.NEXT_PUBLIC_API_URL}/images/045279d5-24e5-4838-bec9-0bea86812e35?embed_generalNode=true&embed_nodes=true&embed_specificNode=true`}
                    options={{ location: true }}
                />
                <br />
                <CurlBox
                    url={`${process.env.NEXT_PUBLIC_API_URL}/nodes/8f901db5-84c1-4dc0-93ba-2300eeddf4ab?embed_parentNode=true&embed_primaryImage=true`}
                    options={{ location: true }}
                />
            </section>
            <section id="lists">
                <h2>Lists</h2>
                <p>
                    The API uses the same structure for lists of any type of entity. First, a call must be made to a
                    list endpoint to get metadata about the list.
                </p>
                <CurlBox url={`${process.env.NEXT_PUBLIC_API_URL}/images?build=${build}`} />
                <p>
                    Subsequent calls to the same endpoint can include a <code>page</code> query parameter to get a
                    particular page of entities. Examples are included in the list metadata, under{" "}
                    <code>_links.firstPage</code> and <code>_links.lastPage</code>. The <code>build</code> parameter{" "}
                    <em>must</em> be included for page queries.
                </p>
                <CurlBox url={`${process.env.NEXT_PUBLIC_API_URL}/images?build=${build}&page=0`} />
                <p>
                    Page responses list links to individual entities in <code>_links.items</code>. These entities can
                    also be embedded in the response itself with the <code>embed_items</code> parameter.
                </p>
                <CurlBox url={`${process.env.NEXT_PUBLIC_API_URL}/images?build=${build}&embed_items=true&page=0`} />
                <p>
                    Lists can also be filtered with certain parameters. For example, this returns all images created
                    (i.e., approved) on or after <time dateTime="2023-02-12T00:00:00.000Z">2023 February 12</time>:
                </p>
                <CurlBox
                    url={`${
                        process.env.NEXT_PUBLIC_API_URL
                    }/images?build=${build}&filter_created_after=${encodeURIComponent(
                        new Date(Date.UTC(2023, 1, 12)).toISOString(),
                    )}`}
                />
            </section>
            <section id="searching-name">
                <h2>Searching for a Taxonomic Name</h2>
                <p>
                    <SiteTitle /> generally only covers taxa for which it has silhouettes. But it also provides tools
                    for augmenting searches with external resources that cover other taxa. To take full advantage, you
                    may need to make multiple calls both to the <SiteTitle /> API and to external APIs
                </p>
                <section id="searching-name-phylopic">
                    <h3>
                        In <SiteTitle /> &rsquo;s Database
                    </h3>
                    <p>
                        To search for a taxonomic name in <SiteTitle />, send the search text (preferably lower-case,
                        with non-alphabetic characters removed and whitespace trimmed) as a filter parameter to the
                        <code>/nodes</code> endpoint:
                    </p>
                    <CurlBox
                        url={`${process.env.NEXT_PUBLIC_API_URL}/nodes?filter_name=primates`}
                        options={{ location: true }}
                    />
                    <p>
                        You may optionally preface these searches with autocomplete calls, to get strings that{" "}
                        <SiteTitle /> will definitely return results for:
                    </p>
                    <CurlBox
                        url={`${process.env.NEXT_PUBLIC_API_URL}/autocomplete?query=prim`}
                        options={{ location: true }}
                    />
                    <p>
                        You may also wish to simply skip to loading loading the list and just load the first page (which
                        usually has the most relevant results). Remember to include the current build number.
                    </p>
                    <CurlBox
                        url={`${process.env.NEXT_PUBLIC_API_URL}/nodes?build=${build}&filter_name=primates&page=0`}
                    />
                </section>
                <section id="searching-name-otol">
                    <h3>
                        In the <cite>Open Tree of Life</cite>
                    </h3>
                    <p>
                        The full documentation for the <cite>Open Tree of Life</cite> API is available here:{" "}
                        <a href="//opentreeoflife.github.io/develop/api" rel="noreferrer">
                            <code>https://opentreeoflife.github.io/develop/api</code>
                        </a>
                    </p>
                    <p>
                        To get a list of taxa matching a search string, POST a JSON object to the{" "}
                        <code>/autocomplete_name</code> endpoint:
                    </p>
                    <CurlBox
                        url="https://api.opentreeoflife.org/v3/tnrs/autocomplete_name"
                        options={{ data: { name: "prim" } }}
                    />
                    <p>
                        This will yield a list of objects with an <code>ott_id</code> property serving as a unique
                        identifier. You may use that to get the full lineage of a particular taxon.
                    </p>
                    <CurlBox
                        url="https://api.opentreeoflife.org/v3/taxonomy/taxon_info"
                        options={{ data: { include_lineage: true, ott_id: 7501342 } }}
                    />
                    <p>
                        Collect the <code>ott_id</code> values from the <code>lineage</code>, from the least inclusive
                        taxon to the most inclusive taxon (i.e., the way they were returned), and POST those as an array
                        of strings to the <SiteTitle /> <code>/resolve/opentreeoflife.org/taxonomy</code> endpoint to
                        find the closest match in <SiteTitle />.
                    </p>
                    <CurlBox
                        url={`${process.env.NEXT_PUBLIC_API_URL}/resolve/opentreeoflife.org/taxonomy?build=${build}`}
                        options={{
                            data: [
                                "70119",
                                "937683",
                                "329706",
                                "844843",
                                "2914936",
                                "178260",
                                "409995",
                                "802117",
                                "155737",
                                "189832",
                                "117569",
                                "641038",
                                "691846",
                                "5246131",
                                "332573",
                                "304358",
                                "93302",
                                "805080",
                            ],
                            headers: { "Content-Type": "application/vnd.phylopic.v2+json" },
                            location: true,
                        }}
                    />
                </section>
                <section id="searching-name-pbdb">
                    <h3>
                        In the <cite>Paleobiology Database</cite>
                    </h3>
                    <p>
                        The full documentation for the <cite>Paleobiology Database</cite> API version 1.2 is available
                        here:{" "}
                        <a href="//paleobiodb.org/data1.2/" rel="noreferrer">
                            <code>https://paleobiodb.org/data1.2/</code>
                        </a>
                    </p>
                    <p>
                        To get a list of taxa matching a search string, use the <code>/taxa/auto.json</code> endpoint:
                    </p>
                    <CurlBox url="https://training.paleobiodb.org/data1.2/taxa/auto.json?limit=10&name=prim" />
                    <p>
                        This will yield an object with a list of <code>records</code> with an <code>oid</code> property
                        serving as a unique identifier. You may use that to get the full lineage of a particular taxon.
                    </p>
                    <CurlBox url="https://training.paleobiodb.org/data1.2/taxa/list.json?id=txn:133360&rel=all_parents" />
                    <p>
                        Collect the <code>oid</code> values (minues the <code>"txn:"</code> prefix) from the{" "}
                        <code>records</code>, from the least inclusive taxon to the most inclusive taxon (i.e., the
                        reverse of the way they were returned), and POST those as an array of strings to the{" "}
                        <SiteTitle /> <code>/resolve/opentreeoflife.org/taxonomy</code> endpoint to find the closest
                        match in <SiteTitle />.
                    </p>
                    <CurlBox
                        url={`${process.env.NEXT_PUBLIC_API_URL}/resolve/paleobiodb.org/txn?build=${build}`}
                        options={{
                            data: [
                                "133360",
                                "133359",
                                "39168",
                                "38935",
                                "91793",
                                "38882",
                                "53189",
                                "56749",
                                "465406",
                                "37177",
                                "125547",
                                "53190",
                                "77135",
                                "219195",
                                "67348",
                                "34881",
                                "67344",
                                "67149",
                                "33815",
                                "67145",
                                "272902",
                                "67103",
                                "67091",
                                "212579",
                                "1",
                                "28595",
                            ],
                            headers: { "Content-Type": "application/vnd.phylopic.v2+json" },
                            location: true,
                        }}
                    />
                </section>
            </section>
            <section id="choosing-image">
                <h2>Choosing an Image</h2>
                <p>TBD</p>
            </section>
        </article>
    )
}
export default PageComponent
