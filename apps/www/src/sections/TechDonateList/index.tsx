import { FC } from "react"
import customEvents from "~/analytics/customEvents"
import BulletList from "~/ui/BulletList"
const TechDonateList: FC = () => (
    <BulletList>
        <li>
            <a
                href="//inkscape.org/support-us"
                onClick={() =>
                    customEvents.clickLink("donate_inkscape", "//inkscape.org/support-us", "Inkscape", "link")
                }
                rel="external"
            >
                Inkscape
            </a>
        </li>
        <li>
            <a
                href="//imagemagick.org/script/support.php#support"
                onClick={() =>
                    customEvents.clickLink(
                        "donate_imagemagick",
                        "//imagemagick.org/script/support.php#support",
                        "ImageMagick",
                        "link",
                    )
                }
                rel="external"
            >
                ImageMagick
            </a>
        </li>
        <li>
            <a
                href="//opencollective.com/mochajs#support"
                onClick={() =>
                    customEvents.clickLink("donate_mocha", "//opencollective.com/mochajs#support", "Mocha", "link")
                }
                rel="external"
            >
                Mocha
            </a>
        </li>
    </BulletList>
)
export default TechDonateList
