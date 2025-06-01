import { entriesStore } from "../EntiresStore";

interface InfiniteScrollProps {
  next: string | null;
  hasMore: boolean;
  fetchData: (url: string) => Promise<void>;
}

interface InfiniteScrollResult {
  nextHandler: () => void;
  dataLength: number;
  hasMore: boolean;
  loader: string;
}

export const useInfiniteScroll = ({ next, hasMore, fetchData }: InfiniteScrollProps): InfiniteScrollResult => {
  const nextHandler = () => {
    if (typeof next === "string") {
      fetchData(next);
    }
  };

  const dataLength = entriesStore.entries?.length || 0;

  return {
    nextHandler,
    dataLength,
    hasMore,
    loader: 'Loading next chunk...'
  };
};