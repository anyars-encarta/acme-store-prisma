"use server";

import { prisma } from "../prisma";

export interface IReview {
    productId: number;
    name: string;
    rating: number;
    content: string;
};

export const createReview = async (reviewInput: IReview) => {
    try {
        const { name, rating, content, productId } = reviewInput;
    
        const createdReview = await prisma.review.create({
            data: {
                name,
                rating,
                content,
                product: {
                    connect: {
                        id: productId,
                    }
                }
            }
        });

        return createdReview;
    } catch (e) {
        console.error("Error creating a review", e);
        throw new Error("Error creating a review");
    }
};

export const reviewCount = (id: string) => {
    try {
        const counted = prisma.review.count ({
            where: {
                productId: parseInt(id),
            }
        })
    
        return counted;
    } catch (e) {
        console.error("Error counting reviews", e);
        throw new Error("Error counting reviews");
    }
}