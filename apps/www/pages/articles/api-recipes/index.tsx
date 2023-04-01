import { BuildContext } from "@phylopic/utils-api"
import type { NextPage } from "next"
import { NextSeo } from "next-seo"
import Image from "next/image"
import Link from "next/link"
import { FC, useContext } from "react"
import customEvents from "~/analytics/customEvents"
import PageLayout from "~/pages/PageLayout"
import Breadcrumbs from "~/ui/Breadcrumbs"
import CurlBox from "~/ui/CurlBox"
import SiteTitle from "~/ui/SiteTitle"
const PageComponent: NextPage = () => (
    <PageLayout>
        <NextSeo
            canonical={`${process.env.NEXT_PUBLIC_WWW_URL}/articles/api-recipes`}
            description="A gentle introduction for software engineers to the PhyloPic Application Programming Interface (API). Examples including searching for silhouette images of biological taxa."
            title="Code Recipes for the PhyloPic API"
        />
        <header>
            <Breadcrumbs
                items={[
                    { children: "Home", href: "/" },
                    { children: "Articles" },
                    { children: <strong>API Recipes</strong> },
                ]}
            />
            <h1>
                <abbr title="Application Programming Interface">API</abbr> Recipes
            </h1>
            <div style={{ fontStyle: "italic", textAlign: "right" }}>
                <Link
                    href="/contributors/060f03a9-fafd-4d08-81d1-b8f82080573f/t-michael-keesey-silhouettes"
                    rel="author"
                >
                    T. Michael Keesey
                </Link>
            </div>
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
                    documented at the <a href="http://api-docs.phylopic.org/">API Documentation Website</a>. As an
                    alternative introduction, this article offers a simpler (but non-comprehensive) guide to using the
                    API, with some examples of commonly-needed functionality, like listing images and searching for
                    taxa. As well, it documents how other APIs may be used to augment searching capabilities.
                </p>
                <p>This article is intended for readers who are familiar with:</p>
                <ul style={{ listStyleType: "disc", marginInlineStart: "1em" }}>
                    <li>using a command-line prompt (UNIX, etc.),</li>
                    <li>
                        basic World Wide Web technological terms (<abbr title="Uniform Resource Locator">URL</abbr>,{" "}
                        <abbr title="Hypertext Transfer Protocol">HTTP</abbr> header, query parameter, etc.), and
                    </li>
                    <li>
                        the{" "}
                        <a href="//www.json.org/" rel="noreferrer">
                            <abbr title="JavaScript Object Notation">JSON</abbr>
                        </a>{" "}
                        data format.
                    </li>
                </ul>
                <p>
                    Examples are given as{" "}
                    <a href="//curl.se/" rel="noreferrer">
                        curl
                    </a>{" "}
                    commands which may be run in a command-line prompt. Or, click the &ldquo;play&ldquo; icon (⏵) to run
                    queries and see results on this page. As an example, this call loads the index for the{" "}
                    <a href="//en.wikipedia.org/wiki/Representational_state_transfer" rel="noreferrer">
                        RESTful
                    </a>{" "}
                    API, with JSON data detailing other resource endpoints and general metadata about the site.
                </p>
                <CurlBox url={`${process.env.NEXT_PUBLIC_API_URL}`} options={{ location: true }} title="API Index" />
                <p>
                    For compatibility with future versions of the API, it is <em>strongly recommended</em> that you
                    include the <strong>major API version</strong> (<code>2</code>) in the <code>Accept</code> header
                    thusly:
                </p>
                <CurlBox
                    url={`${process.env.NEXT_PUBLIC_API_URL}`}
                    options={{ headers: { Accept: "application/vnd.phylopic.v2+json" }, location: true }}
                    title="API Index (major API version specified)"
                />
                <p>But this is not a strict requirement. For brevity, the ensuing examples will forgo it.</p>
            </section>
            <section id="builds">
                <h2>Builds</h2>
                <p>
                    You may notice that the JSON response includes properties called <code>&quot;build&quot;</code> and{" "}
                    <code>&quot;buildTimestamp&quot;</code>. Updates to <SiteTitle /> are published in discrete{" "}
                    <strong>builds</strong>. In order to return data, each API call must include the current build
                    number in the query string. If no build number is included, a <code>307 Temporary Redirect</code>{" "}
                    response is returned, indicating a modified URL (in the <code>Location</code> header) with the
                    current build number added to the query string. (This is why the command above includes the{" "}
                    <code style={{ whiteSpace: "pre" }}>--location</code> option.) The response to the modified URL will
                    always include a <code>&quot;build&quot;</code> property with the current build number.
                </p>
                <p>
                    To skip the redirect, simply place the current <code>build</code> number in the query string:
                </p>
                <CurlBox
                    url={`${process.env.NEXT_PUBLIC_API_URL}?build=${build}`}
                    title="API Index (current build specified)"
                />
                <p>
                    URLs that specify a previous build will result in a <code>410 Gone</code> error response. The
                    current build number is included in the response so that it can be used in subsequent calls.
                </p>
                <CurlBox
                    url={`${process.env.NEXT_PUBLIC_API_URL}?build=1`}
                    title="API Index (obsolete build specified)"
                />
            </section>
            <section id="entities">
                <h2>Entities</h2>
                <p>
                    There are three major types of entity in <SiteTitle />
                    &rsquo;s database:{" "}
                    <Link href="/images">
                        <strong>images</strong>
                    </Link>
                    ,{" "}
                    <Link href="/nodes">
                        <strong>nodes</strong>
                    </Link>
                    , and{" "}
                    <Link href="/contributors">
                        <strong>contributors</strong>
                    </Link>
                    . Each individual entity is identified by a{" "}
                    <a href="//wikipedia.org/wiki/Universally_unique_identifier" rel="noreferrer">
                        <abbr title="Universally Unique Identifier">UUID</abbr>
                    </a>
                    , which can be included in the URL to retrieve data about it. Examples:
                </p>
                <CurlBox
                    url={`${process.env.NEXT_PUBLIC_API_URL}/images/045279d5-24e5-4838-bec9-0bea86812e35`}
                    options={{ location: true }}
                    title="Image"
                />
                <br />
                <CurlBox
                    url={`${process.env.NEXT_PUBLIC_API_URL}/nodes/8f901db5-84c1-4dc0-93ba-2300eeddf4ab`}
                    options={{ location: true }}
                    title="Node"
                />
                <br />
                <CurlBox
                    url={`${process.env.NEXT_PUBLIC_API_URL}/contributors/060f03a9-fafd-4d08-81d1-b8f82080573f`}
                    options={{ location: true }}
                    title="Contributor"
                />
                <p>
                    Each entity may includes links to other individual entities, in the <code>_links</code> object. For
                    example, nodes include a link to <code>parentNode</code> (except for the root node) and{" "}
                    <code>primaryImage</code>. Images include a link to their <code>contributor</code>,{" "}
                    <code>specificNode</code>, and sometimes a <code>generalNode</code>, as well as a list of{" "}
                    <code>nodes</code>: a lineage including <code>specificNode</code> and <code>generalNode</code>.
                </p>
                <p>
                    These linked entities may be embedded in the response directly using certain query parameters whose
                    names start with <code>&quot;embed_&quot;</code>.
                </p>
                <CurlBox
                    url={`${process.env.NEXT_PUBLIC_API_URL}/images/045279d5-24e5-4838-bec9-0bea86812e35?embed_generalNode=true&embed_nodes=true&embed_specificNode=true`}
                    options={{ location: true }}
                    title="Image with Embedded Entities"
                />
                <br />
                <CurlBox
                    url={`${process.env.NEXT_PUBLIC_API_URL}/nodes/8f901db5-84c1-4dc0-93ba-2300eeddf4ab?embed_parentNode=true&embed_primaryImage=true`}
                    options={{ location: true }}
                    title="Node with Embedded Entities"
                />
            </section>
            <section id="lists">
                <h2>Lists</h2>
                <p>
                    The API uses the same structure for lists of any type of entity. By default, a list endpoint returns
                    metadata about the list: number of items, number of pages, and links to the first and last page.
                </p>
                <CurlBox
                    url={`${process.env.NEXT_PUBLIC_API_URL}/images`}
                    options={{ location: true }}
                    title="List of All Images"
                />
                <p>
                    Subsequent calls to the list endpoint can include a zero-indexed <code>page</code> query parameter
                    to get a particular page of entities. Examples are included in the list metadata, under{" "}
                    <code>_links.firstPage</code> and <code>_links.lastPage</code>. The <code>build</code> parameter{" "}
                    <em>must</em> be included for page queries.
                </p>
                <CurlBox
                    url={`${process.env.NEXT_PUBLIC_API_URL}/images?build=${build}&page=0`}
                    title="First Page of All Images"
                />
                <p>
                    Page responses list links to individual entities in <code>_links.items</code>. These entities can
                    also be embedded in the response itself, using the <code>embed_items</code> parameter.
                </p>
                <CurlBox
                    url={`${process.env.NEXT_PUBLIC_API_URL}/images?build=${build}&embed_items=true&page=0`}
                    title="First Page of All Images, with Items Embedded"
                />
                <p>
                    Lists can also be filtered with certain parameters whose names start with{" "}
                    <code>&quot;filter_&quot;</code>. For example, this command this returns metadata for all images
                    submitted on or after <time dateTime="2023-02-12T00:00:00.000Z">2023 February 12</time>:
                </p>
                <CurlBox
                    title="List of Images Created after a Given Date"
                    url={`${process.env.NEXT_PUBLIC_API_URL}/images?build=${build}&filter_created_after=${new Date(
                        Date.UTC(2023, 1, 12),
                    ).toISOString()}`}
                />
            </section>
            <section id="searching-name">
                <h2>Searching for a Taxonomic Name</h2>
                <p>
                    <SiteTitle /> mostly only covers taxa for which it has silhouettes. But it also provides tools for
                    augmenting searches with external resources that cover other taxa. To take full advantage, you may
                    need to make multiple calls both to the <SiteTitle /> API and to other APIs. Examples below include
                    the{" "}
                    <a href="//tree.opentreeoflife.org/" rel="noreferrer">
                        <cite>Open Tree of Life</cite>
                    </a>{" "}
                    API and the{" "}
                    <a href="//paleobiodb.org/" rel="noreferrer">
                        <cite>Paleobiology Database</cite>
                    </a>{" "}
                    API.
                </p>
                <section id="searching-name-phylopic">
                    <h3>
                        Searching in <SiteTitle />
                    </h3>
                    <p>
                        To search for a taxonomic name in <SiteTitle />, send the search text (preferably lower-case,
                        with non-alphabetic characters removed and whitespace trimmed) as a filter parameter (
                        <code>filter_name</code>) to the
                        <code>/nodes</code> endpoint:
                    </p>
                    <CurlBox
                        url={`${process.env.NEXT_PUBLIC_API_URL}/nodes?filter_name=primates`}
                        options={{ location: true }}
                        title="Search for a Taxonomic Name"
                    />
                    <p>
                        You may optionally preface these searches with autocomplete calls, to get matching strings that{" "}
                        <SiteTitle /> will definitely return results for:
                    </p>
                    <CurlBox
                        url={`${process.env.NEXT_PUBLIC_API_URL}/autocomplete?query=prim`}
                        options={{ location: true }}
                        title="Autocomplete for Taxonomic Names"
                    />
                    <p>
                        You may also wish to skip loading the list metadata and just load the first page (which usually
                        has the most relevant results). Remember to include the current build number. (And note that
                        this will yield a <code>404 Not Found</code> response if there are no results.)
                    </p>
                    <CurlBox
                        url={`${process.env.NEXT_PUBLIC_API_URL}/nodes?build=${build}&filter_name=primates&page=0`}
                        title="First Page of Search Results for a Taxonomic Name"
                    />
                </section>
                <section id="searching-name-otol">
                    <h3>
                        Searching in the <cite>Open Tree of Life</cite>
                    </h3>
                    <p>
                        The full documentation for the <cite>Open Tree of Life</cite> API is available here:{" "}
                        <a href="//opentreeoflife.github.io/develop/api" rel="noreferrer">
                            <code>https://opentreeoflife.github.io/develop/api</code>
                        </a>
                    </p>
                    <p>
                        To get a list of taxa matching a search string, POST a JSON object to the{" "}
                        <code>/tnrs/autocomplete_name</code> endpoint:
                    </p>
                    <CurlBox
                        url="https://api.opentreeoflife.org/v3/tnrs/autocomplete_name"
                        options={{ data: { name: "prim" } }}
                        title={
                            <>
                                Autocomplete for <cite>Open Tree of Life</cite>
                            </>
                        }
                    />
                    <p>
                        This will yield a list of objects with an <code>ott_id</code> property serving as a unique
                        identifier. You may use the <code>ott_id</code> to get the full lineage of a particular taxon.
                    </p>
                    <CurlBox
                        url="https://api.opentreeoflife.org/v3/taxonomy/taxon_info"
                        options={{ data: { include_lineage: true, ott_id: 7501342 } }}
                        title={
                            <>
                                Lineage for <cite>Open Tree of Life</cite>
                            </>
                        }
                    />
                    <p>
                        Collect the <code>ott_id</code> values from the <code>lineage</code>, from the least inclusive
                        taxon to the most inclusive taxon (i.e., the order in the response), and POST those as an array
                        of strings to the <SiteTitle /> API&rsquo;s <code>/resolve/opentreeoflife.org/taxonomy</code>{" "}
                        endpoint to find the closest match in <SiteTitle />.
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
                        title={
                            <>
                                Resolve Node for <cite>Open Tree of Life</cite>
                            </>
                        }
                    />
                </section>
                <section id="searching-name-pbdb">
                    <h3>
                        Searching in the <cite>Paleobiology Database</cite>
                    </h3>
                    <p>
                        The full documentation for the <cite>Paleobiology Database</cite> API version 1.2 is available
                        here:{" "}
                        <a href="//paleobiodb.org/data1.2" rel="noreferrer">
                            <code>https://paleobiodb.org/data1.2</code>
                        </a>
                    </p>
                    <p>
                        To get a list of taxa matching a search string, use the <code>/taxa/auto.json</code> endpoint:
                    </p>
                    <CurlBox
                        url="https://training.paleobiodb.org/data1.2/taxa/auto.json?limit=10&name=prim"
                        title={
                            <>
                                Autocomplete for <cite>Paleobiology Database</cite>
                            </>
                        }
                    />
                    <p>
                        This will yield an object with a list of <code>records</code>, each with an <code>oid</code>{" "}
                        property serving as a unique identifier. You may use the <code>oid</code> to get the full
                        lineage of a particular taxon.
                    </p>
                    <CurlBox
                        url="https://training.paleobiodb.org/data1.2/taxa/list.json?id=txn:133360&rel=all_parents"
                        title={
                            <>
                                Lineage for <cite>Paleobiology Database</cite>
                            </>
                        }
                    />
                    <p>
                        Collect the <code>oid</code> values (minues the <code>&quot;txn:&quot;</code> prefix) from the{" "}
                        <code>records</code> into an array, in order from the least inclusive taxon to the most
                        inclusive taxon (i.e., the reverse of the order in the response). POST those as an array of
                        strings to the <SiteTitle /> API&rsquo;s <code>/resolve/paleobiodb.org/txn</code> endpoint to
                        find the closest match in <SiteTitle />.
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
                        title={
                            <>
                                Resolve Node for <cite>Paleobiology Database</cite>
                            </>
                        }
                    />
                </section>
            </section>
            <section id="choosing-image">
                <h2>Choosing an Image for a Taxa</h2>
                <p>
                    Once you have found the node (or as close as <SiteTitle /> has to it), how do you select a
                    silhouette for it? The easiest way is to use the <code>primaryImage</code> property. In general this
                    is the earliest-submitted image of those that most closely illustrate the node.
                </p>
                <CurlBox
                    url={`${process.env.NEXT_PUBLIC_API_URL}/nodes/37040a3d-bf9c-4aa0-9ca4-d953caac1d1c?embed_primaryImage=true`}
                    options={{ location: true }}
                    title="Node with Embedded Primary Image"
                />
                <p>
                    However, you may want to select from a list of images that directly represent the node. Use the
                    node&rsquo;s UUID as a filter to get the list metadata:
                </p>
                <CurlBox
                    url={`${process.env.NEXT_PUBLIC_API_URL}/images?filter_node=37040a3d-bf9c-4aa0-9ca4-d953caac1d1c`}
                    options={{ location: true }}
                    title="List of Images for a Node"
                />
                <p>
                    And use this to get the first page in the list (usually the only page), with image metadata embedded
                    in the response:
                </p>
                <CurlBox
                    url={`${process.env.NEXT_PUBLIC_API_URL}/images?build=${build}&embed_items=true&filter_node=37040a3d-bf9c-4aa0-9ca4-d953caac1d1c&page=0`}
                    title="First Page of Images for a Node"
                />
                <p>
                    Using <code>filter_node</code> will only retrieve images that directly represent that particular
                    node. For ancestral nodes, it may be better to get all the images within the full clade (the node
                    and all descendant nodes). The image entries will be roughly sorted in order of their subject
                    matter&rsquo;s proximity to the ancestral node.
                </p>
                <CurlBox
                    url={`${process.env.NEXT_PUBLIC_API_URL}/images?build=${build}&embed_items=true&filter_clade=36c04f2f-b7d2-4891-a4a9-138d79592bf2&page=0`}
                    title="List of Images within a Clade"
                />
            </section>
            <section id="choosing-image-file">
                <h2>Choosing an Image File</h2>
                <p>Once you have the metadata for the image, there will be several options for the image file.</p>
                <CurlBox
                    url={`${process.env.NEXT_PUBLIC_API_URL}/images/c466a71f-90b9-4ea7-b6ba-56cb37d47f22`}
                    options={{ location: true }}
                    title="Image"
                />
                <p>
                    Look in the <code>_links</code> object and select from these:
                </p>
                <dl>
                    <dt>
                        <code>http://ogp.me/ns#image</code>
                    </dt>
                    <dd>An image meant to be used as a preview in social media.</dd>
                    <dt>
                        <code>rasterFiles</code>
                    </dt>
                    <dd>
                        A list of <a href="//wikipedia.org/wiki/Raster_graphics">raster</a> files (pixel-based,{" "}
                        <a href="//www.w3.org/TR/2003/REC-PNG-20031110">
                            <abbr title="Portable Network Graphics">PNG</abbr> format
                        </a>
                        ), from largest to smallest.
                    </dd>
                    <dt>
                        <code>sourceFile</code>
                    </dt>
                    <dd>The original file, as uploaded.</dd>
                    <dt>
                        <code>thumbnailFiles</code>
                    </dt>
                    <dd>A list of square thumbnail files (PNG format), from largest to smallest.</dd>
                    <dt>
                        <code>vectorFile</code>
                    </dt>
                    <dd>
                        A <a href="//wikipedia.org/wiki/Vector_graphics">vector</a> version of the image (
                        <a href="//www.w3.org/TR/SVG">
                            <abbr title="Scalable Vector Graphics">SVG</abbr> format
                        </a>
                        ). Same as <code>sourceFile</code> if a vector file was submitted, or automatically generated
                        from it otherwise.
                    </dd>
                </dl>
            </section>
            <section id="making-your-own">
                <h2>Making Your Own Recipes</h2>
                <p>
                    Hopefully this article has provided a gentle introduction to the <SiteTitle /> API. You may read the{" "}
                    <a href="http://api-docs.phylopic.org/">complete documentation</a> to see about other possibilities
                    and optimizations for your own needs.
                </p>
                <p>
                    You may also take a look at the{" "}
                    <a href="//github.com/keesey/phylopic">open source code repository</a> and even{" "}
                    <a href="//github.com/keesey/phylopic#contributing">make contributions</a> to it.
                </p>
            </section>
            <p>Happy coding!</p>
            <div style={{ textAlign: "center" }}>
                <a
                    href="//www.buymeacoffee.com/phylopic"
                    onClick={() =>
                        customEvents.clickLink(
                            "api_recipes_buymeacoffee",
                            "//www.buymeacoffee.com/phylopic",
                            "Buy me a coffee.",
                            "button",
                        )
                    }
                >
                    <Image
                        alt="Buy me a coffee."
                        height={50}
                        src="//img.buymeacoffee.com/button-api/?text=Buy me a coffee&emoji=&slug=phylopic&button_colour=f5bb00&font_colour=000000&font_family=Poppins&outline_colour=000000&coffee_colour=fade85"
                        unoptimized
                        width={235}
                    />
                </a>
            </div>
        </article>
    )
}
export default PageComponent
