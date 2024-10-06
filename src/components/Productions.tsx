import { ProductsQuery } from "../model/product.model";
import QueryInfiniteService from "../hook/useInfiniteQuery";

import { useVirtualizer } from "@tanstack/react-virtual";
import { useEffect, useRef } from "react";

const totalItems = 194;
const fetchProductService = async (
  pageParam: number
): Promise<ProductsQuery> => {
  const res = await fetch(
    `https://dummyjson.com/products?limit=10&skip=${pageParam}&select=title,price`
  );
  return res.json();
};
function Productions() {
  const parentRef = useRef(null);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
  } = QueryInfiniteService(fetchProductService, ["products"], totalItems);

  const allRows = data ? data.pages.flatMap((d) => d.products) : [];


  const rowVirtualizer = useVirtualizer({
    count: hasNextPage ? allRows.length + 1 : allRows.length,
    getScrollElement: () => parentRef?.current,
    estimateSize: () => 35,
    overscan: 5,
  });

  useEffect(() => {
    const [lastItem] = [...rowVirtualizer.getVirtualItems()].reverse();
    console.log({lastItem, getVirtualItems: rowVirtualizer.getVirtualItems()})
    if (!lastItem) {
      return;
    }

    if (
      lastItem.index >= allRows.length - 1 &&
      hasNextPage &&
      !isFetchingNextPage
    ) {
      fetchNextPage();
    }
  }, [
    hasNextPage,
    fetchNextPage,
    allRows.length,
    isFetchingNextPage,
    rowVirtualizer.getVirtualItems(),
  ]);

  return (
    <>
      <button
        disabled={!hasNextPage || isFetching}
        onClick={() => fetchNextPage()}
      >
        {isFetching ? "Loading..." : "Load More"}
      </button>
      <h1>Productions</h1>

      <div
        ref={parentRef}
        style={{
          height: `400px`,
          overflow: "auto", // Make it scroll!
        }}
      >
        <div
          style={{
            height: `${rowVirtualizer.getTotalSize()}px`,
            width: "100%",
            position: "relative",
          }}
        >
          {rowVirtualizer.getVirtualItems().map((virtualRow) => {
            const isLoaderRow = virtualRow.index > allRows.length - 1;
            const product = allRows[virtualRow.index];
            return (
              <div
                key={virtualRow.index}
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: `${virtualRow.size}px`,
                  transform: `translateY(${virtualRow.start}px)`,
                }}
              >
                {isLoaderRow ? (
                  hasNextPage ? (
                    "Loading more..."
                  ) : (
                    "Nothing more to load"
                  )
                ) : (
                  <div>
                    <span>{product.id}--</span>
                    <span>{product.title}---</span>
                    <span>{product.price}</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}

export default Productions;
