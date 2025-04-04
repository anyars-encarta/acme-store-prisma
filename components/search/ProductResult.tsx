import Link from "next/link";

import Stars from "@/components/product/Stars";

export default async function ProductResult({ product }: { product: any }) {
  const { id, name, rating, image } = product;

  return (
    <div className="bg-white rounded-lg shadow-sm dark:bg-gray-950 overflow-hidden">
      <Link className="block" href={`/product/view/${id}`}>
        <img
          src={image}
          alt="product"
          className="w-full h-full object-cover"
        />
        <div className="p-4 space-y-2">
          <h3 className="font-semibold text-lg">{name}</h3>
          <div className="flex items-center gap-1">
            <Stars rating={rating} />
            <span className="text-sm text-gray-500 dark:text-gray-400 ml-2">
              {rating}
            </span>

            <span className="text-sm text-gray-500 dark:text-gray-400 ml-2">
              Reviews: {product._count.reviews}
            </span>
          </div>
        </div>
      </Link>
    </div>
  );
}
