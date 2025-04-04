"use server";

import { prisma } from "../prisma";

import { unstable_cache as cache, revalidateTag } from "next/cache";

interface IProduct {
  name: string;
  category: string;
  price: number;
  description: string;
  images?: string[];
}

export const createProduct = async (input: IProduct) => {
  try {
    const { name, category, price, description, images } = input;

    const newProduct = await prisma.product.create({
      data: {
        name,
        category,
        price,
        description,
        images: {
          create: images?.map((url) => ({ url })),
        },
      },
    });

    return newProduct;
  } catch (e) {
    console.error("Error creating new product", e);
    throw new Error("Error creating new product");
  }
};

export const getAllProducts = async ({
  page = 1,
  name,
  minPrice,
  category,
}: {
  page?: number;
  name?: string;
  minPrice?: string;
  category?: string;
}) => {
  const resultsPerPage = 5;
  const skip = (page - 1) * resultsPerPage;
  const filterCategory = category !== "all";

  try {
    const allProducts = await prisma.product.findMany({
      include: {
        images: true,
        reviews: true,
        _count: {
          select: { reviews: true },
        }
      },
      where: {
        name: {
          contains: name,
          mode: "insensitive",
        },
        ...(filterCategory && { category }),
        ...(minPrice && {
          price: {
            gte: parseInt(minPrice)
          }
        })
      },
      skip,
      take: resultsPerPage,
    });

    const products = allProducts.map((product) => ({
      ...product,
      rating:
        Math.floor(
          product.reviews.reduce((acc, review) => acc + review.rating, 0) /
            product.reviews.length
        ) || 0,
      image: product.images[0]?.url || null,
    }));

    return products;
  } catch (e) {
    console.error("Error fetching products", e);
    throw new Error("Error fetching products");
  }
};

const _getProductById = async (id: number) => {
  try {
    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        images: true,
        reviews: true,
      },
    });

    return product;
  } catch (e) {
    console.error("Error fetching product", e);
    throw new Error("Error fetching product");
  }
};

export const getProductById = cache(_getProductById, ["getProductById"], {
  tags: ["Product"],
  revalidate: 60,
});

export const updateProduct = async (id: number, input: IProduct) => {
  try {
    const { name, category, price, description, images } = input;

    const updatedProduct = await prisma.product.update({
      where: { id },
      data: {
        name,
        category,
        price,
        description,
        images: {
          deleteMany: {},
          create: images?.map((url) => ({ url })),
        },
      },
    });

    revalidateTag("Product");

    return updatedProduct;
  } catch (e) {
    console.error("Error updating product", e);
    throw new Error("Error updating product");
  }
};

export const deleteProduct = async (id: number) => {
  try {
    await prisma.product.delete({
      where: { id },
    });

    revalidateTag("Product");

    return true;
  } catch (e) {
    console.error("Error deleting product", e);
    throw new Error("Error deleting product");
  }
};
