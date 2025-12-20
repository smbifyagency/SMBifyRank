// Stripe Coupon Validation API
// POST /api/stripe/validate-coupon - Validate coupon code

import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';

interface CouponValidationResponse {
    valid: boolean;
    discount?: {
        type: 'percent' | 'amount';
        value: number;
        name: string;
    };
    error?: string;
}

export async function POST(request: Request) {
    try {
        if (!stripe) {
            return NextResponse.json(
                { valid: false, error: 'Stripe is not configured' },
                { status: 500 }
            );
        }

        const body = await request.json();
        const { couponCode } = body;

        if (!couponCode || typeof couponCode !== 'string') {
            return NextResponse.json(
                { valid: false, error: 'Coupon code is required' },
                { status: 400 }
            );
        }

        const trimmedCode = couponCode.trim();

        // First try as a promotion code (user-facing codes)
        try {
            const promoCodes = await stripe.promotionCodes.list({
                code: trimmedCode,
                active: true,
                limit: 1,
                expand: ['data.coupon'],
            });

            if (promoCodes.data.length > 0) {
                const promo = promoCodes.data[0];
                // Access coupon with type assertion - Stripe types don't always match API response
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const coupon = (promo as any).coupon;

                const response: CouponValidationResponse = {
                    valid: true,
                    discount: {
                        type: coupon.percent_off ? 'percent' : 'amount',
                        value: coupon.percent_off || (coupon.amount_off ? coupon.amount_off / 100 : 0),
                        name: coupon.name || promo.code,
                    },
                };

                return NextResponse.json(response);
            }
        } catch {
            // Promotion code not found, try as direct coupon
        }

        // Try as a direct coupon ID
        try {
            const coupon = await stripe.coupons.retrieve(trimmedCode);

            if (coupon && coupon.valid) {
                const response: CouponValidationResponse = {
                    valid: true,
                    discount: {
                        type: coupon.percent_off ? 'percent' : 'amount',
                        value: coupon.percent_off || (coupon.amount_off ? coupon.amount_off / 100 : 0),
                        name: coupon.name || trimmedCode,
                    },
                };

                return NextResponse.json(response);
            }
        } catch {
            // Coupon not found
        }

        // No valid coupon found
        return NextResponse.json({
            valid: false,
            error: 'Invalid or expired coupon code',
        });

    } catch (error) {
        console.error('Coupon validation error:', error);
        return NextResponse.json(
            { valid: false, error: 'Failed to validate coupon' },
            { status: 500 }
        );
    }
}
