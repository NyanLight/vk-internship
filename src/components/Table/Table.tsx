import styles from "./Table.module.css";
import { useEffect, useState } from "react";

interface Entry {
  id: number;
}

export function Table({ url }: { url: string }) {
  const [entries, setEntries] = useState<null | Entry[]>(null);
  const [error, setError] = useState<null | string>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getEntries() {
      try {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`Response status: ${response.status}`);
        }
        const json = await response.json();
        setEntries(json);
        setLoading(false);
        console.log(response.status);
      } catch (error) {
        let errorMessage = "Failed to do something exceptional";
        if (error instanceof Error) {
          errorMessage = error.message;
        }
        setError(errorMessage);
        setLoading(false);
      }
    }
    getEntries();
  }, [url]);

  if (error) return <div>Error: {error}!</div>;

  if (loading) return <div>Loading...</div>;

  if (entries) {
    const headings = Object.keys(entries[0]).filter((key) => key !== "id");

    return (
      <table className={styles.table}>
        <tr className={styles.row}>
          {headings.map((heading) => {
            return (
              <th scope="col" className={styles.heading}>
                {heading}
              </th>
            );
          })}
        </tr>
        {entries.map((entry) => {
          return (
            <tr className={styles.row}>
              {Object.entries(entry).map((field) => {
                if (field[0] !== "id")
                  return <td className={styles.data}>{field[1]}</td>;
              })}
            </tr>
          );
        })}
      </table>
    );
  }
}
