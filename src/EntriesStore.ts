import { action, makeObservable, observable } from "mobx";

interface Entry {
  id: number;
}

class EntriesStore {
  entries: Entry[] | null = null;

  constructor() {
    makeObservable(this, {
      entries: observable,
      addEntries: action,
    });
  }

  addEntries(newEntries: Entry[]) {
    if (this.entries) {
      this.entries.push(...newEntries);
    } else {
      this.entries = newEntries;
    }
  }
}

export const entriesStore = new EntriesStore();
