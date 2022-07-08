/* eslint-disable @next/next/no-img-element */
import clsx from "clsx"
import Image from "next/future/image"
import { FC } from "react"
import logoFacebook from "../../../public/logos/facebook.svg"
import logoPatreon from "../../../public/logos/patreon-white.svg"
import logoTwitter from "../../../public/logos/twitter.svg"
import styles from "./index.module.scss"
const YEAR = new Date().getFullYear()
const SiteFooter: FC = () => (
    <footer className={styles.main}>
        <ul>
            <li className={styles.item}>
                <abbr title="Copyright">©</abbr> {YEAR} <a href="http://tmkeesey.net">T. Michael Keesey</a>
            </li>
            <li className={clsx(styles.item, styles.logos)}>
                <a href="https://www.twitter.com/phylopic" title="Follow @phylopic on Twitter.">
                    <Image src={logoTwitter} width={28} height={28} alt="Twitter" />
                </a>
                <a href="https://www.facebook.com/phylopic" title="Follow @phylopic on Facebook.">
                    <Image src={logoFacebook} width={21} height={21} alt="Facebook" />
                </a>
                <a href="https://www.patreon.com/tmkeesey" title="Support the creator of PhyloPic on Patreon.">
                    <Image src={logoPatreon} width={80} height={11} alt="Patreon" />
                </a>
            </li>
        </ul>
    </footer>
)
export default SiteFooter
