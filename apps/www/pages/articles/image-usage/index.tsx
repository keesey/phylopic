import type { Collection, Image as ImageModel, ImageWithEmbedded } from "@phylopic/api-models"
import { PaginationContainer } from "@phylopic/client-components"
import { isUUIDish } from "@phylopic/utils"
import axios from "axios"
import type { GetStaticProps, NextPage } from "next"
import { NextSeo } from "next-seo"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/router"
import { FC, useContext } from "react"
import customEvents from "~/analytics/customEvents"
import CollectionsContext from "~/collections/context/CollectionsContext"
import useCurrentCollectionImages from "~/collections/hooks/useCurrentCollectionImages"
import PageLayout from "~/pages/PageLayout"
import getImageSlug from "~/routes/getImageSlug"
import Breadcrumbs from "~/ui/Breadcrumbs"
import Container from "~/ui/Container"
import SiteTitle from "~/ui/SiteTitle"
import ImageRail from "~/views/ImageRail"
import LinkedImageThumbnailView from "~/views/LinkedImageThumbnailView"
export interface Props {
    image: ImageModel
}
const SAMPLE_IMAGE_UUID = "045279d5-24e5-4838-bec9-0bea86812e35"
export const getStaticProps: GetStaticProps<Props> = async () => {
    const { data } = await axios.get<ImageModel>(
        `${process.env.NEXT_PUBLIC_API_URL}/images/${encodeURIComponent(SAMPLE_IMAGE_UUID)}`,
        {
            maxRedirects: 1,
        },
    )
    return { props: { image: data } }
}
const PageComponent: NextPage<Props> = ({ image }) => (
    <PageLayout>
        <NextSeo
            canonical={`${process.env.NEXT_PUBLIC_WWW_URL}/articles/image-usage`}
            description="How to follow the licensing requirements for silhouette images on PhyloPic, including instructions for creating custom collections of multiple images."
            title="Usage of PhyloPic Images"
        />
        <Container>
            <header>
                <Breadcrumbs
                    items={[
                        { children: "Home", href: "/" },
                        { children: "Articles", href: "/articles" },
                        { children: <strong>Usage of Images</strong> },
                    ]}
                />
                <h1>Usage of Images</h1>
                <div style={{ fontStyle: "italic", textAlign: "right" }}>
                    <Link
                        href="/contributors/060f03a9-fafd-4d08-81d1-b8f82080573f/t-michael-keesey-silhouettes"
                        rel="author"
                    >
                        T. Michael Keesey
                    </Link>
                </div>
            </header>
            <Article image={image} />
        </Container>
    </PageLayout>
)
export default PageComponent
const Article: FC<Props> = ({ image }: Props) => {
    const [{ currentCollection, collections, open }, dispatch] = useContext(CollectionsContext)
    const currentImages = useCurrentCollectionImages()
    const router = useRouter()
    const imageSlug = getImageSlug(image._links.self.title)
    const handleLinkClick = () => {
        const uuids = currentImages.map(image => image.uuid)
        void (async () => {
            try {
                const response = await axios.post<Collection>(`${process.env.NEXT_PUBLIC_API_URL}/collections`, uuids)
                if (isUUIDish(response?.data?.uuid)) {
                    customEvents.toggleCollectionDrawer(false)
                    dispatch({ type: "CLOSE" })
                    customEvents.openCollectionPage(response.data.uuid, currentCollection)
                    await router.push(`/collections/${encodeURIComponent(response.data.uuid)}`)
                }
            } catch (e) {
                customEvents.exception(String(e))
                alert("There was an error creating the Collection Page.")
            }
        })()
    }
    return (
        <article>
            <section id="introduction">
                <p>
                    All silhouette images on <SiteTitle /> are free to reuse, but some have requirements about
                    attribution, about commerical use, or about the licenses for derived works. Keeping track of these
                    differing requirements, especially for multiple images, can be difficult, so <SiteTitle /> offers a
                    tool to make some tasks easier:{" "}
                    <a href="#the-collections-drawer">
                        the <strong>Collections Drawer</strong>
                    </a>
                    .
                </p>
                <p>
                    Attributing images to <SiteTitle /> is never required. (But mentioning the site is always
                    appreciated!)
                </p>
            </section>
            <section id="licenses">
                <h2>Licenses</h2>
                <p>
                    <SiteTitle /> silhouette images are each under a{" "}
                    <a href="//creativecommons.org/" rel="external">
                        Creative Commons
                    </a>{" "}
                    deed or mark. This is listed on the Image Pages (
                    <Link href={`/images/${encodeURIComponent(image.uuid)}/${encodeURIComponent(imageSlug)}`}>
                        example
                    </Link>
                    ) above the image. General notes about the licensing requirements are listed below the image, along
                    with a link to the Creative Commons website for more information.
                </p>
                <section id="public-domain">
                    <h3>Public Domain</h3>
                    <p>
                        Images under the{" "}
                        <a href="//creativecommons.org/publicdomain/mark/1.0" rel="external">
                            <strong>Public Domain Mark</strong>
                        </a>{" "}
                        (
                        <strong>
                            <abbr title="Public Domain Mark">PDM</abbr>
                        </strong>
                        ) or the{" "}
                        <a href="//creativecommons.org/publicdomain/zero/1.0" rel="external">
                            <strong>Creative Commons Zero Deed</strong>
                        </a>{" "}
                        (
                        <strong>
                            <abbr title="Creative Commons Zero">CC0</abbr> 1.0
                        </strong>
                        ) are essentially free of requirements. You may use them anywhere, in any way, without
                        attribution.
                    </p>
                </section>
                <section id="attribution">
                    <h3>Attribution</h3>
                    <p>
                        Images under a <strong>Creative Commons Attribution Deed</strong> (
                        <a href="//creativecommons.org/licenses/by/3.0" rel="external">
                            <strong>
                                <abbr title="Creative Commons Attribution">CC-BY</abbr> 3.0
                            </strong>
                        </a>{" "}
                        or{" "}
                        <a href="//creativecommons.org/licenses/by/4.0" rel="external">
                            <strong>
                                <abbr title="Creative Commons Attribution">CC-BY</abbr> 4.0
                            </strong>
                        </a>
                        ) must be credited to the creator(s). The attribution text can be found on Image Pages (
                        <Link href="/images/7c9ab182-175d-4f02-96d0-09c1e5212bff/elephas-maximus#download-files">
                            example
                        </Link>
                        ). You must also provide a link to the license. And, if you have made any significant changes to
                        the images, you must indicate what they are.
                    </p>
                    <p>
                        In some circumstances (for example,{" "}
                        <a href="//www.copyright.gov/fair-use" rel="external">
                            Fair Use
                        </a>
                        ), you may not need to follow these requirements.
                    </p>
                    <p>
                        If these requirements would prevent you from reusing images, you may want to select the
                        &ldquo;public domain&rdquo; filter on <SiteTitle /> pages with multiple images.
                    </p>
                </section>
                <section id="share-alike">
                    <h3>ShareAlike</h3>
                    <p>
                        Images under a <strong>Creative Commons Attribution-ShareAlike Deed</strong> (
                        <a href="//creativecommons.org/licenses/by-sa/3.0" rel="external">
                            <strong>
                                <abbr title="Creative Commons Attribution-ShareAlike">CC-BY-SA</abbr> 3.0
                            </strong>
                        </a>{" "}
                        or{" "}
                        <a href="//creativecommons.org/licenses/by-nc-sa/3.0" rel="external">
                            <strong>
                                <abbr title="Creative Commons Attribution-NonCommercial-ShareAlike">CC-BY-NC-SA</abbr>{" "}
                                3.0
                            </strong>
                        </a>
                        ) follow all the requirements of the{" "}
                        <Link href="#attribution">Creative Commons Attribution Deed</Link> <em>and</em> require you to
                        make any derivative works available under the same license.
                    </p>
                    <p>
                        If this requirement would prevent you from reusing images, you may want to select the &ldquo;no
                        ShareAlike requirement&rdquo; filter on <SiteTitle /> pages with multiple images.
                    </p>
                </section>
                <section id="non-commercial">
                    <h3>NonCommercial</h3>
                    <p>
                        Images under a <strong>Creative Commons Attribution-NonCommercial Deed</strong> (
                        <a href="//creativecommons.org/licenses/by-nc/3.0" rel="external">
                            <strong>
                                <abbr title="Creative Commons Attribution-NonCommercial">CC-BY-NC</abbr> 3.0
                            </strong>
                        </a>{" "}
                        or{" "}
                        <a href="//creativecommons.org/licenses/by-nc-sa/3.0" rel="external">
                            <strong>
                                <abbr title="Creative Commons Attribution-NonCommercial-ShareAlike">CC-BY-NC-SA</abbr>{" "}
                                3.0
                            </strong>
                        </a>
                        ) follow all the requirements of the{" "}
                        <Link href="#attribution">Creative Commons Attribution Deed</Link> <em>and</em> forbid you from
                        using the image for commercial purposes. (This includes most publications.)
                    </p>
                    <p>
                        In some cases you may be able to contact the person who uploaded the image to waive the license
                        requirements. Look for the &ldquo;contact the contributor&rdquo; link on Image Pages (
                        <Link href="/images/5db9222c-40b5-4c56-be94-2a113e2dd18c/huaxiagnathus-orientalis#download-files">
                            example
                        </Link>
                        ). This may not be available for all contributors. As well, in some cases the person who
                        uploaded the image may not hold the rights to the image.
                    </p>
                    <p>
                        If this requirement would prevent you from reusing images, you may want to select the
                        &ldquo;free for commercial use&rdquo; filter on <SiteTitle /> pages with multiple images.
                    </p>
                </section>
            </section>
            <section id="multiple-images">
                <h2>Multiple Images</h2>
                <p>
                    Many users of <SiteTitle /> wish to use multiple images, such as for a figure in a research article.
                    Keeping track of the licensing requirements can be an onerous task, so <SiteTitle /> provides a tool
                    to make it easier:
                </p>
                <section id="the-collections-drawer">
                    <h3>The Collections Drawer</h3>
                    <p>
                        Toward the bottom of this page, you should see a wide horizontal bar with an arrow icon pointing
                        upward. Underneath it should say, &ldquo;Drag and drop silhouette images here to start a
                        collection.&rdquo; Click on the horizontal bar to open the Collections Drawer. Or,{" "}
                        <a onClick={() => dispatch({ type: "OPEN" })} href="#adding-images" role="button">
                            click here
                        </a>
                        .
                    </p>
                    {open && (
                        <p>
                            <em>
                                Looks like you&rsquo;ve got it open! <Link href="#adding-images">Keep reading</Link>.
                            </em>
                        </p>
                    )}
                </section>
                <section id="adding-images">
                    <h3>Adding Images</h3>
                    <>
                        <p>
                            Any place you see an image on <SiteTitle />, you can drag and drop it into your collection.
                            Image Pages also include an &ldquo;Add to Collection&rdquo; button. Drag and drop the image
                            below into your collection, or{" "}
                            <a
                                onClick={() =>
                                    dispatch({
                                        type: "ADD_TO_CURRENT_COLLECTION",
                                        payload: { type: "image", entity: image },
                                    })
                                }
                                href="#adding-images"
                                role="button"
                            >
                                click here
                            </a>
                            .
                        </p>
                        <div style={{ textAlign: "center" }}>
                            <LinkedImageThumbnailView value={image} />
                        </div>
                    </>{" "}
                    {collections[currentCollection].size > 0 && (
                        <p>
                            <em>
                                You&rsquo;ve added{" "}
                                {collections[currentCollection].size === 1 ? "an image" : "some images"}!{" "}
                                <Link href="#removing-images">Keep reading</Link>.
                            </em>
                        </p>
                    )}
                </section>
                <section id="removing-images">
                    <h3>Removing Images</h3>
                    <p>To remove an image from a collection, click the &ldquo;&times;&rdquo; icon below it.</p>
                    {collections[currentCollection].size === 0 && (
                        <p>
                            <em>
                                You&rsquo;ve removed all your images! Or maybe you never added any! Either way,{" "}
                                <Link href="#collection-pages">keep reading</Link>.
                            </em>
                        </p>
                    )}
                </section>
                <section id="collection-pages">
                    <h3>Collection Pages</h3>
                    <p>
                        Once a collection has more than one image, a web page for it becomes available. This web page
                        has some license information about the image collection as well as consolidated attribution text
                        that covers all of them.
                    </p>
                    {collections[currentCollection].size >= 2 ? (
                        <p>
                            <em>
                                Your collection has {collections[currentCollection].size} images! Now you should be able
                                to{" "}
                                {!open && (
                                    <>
                                        <a onClick={() => dispatch({ type: "OPEN" })} href="#collection-pages">
                                            open the drawer
                                        </a>{" "}
                                        and{" "}
                                    </>
                                )}
                                click on the link icon next to &ldquo;{currentCollection} (
                                {collections[currentCollection].size} image
                                {collections[currentCollection].size === 1 ? "" : "s"})&rdquo; to open a web page for
                                your collection. Then come back here to learn about <a href="#permalinks">permalinks</a>
                                .
                            </em>
                        </p>
                    ) : (
                        <>
                            <p>
                                You will need to add at least{" "}
                                {collections[currentCollection].size === 1 ? "one more image" : "two images"} to your
                                collection to see the link icon. Drag and drop{" "}
                                {collections[currentCollection].size === 1 ? "one" : "two"} of these into your
                                collection.
                            </p>
                            <PaginationContainer endpoint={process.env.NEXT_PUBLIC_API_URL + "/images"} maxPages={1}>
                                {images => (
                                    <>
                                        <Container variant="varying">
                                            <ImageRail value={images as readonly ImageWithEmbedded[]} />
                                        </Container>
                                    </>
                                )}
                            </PaginationContainer>
                        </>
                    )}
                </section>
                <section id="permalinks">
                    <h3>Permalinks</h3>
                    <p>
                        {collections[currentCollection].size >= 2 ? (
                            <a onClick={handleLinkClick} href="#renaming-collections">
                                Your Collection Page
                            </a>
                        ) : (
                            <>
                                Each Collection Page (
                                <Link href="/collections/78c8c857-33b8-073a-2819-022b63a005ca">example</Link>)
                            </>
                        )}{" "}
                        has a link saying &ldquo;click here to create a permalink for attribution&rdquo;. Permalinks (
                        <Link href="/permalinks/7c7705982f98cdec5b694ce302e25fee8525faeb90a10a8c9e309eb1b3e74e52">
                            example
                        </Link>
                        ) are pages with snapshots of image collection metadata. Instead of including lengthy
                        attributions for derivative works, you can simply provide a permalink{" "}
                        <abbr title="Uniform Resource Locator">URL</abbr>.
                    </p>
                </section>
                <section id="renaming-collections">
                    <h3>Renaming Collections</h3>
                    <p>
                        To rename your collection,{" "}
                        {!open && (
                            <>
                                <a onClick={() => dispatch({ type: "OPEN" })} href="#renaming-collections">
                                    open the drawer
                                </a>{" "}
                                and{" "}
                            </>
                        )}
                        click the pencil icon after &ldquo;{currentCollection} ({collections[currentCollection].size}{" "}
                        image
                        {collections[currentCollection].size === 1 ? "" : "s"})&rdquo;. You will be prompted for a new
                        name.
                    </p>
                    {currentCollection !== "My Collection" && (
                        <p>
                            <em>
                                Looks like you renamed it to &ldquo;{currentCollection}&rdquo;!{" "}
                                <Link href="#creating-multiple-collections">Keep reading</Link>.
                            </em>
                        </p>
                    )}
                </section>
                <section id="creating-multiple-collections">
                    <h3>Creating Multiple Collections</h3>
                    <p>
                        To add another collection,{" "}
                        {!open && (
                            <>
                                <a onClick={() => dispatch({ type: "OPEN" })} href="#creating-multiple-collections">
                                    open the drawer
                                </a>{" "}
                                and{" "}
                            </>
                        )}
                        click the plus icon (&ldquo;+&rdquo;) in the Collections Drawer. You will be asked to provide a
                        name for it.
                    </p>
                    {Object.keys(collections).length > 1 && (
                        <p>
                            <em>
                                Looks like you&rsquo;ve added{" "}
                                {Object.keys(collections).length === 2 ? "a collection" : "some collections"}!{" "}
                                <Link href="#deleting-collections">Keep reading</Link>.
                            </em>
                        </p>
                    )}
                </section>
                <section id="deleting-collections">
                    <h3>Deleting Collections</h3>
                    <p>
                        To delete your collection,{" "}
                        {!open && (
                            <>
                                <a onClick={() => dispatch({ type: "OPEN" })} href="#deleting-collections">
                                    open the drawer
                                </a>{" "}
                                and{" "}
                            </>
                        )}
                        click the trash can icon after &ldquo;{currentCollection} ({collections[currentCollection].size}{" "}
                        image
                        {collections[currentCollection].size === 1 ? "" : "s"})&rdquo;.
                    </p>
                    {Object.keys(collections).length === 1 && collections[currentCollection].size === 0 && (
                        <p>
                            <em>
                                You&rsquo;ve deleted everything! <Link href="#a-note-about-storage">Keep reading</Link>.
                            </em>
                        </p>
                    )}
                </section>
            </section>
            <section id="a-note-about-storage">
                <h3>A Note About Storage</h3>
                <p>
                    Your collections will be stored locally by your web browser. They will not be accessible from other
                    devices.
                </p>
            </section>
            <hr />
            <p>Hope this was helpful!</p>
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
