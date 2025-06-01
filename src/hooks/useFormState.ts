import { useState, useRef } from "react";

export const useFormState = () => {
  const [loading, setLoading] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  const resetForm = () => {
    if (formRef.current) formRef.current.reset();
  };
  return { loading, setLoading, formRef, resetForm };
};
