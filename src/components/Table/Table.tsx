import styles from "./Table.module.css";
import InfiniteScroll from "react-infinite-scroll-component";
import { observer } from "mobx-react-lite";
import { entriesStore } from "../../EntriesStore";
import { useFetchEntries } from "../../hooks/useFetchEntries";
import { useInfiniteScroll } from "../../hooks/useInfiniteScroll";

export const Table = observer(({ url }: { url: string }) => {
  const { error, loading, next, hasMore, fetchData } = useFetchEntries(url);
  const {
    nextHandler,
    dataLength,
    hasMore: scrollHasMore,
    loader,
  } = useInfiniteScroll({
    next,
    hasMore,
    fetchData,
  });

  if (error) return <div>Error: {error}!</div>;

  if (loading) return <div>Loading...</div>;

  if (entriesStore.entries) {
    const headings = Object.keys(entriesStore.entries[0])
      .filter((key) => key !== "id")
      .slice(0, 15);

    return (
      <InfiniteScroll
        next={nextHandler}
        dataLength={dataLength}
        hasMore={scrollHasMore}
        loader={loader}
      >
        <table className={styles.table}>
          <thead>
            <tr className={styles.row}>
              {headings.map((heading) => (
                <th scope="col" className={styles.heading} key={heading}>
                  {heading}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {entriesStore.entries.map((entry) => (
              <tr className={styles.row}>
                {Object.entries(entry).map((field) => {
                  if (headings.includes(field[0]))
                    return (
                      <td className={styles.data}>
                        {field[1]}
                      </td>
                    );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </InfiniteScroll>
    );
  }
  return null;
});
