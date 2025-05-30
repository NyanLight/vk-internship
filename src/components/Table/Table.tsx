import styles from "./Table.module.css";

interface Entry {
  id: number;
}

export function Table({ entries }: { entries: Entry[] }) {
  const headings = Object.keys(entries[0]).filter((key) => key !== "id");

  return (
    <table className={styles.table}>
      <tr className={styles.row}>
        {headings.map((heading) => {
          return <th className={styles.heading}>{heading}</th>;
        })}
      </tr>
      {entries.map((entry) => {
        return (
          <tr>
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
