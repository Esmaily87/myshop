
import { ImageContainer, ProductDetails, ProductContainer } from "../../styles/pages/product"
import { GetServerSideProps, GetStaticPaths, GetStaticProps } from "next"
import { stripe } from "../../lib/stripe"
import Stripe from "stripe"
import Image from "next/image"
// import { useRouter } from "next/router"
import axios from "axios"
import { useEffect, useState } from "react"
import Head from "next/head"
import { json } from "stream/consumers"



interface ProductProps {
    product: {
      id: string;
      name: string;
      imageUrl: string;
      price: string;
      description: string;
      defaultPriceId: string;
  }
  
}


export default function Product({product}: ProductProps) {
  const[isCreatingCheckoutSession, setisCreatingCheckoutSession] = useState(false)

  const [List, setList] = useState([])

  useEffect(() => {
    setList([1,2,3])
    

  },[product])



    
    
  

  async function handleBuyButton() {
    try{
      setisCreatingCheckoutSession(true);
      const response = await axios.post('/api/checkout',{
        priceId: product.defaultPriceId,

      })
      
      const{ checkoutUrl } = response.data;

      

      // router.push('/checkout')

      window.location.href = checkoutUrl

    } catch(err){
      setisCreatingCheckoutSession(false);
      alert('falha ao redirecionar ao checkout')
    } finally{}
  }

  async function handleAddCart() {
    try{
      setisCreatingCheckoutSession(true);
      const response = await axios.get('/api/cart',{
        params: {
        priceId: product.defaultPriceId,
        }

      })
      
      const{ cart } = response.data;

      

      // router.push('/checkout')

      window.location.href = cart

    } catch(err){
      setisCreatingCheckoutSession(false);
      alert('falha ao redirecionar ao checkout')
    } finally{}
  }



  
 

        return (
          <>
          <Head>
            <title>`{product.name}{" por "}{product.price}`</title>
          </Head>
          <ProductContainer >
              <ImageContainer  >
                <Image src={product.imageUrl} width={520} height={480} alt="" />

              </ImageContainer>
              <ProductDetails >
                <h1>{product.name}</h1>
                <span>{product.price}</span>
                <p>{product.description}</p>
                <button disabled={isCreatingCheckoutSession} onClick={handleBuyButton}>Comprar agora</button>
                <button disabled={isCreatingCheckoutSession} onClick={handleAddCart}>Adicionar ao Carrinho</button>
                <p>{List}</p>
                
              </ProductDetails>
          </ProductContainer>
          </>
        )
  }
  
  
  export const getStaticPaths: GetStaticPaths = async () => {


    return{
      paths: [
        // { params: { id: 'prod_PEgEKPtNZr1UTB' } }
      ],
      fallback: "blocking",

    }
  }

  

  
  
  export const getStaticProps: GetStaticProps <any, { id: string}> = async ({params}) => {
    // export const getServerSideProps: GetServerSideProps <any, { id: string}> = async ({params}) => {
      const productId = params.id;
  
      const product = await stripe.products.retrieve(productId,{
        expand: ['default_price']
      });
  
      const price = product.default_price as Stripe.Price
  
      return {
        props: {
          product: {
          id: product.id,
          name: product.name,
          imageUrl: product.images[0],
  
          price: new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
          }).format(price.unit_amount / 100),
          description: product.description,
          defaultPriceId: price.id
        }
  
      },
        revalidate: 60 * 60 * 1 //1 hour on cache
      }
  
    }
    