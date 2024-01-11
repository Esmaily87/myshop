import { AppProps } from "next/app"
import { globalStyle } from "../styles/global"
import { Storefront } from "@phosphor-icons/react";
import { Container, Header } from "../styles/pages/app";
import Image from "next/image"
import Tshirt from "../assets/tshirt.png"
import LogoImg from "../assets/Logo.png"
import Link from "next/link";




globalStyle();

export default function App({ Component, pageProps }: AppProps) {
  return (
    <Container>
      <Header>
        
          {/* <Storefront size={90} />
          <div>Shop ShirtX</div> */}
          <Link href={'/'}>

          <Image src={LogoImg.src} width={129} height={52} alt="" />

          {/* <Image src={Tshirt} alt="Obrigado"/> */}
          </Link>
        
      </Header>
      <Component {...pageProps} />
    </Container>
    )
}

