import { NextApiRequest, NextApiResponse } from "next";
import { stripe } from "../../lib/stripe";

export default async function handler(req: NextApiRequest, res: NextApiResponse){
    const{sessionId} = req.body
    const{priceId} = req.body


    if(req.method !== 'GET' ) {
        return res.status(405).json({ error: 'Method not allowed.' });

    }

    if(!sessionId){
        return res.status(400).json({ error: 'Session not found.' });
    }

    const successurl= `${process.env.NEXT_URL}/carshop?sessions?session_id={CHECKOUT_SESSION_ID}/line_items`;
    //const CHECKOUT_SESSION_ID = `${process.env.NEXT_URL}/checkout/sessions?session_id={CHECKOUT_SESSION_ID}/line_items`;
    // const cancelurl = `${process.env.NEXT_URL}/`
    // return res.json({message: "Hello Esmaily"})
    
    // const checkoutSession = await stripe.checkout.sessions.create({
    //     success_url: successurl,
    //     cancel_url: cancelurl,
    //     mode: 'payment',
    //     line_items: [{
    //         price: priceId,
    //         quantity: 1,
    //     }],   
    // })

    const cartLineItems = await stripe.checkout.sessions.listLineItems(sessionId,priceId)

    return res.status(201).json({
        
        cart: cartLineItems.object
    });

    
    
}