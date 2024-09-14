import { GetServerSideProps } from "next";
import Image from "next/image";
import Stripe from "stripe";
import { stripe } from "../lib/stripe"
import Link from "next/link";
import { SuccessContainer, ImageContainer } from "../styles/pages/successpage";
import Product from "./product/[id]";
import Head from "next/head";

interface SuccessShopProps {
    customerName: string;
    product: {
    name: string;
    imageUrl: string;
    }
}

export default function Successshop({customerName, product}: SuccessShopProps) {
    return(
        <>
        <Head>
            <title>Compra Efetuada | T-Shirt Shop</title>
            <meta name="robots"content="noindex" />
        </Head>
        <SuccessContainer>
            <h1>Compra Efetuada!</h1>
            <ImageContainer>

                <Image src={product.imageUrl} width={120} height={110} alt=""/>

            </ImageContainer>
            <p>
                Uhuul <strong>{customerName}</strong>, sua <strong>{product.name}</strong> já está a caminho da sua casa.
            </p>
            <Link href="/">
            {/* <ArrowCircleLeft size={32} href="/"/> */}
                      Voltar para a página inicial
                
            </Link>
        </SuccessContainer>
        </>
        )
}

export const getServerSideProps: GetServerSideProps = async ({query}) => {
    const sessionId = String(query.session_id);

    if(!query.session_id) {
        return {

            // notFound: true
            redirect: {
                destination: "/",
                permanent: false,
            }

        }
        
    }

    const session = await stripe.checkout.sessions.retrieve(sessionId, {
        expand: ['line_items', 'line_items.data.price.product']
    });

    const customerName = session.customer_details.name;
    const product = session.line_items.data[0].price.product as Stripe.Product;

    return{
        props: {
            customerName,
            product: {
                name: product.name,
                imageUrl: product.images[0]
            }
        }
    }
}