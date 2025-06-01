import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { Header } from "./components/Header/Header";
import { Table } from "./components/Table/Table";
import { Form } from "./components/Form/Form";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Header />
    <main>
      <Table url="http://localhost:3000/chunk1" />
      <Form />
    </main>
  </StrictMode>
);
