import styles from "./Table.module.css";
import { useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";

interface Entry {
  id: number;
}

export function Table({ url }: { url: string }) {
  const [entries, setEntries] = useState<null | Entry[]>(null);
  const [error, setError] = useState<null | string>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [next, setNext] = useState<null | string>(null);
  const [hasMore, setHasMore] = useState<boolean>(true);

  const fetchData = async (url: string) => {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
      }
      const json = await response.json();
      if (entries === null) {
        setEntries(json.games);
      } else {
        setEntries([...entries, ...json.games]);
      }
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
    fetchData(url);
  }, []);

  if (error) return <div>Error: {error}!</div>;

  if (loading) return <div>Loading...</div>;

  if (entries) {
    const headings = Object.keys(entries[0])
      .filter((key) => key !== "id")
      .slice(0, 15);

    return (
      <InfiniteScroll
        next={() => {
          if (typeof next === "string") fetchData(next);
        }}
        dataLength={entries.length}
        hasMore={hasMore}
        loader={<div>Loading...</div>}
      >
        <table className={styles.table}>
          <thead>
            <tr className={styles.row}>
              {headings.map((heading) => {
                return (
                  <th scope="col" className={styles.heading}>
                    {heading}
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {entries.map((entry) => {
              return (
                <tr className={styles.row}>
                  {Object.entries(entry).map((field) => {
                    if (headings.includes(field[0]))
                      return <td className={styles.data}>{field[1]}</td>;
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </InfiniteScroll>
    );
  }
}
