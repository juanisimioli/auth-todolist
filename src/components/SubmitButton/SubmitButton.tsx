"use client";
import { useFormStatus } from "react-dom";

type SubmitButton = {
  label: string;
  labelPending: string;
  color: "violet" | "green";
};

const SubmitButton = ({ label, labelPending, color }: SubmitButton) => {
  const { pending } = useFormStatus();

  let theme;
  switch (color) {
    case "violet":
      theme = "bg-violet-500 hover:bg-violet-600";
      break;
    case "green":
      theme = "bg-green-500 hover:bg-green-600";
      break;
    default:
      theme = "bg-green-500 hover:bg-green-600";
  }

  return (
    <button
      disabled={pending}
      type="submit"
      className={`disabled:bg-gray-300 disabled:text-gray-400 px-4 h-8 w-full rounded-md cursor-pointer font-bold transition duration-300 text-gray-100 ${theme}`}
    >
      {pending ? labelPending : label}
    </button>
  );
};

export default SubmitButton;
