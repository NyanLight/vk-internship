import type { MouseEvent } from "react";
import { observer } from "mobx-react-lite";
import { entriesStore } from "../../EntriesStore";

export const Form = observer(() => {
  const handleSubmit = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    console.log("Submitted!");
  };

  const fields = [];

  if (entriesStore.entries) {
    const entry = entriesStore.entries[0];
    Object.keys(entry).map((key) => {
      if (key !== "id") fields.push(key);
    });
  }

  if (fields.length === 0) return <div>Waiting for fields...</div>;
  if (fields.length > 0)
    return (
      <form>
        <div>Form</div>
        <button onClick={(e) => handleSubmit(e)}>Submit</button>
      </form>
    );
});
