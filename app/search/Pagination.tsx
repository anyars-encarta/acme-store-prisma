"use client";

import { useRouter, useSearchParams } from "next/navigation";

import { modifySearchParams } from "@/lib/utils";

const Pagination = ({lastPageReached}: {lastPageReached: number}) => {
  const searchParams = Object.fromEntries(useSearchParams()) as any;
  const page = parseInt(searchParams.page) || 1;

  const router = useRouter();

  const handlePageChange = (newPage: number) => {
    const query = modifySearchParams(searchParams, {
      ...searchParams,
      page: newPage,
    });

    router.push(`/search?${query}`);
  };

  return (
    <div className="flex justify-center gap-4">
      <button
        className="text-black disabled:text-gray-400"
        onClick={() => handlePageChange(page - 1)}
        disabled={page === 1}
      >
        Previous
      </button>
      {page}
      <button className="text-black disabled:text-gray-400" onClick={() => handlePageChange(page + 1)} disabled={lastPageReached === 0}>
        Next
      </button>
    </div>
  );
};

export default Pagination;
