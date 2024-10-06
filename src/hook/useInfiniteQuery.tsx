import { useInfiniteQuery,UseInfiniteQueryOptions , UseInfiniteQueryResult} from "@tanstack/react-query";

export const QueryInfiniteService = <TData,>(
  queryCb: (pageParams:number) => Promise<TData>,
  queryKey: unknown[],
  totalItems: number
) => {
  return useInfiniteQuery({
    queryKey: queryKey,
    queryFn: ({ pageParam = 0 }) => queryCb(pageParam),
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) => {
      const totalPages = Math.ceil(totalItems / 10);
      return allPages?.length < totalPages - 1
        ? (allPages.length + 1) * 10
        : undefined;
    },
  });
};

export default QueryInfiniteService;
