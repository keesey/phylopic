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
                    alternative introduction, this page offers a simpler (but non-comprehensive) guide to using the API,
                    with some examples of commonly-needed functionality, like listing image files and searching for
                    taxa. As well, it documents how other resources may be used to augment searching capabilities.
                </p>
                <p>This page is intended for readers who are familiar with:</p>
                <ul style={{ listStyleType: "disc", marginInlineStart: "1em" }}>
                    <li>using a command-line prompt (UNIX, etc.)</li>
                    <li>
                        basic World Wide Web technological terms (<abbr title="Uniform Resource Locator">URL</abbr>,
                        POST, <abbr title="Hypertext Transfer Protocol">HTTP</abbr> header, query parameter, etc.)
                    </li>
                    <li>
                        the{" "}
                        <a href="//www.json.org/" rel="noreferrer">
                            <abbr title="JavaScript Object Notation">JSON</abbr>
                        </a>{" "}
                        data format
                    </li>
                </ul>
                <p>
                    Examples are given as{" "}
                    <a href="//curl.se/" rel="noreferrer">
                        curl
                    </a>{" "}
                    commands which may be run in a command-line prompt. Or, click the &ldquo;play&ldquo; icon to run
                    queries and see results on this page. As an example, this call loads the index for the{" "}
                    <a href="//en.wikipedia.org/wiki/Representational_state_transfer" rel="noreferrer">
                        RESTful
                    </a>{" "}
                    API.
                </p>
                <CurlBox url={`${process.env.NEXT_PUBLIC_API_URL}`} options={{ location: true }} />
                <p>
                    Loading this endpoint returns JSON data detailing other resource endpoints and general metadata
                    about the site.
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
                    including a build number in the query string. If a build number is not included, a{" "}
                    <code>307 Temporary Redirect</code> response is returned indicating a modified URL (
                    <code>Location</code> header) with the current build number added in the query string. (This is why
                    the command above includes the <code style={{ whiteSpace: "pre" }}>--location</code> option.) The
                    response to that URL will always include a<code>"build"</code> property with the current build
                    number.
                </p>
                <p>
                    To skip the redirect, simply place the current <code>build</code> in the query string:
                </p>
                <CurlBox url={`${process.env.NEXT_PUBLIC_API_URL}?build=${build}`} />
                <p>
                    URLs that specify a previous build will result in a <code>410 Gone</code> error response, with the
                    current build included in the response.
                </p>
                <CurlBox url={`${process.env.NEXT_PUBLIC_API_URL}?build=1`} />
            </section>
            <section id="entities">
                <h2>Entities</h2>
                <p>
                    There are three major type of entity in <SiteTitle />
                    &rsquo;s database: <strong>images</strong>, <strong>nodes</strong>, and{" "}
                    <strong>contributors</strong>. Each individual entity is identified by a{" "}
                    <a href="//wikipedia.org/wiki/Universally_unique_identifier" rel="noreferrer">
                        <abbr title="Universally Unique Identifier">UUID</abbr>
                    </a>
                    , which can be included in the URL to retrieve data about it. Examples:
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
                <h2>Choosing an Image for a Taxa</h2>
                <p>
                    Once you have found the node (or as close as <SiteTitle /> has to it), how do you select a
                    silhouette for it? The easiest way is to use the <code>primaryImage</code> property. In general this
                    is the earliest-submitted image of the those that most closely illustrate the node.
                </p>
                <CurlBox
                    url={`${process.env.NEXT_PUBLIC_API_URL}/nodes/37040a3d-bf9c-4aa0-9ca4-d953caac1d1c?embed_primaryImage=true`}
                    options={{ location: true }}
                />
                <p>
                    However, you may want to select from a list of images that directly represent the node. Use this to
                    get the list:
                </p>
                <CurlBox
                    url={`${process.env.NEXT_PUBLIC_API_URL}/images?filter_node=37040a3d-bf9c-4aa0-9ca4-d953caac1d1c`}
                    options={{ location: true }}
                />
                <p>
                    And this to get the first page in the list (usually the only page) with image metadata embedded in
                    the response:
                </p>
                <CurlBox
                    url={`${process.env.NEXT_PUBLIC_API_URL}/images?build=${build}&embed_items=true&filter_node=37040a3d-bf9c-4aa0-9ca4-d953caac1d1c&page=0`}
                />
                <p>
                    Using <code>filter_node</code> will only retrieve images that directly represent that particular
                    taxon. For higher taxa (clades), it may be better to get all the images within the clade. (The
                    images will be roughly sorted in order of their subject matter&rsquo;s proximity to the root.)
                </p>
                <CurlBox
                    url={`${process.env.NEXT_PUBLIC_API_URL}/images?build=${build}&embed_items=true&filter_clade=36c04f2f-b7d2-4891-a4a9-138d79592bf2&page=0`}
                />
            </section>
            <section id="choosing-image-file">
                <h2>Choosing an Image File</h2>
                <p>Once you have the metadata for the image, there will be several options for the image file.</p>
                <CurlBox
                    url={`${process.env.NEXT_PUBLIC_API_URL}/images/c466a71f-90b9-4ea7-b6ba-56cb37d47f22`}
                    options={{ location: true }}
                />
                <p>
                    Look in the <code>_links</code> object and select from one of these:
                </p>
                <dl>
                    <dt>
                        <code>http://ogp.me/ns#image</code>
                    </dt>
                    <dd>An image meant to be used for a preview in social media.</dd>
                    <dt>
                        <code>rasterFiles</code>
                    </dt>
                    <dd>A list of raster files (pixel-based), from largest to smallest.</dd>
                    <dt>
                        <code>sourceFile</code>
                    </dt>
                    <dd>The original file, as uploaded.</dd>
                    <dt>
                        <code>thumbnailFiles</code>
                    </dt>
                    <dd>A list of square thumbnail files, from largest to smallest.</dd>
                    <dt>
                        <code>vectorFile</code>
                    </dt>
                    <dd>
                        A scalable vector version of the image. Same as <code>sourceFile</code> if a vector file was
                        submitted, or automatically generated from it otherwise.
                    </dd>
                </dl>
            </section>
            <section id="making-your-own">
                <h2>Making Your Own Recipes</h2>
                <p>
                    It is hoped that this page has provided a gentle introduction to the <SiteTitle /> API. You may read
                    the <a href="http://api-docs.phylopic.org">complete documentation</a> to see about other
                    possibilities and optimizations for your own needs.
                </p>
                <p>
                    You may also take a look at the{" "}
                    <a href="//github.com/keesey/phylopic">open source code repository</a> and even{" "}
                    <a href="//github.com/keesey/phylopic#contributing">make contributions</a> to it.
                </p>
            </section>
        </article>
    )
}
export default PageComponent
