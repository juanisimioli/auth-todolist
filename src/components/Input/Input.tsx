type InputProps = {
  label: string;
  name: string;
  type: string;
  color: "violet" | "green";
  required?: boolean;
  autoFocus?: boolean;
  autocomplete?: string;
};

const Input = ({
  label,
  name,
  autoFocus,
  required,
  type,
  color = "green",
  autocomplete,
}: InputProps) => {
  const focusBorderColor =
    color === "violet" ? "border-violet-500" : "border-green-500";

  return (
    <div className="flex flex-col gap-4 my-2">
      <label htmlFor={name}>{label}</label>
      <input
        className={`w-full max-w-md px-2 py-2 border border-gray-700 rounded-md text-white text-base focus:outline-none ${focusBorderColor}
        -500`}
        autoFocus={autoFocus}
        required={required}
        name={name}
        type={type}
        autoComplete={autocomplete}
      />
    </div>
  );
};

export default Input;
