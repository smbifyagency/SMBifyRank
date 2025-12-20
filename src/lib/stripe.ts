// Stripe Configuration
import Stripe from 'stripe';

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

if (!stripeSecretKey) {
    console.warn('Missing STRIPE_SECRET_KEY - Stripe features will not work');
}

export const stripe = stripeSecretKey ? new Stripe(stripeSecretKey, {
    apiVersion: '2024-11-20.acacia',
    typescript: true,
}) : null;

// Stripe Price IDs (set these in your environment)
export const STRIPE_PRICES = {
    monthly: process.env.STRIPE_MONTHLY_PRICE_ID || '',
    lifetime: process.env.STRIPE_LIFETIME_PRICE_ID || '',
};

// Stripe Publishable Key for client-side
export const STRIPE_PUBLISHABLE_KEY = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '';
