import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { polar, checkout, portal } from "@polar-sh/better-auth"; 

import { db } from "@/db";
import * as schema from "@/db/schema";

import { polarClient } from "./polar"; 


export const auth = betterAuth({
    plugins: [
        polar({ 
            client: polarClient, 
            createCustomerOnSignUp: true, 
            use: [ 
                checkout({ 
                    authenticatedUsersOnly: true,
                    successUrl: "/upgrade", 
                }), 
                portal(), 
                // usage(), 
                // webhooks({ 
                //     secret: process.env.POLAR_WEBHOOK_SECRET, 
                //     onCustomerStateChanged: (payload) => // Triggered when anything regarding a customer changes
                //     onOrderPaid: (payload) => // Triggered when an order was paid (purchase, subscription renewal, etc.)
                //     ...  // Over 25 granular webhook handlers
                //     onPayload: (payload) => // Catch-all for all events
                // }) 
            ], 
        }) 
    ],
    database: drizzleAdapter(db, {
        provider: "pg",
        schema: {
            ...schema
        }
    }),
    emailAndPassword: {
        enabled: true
    },
    socialProviders: {
        github: {
            clientId: process.env.GITHUB_CLIENT_ID as string, 
            clientSecret: process.env.GITHUB_CLIENT_SECRET as string, 
        },
        google: { 
            clientId: process.env.GOOGLE_CLIENT_ID as string, 
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string, 
        }, 
    }
});