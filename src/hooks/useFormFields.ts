import { useState, useEffect } from "react";
import { entriesStore } from "../EntriesStore";

export const useFormFields = () => {
  const [fields, setFields] = useState<string[]>([]);

  useEffect(() => {
    if (entriesStore.entries && entriesStore.entries.length > 0) {
      const entry = entriesStore.entries[0];
      const newFields = Object.keys(entry).filter((key) => key !== "id");
      setFields(newFields);
    }
  }, [entriesStore.entries]);

  return fields;
};
