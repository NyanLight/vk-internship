import { useState, useEffect } from "react";
import { entriesStore } from "../EntiresStore"; 

interface FetchEntriesResult {
  error: string | null;
  loading: boolean;
  next: string | null;
  hasMore: boolean;
  fetchData: (url: string) => Promise<void>;
}

export const useFetchEntries = (initialUrl: string): FetchEntriesResult => {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [next, setNext] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState<boolean>(true);

  const fetchData = async (url: string) => {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
      }
      const json = await response.json();
      entriesStore.addEntries(json.games);
      if (json.next !== null) {
        setNext(json.next);
      } else {
        setHasMore(false);
      }
      setLoading(false);
    } catch (error) {
      let errorMessage = "Failed to do something exceptional";
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      setError(errorMessage);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(initialUrl);
  }, [initialUrl]);

  return { error, loading, next, hasMore, fetchData };
};