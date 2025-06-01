import { entriesStore } from "../EntriesStore";

export const useApiSubmit = (
  apiUrl: string = "http://localhost:3000/chunk10/games"
) => {
  const submitForm = async (newEntry: { [key: string]: string }) => {
    try {
      const response = await fetch(apiUrl, {
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
      return createdEntry;
    } catch (error) {
      console.error("Failed to submit:", error);
      throw error;
    }
  };

  return { submitForm };
};
