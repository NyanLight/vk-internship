import { useState, type FormEvent, useRef } from "react";
import { observer } from "mobx-react-lite";
import styles from "./Form.module.css";
import { entriesStore } from "../../EntriesStore";

export const Form = observer(() => {
  const [loading, setLoading] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget || formRef.current!);
    const newEntry: { [key: string]: string } = {};

    fields.forEach((field) => {
      const value = formData.get(field);
      if (value) {
        newEntry[field] = value as string;
      } else {
        alert(`${field} is required!`);
        setLoading(false);
        return;
      }
    });

    newEntry.id = Date.now().toString();

    try {
      const response = await fetch("http://localhost:3000/chunk10/games", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newEntry),
      });

      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
      }

      const createdEntry = await response.json();
      entriesStore.addEntries([createdEntry]);

      if (formRef.current) formRef.current.reset();
    } catch (error) {
      console.error("Failed to submit:", error);
    } finally {
      setLoading(false);
    }
  };

  const fields: string[] = [];

  if (entriesStore.entries) {
    const entry = entriesStore.entries[0];
    Object.keys(entry).forEach((key) => {
      if (key !== "id") fields.push(key);
    });
  }

  if (fields.length === 0) return <div>Waiting for fields...</div>;

  return (
    <form className={styles.form} onSubmit={handleSubmit} ref={formRef}>
      <div className={styles.fields}>
        {fields.map((field) => (
          <div key={field} className={styles.field}>
            <label className={styles.label} htmlFor={field}>
              {field}:
            </label>
            <input
              className={styles.input}
              name={field}
              id={field}
              type="text"
              required
            />
          </div>
        ))}
      </div>
      <div className={styles.btnWrapper}>
        <button className={styles.submitBtn} type="submit" disabled={loading}>
          {loading ? "Submitting..." : "Submit"}
        </button>
      </div>
    </form>
  );
});
