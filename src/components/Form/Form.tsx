import { type FormEvent } from "react";
import { observer } from "mobx-react-lite";
import styles from "./Form.module.css";
import { useFormFields } from "../../hooks/useFormFields";
import { useFormState } from "../../hooks/useFormState";
import { useApiSubmit } from "../../hooks/useApiSubmit";

export const Form = observer(() => {
  const fields = useFormFields();
  const { loading, setLoading, formRef, resetForm } = useFormState();
  const { submitForm } = useApiSubmit("http://localhost:3000/chunk10/games");

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
      await submitForm(newEntry);
      resetForm();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

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
