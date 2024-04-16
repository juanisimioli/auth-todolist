"use client";
import { useRef } from "react";
import { useFormState } from "react-dom";
import { createTask } from "@/actions/tasks/createTask";
import Input from "@/components/Input/Input";
import SubmitButton from "@/components/SubmitButton/SubmitButton";

const NoteForm = () => {
  const ref = useRef<HTMLFormElement>(null);

  const handleActionCreate = async (prev: unknown, formData: FormData) => {
    const response = await createTask(prev, formData);
    if (response?.success && ref.current instanceof HTMLFormElement) {
      ref.current.reset();
    }
    return response;
  };

  const [errorCreate, actionCreate] = useFormState(
    handleActionCreate,
    undefined
  );

  return (
    <div className="w-full max-w-md">
      <form ref={ref} className="flex flex-col gap-2" action={actionCreate}>
        <Input
          label="Title"
          name="title"
          type="text"
          color="green"
          autoFocus
          required
        />
        <Input
          label="Content"
          name="content"
          type="text"
          color="green"
          required
        />
        <p>{errorCreate?.errorMessage}</p>
        <SubmitButton label="Create" labelPending="Creating" color="green" />
      </form>
    </div>
  );
};

export default NoteForm;
