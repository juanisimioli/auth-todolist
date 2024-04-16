import { useFormStatus } from "react-dom";

const ButtonsEditNoteCard = ({
  setIsEditingNote,
}: {
  setIsEditingNote: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const { pending } = useFormStatus();
  return (
    <div className="flex items-center gap-4 ml-5 mr-2">
      <button
        disabled={pending}
        type="submit"
        className="disabled:bg-gray-300 px-4 h-8 rounded-md font-bold transition duration-300 bg-green-500 hover:bg-green-600"
      >
        Save
      </button>
      <button
        disabled={pending}
        onClick={() => setIsEditingNote((prev) => !prev)}
        className="disabled:bg-gray-300 px-2 h-8 rounded-md font-bold hover:bg-red-600 transition duration-300 bg-red-500 hover:bg-red-600"
      >
        Clear
      </button>
    </div>
  );
};

export default ButtonsEditNoteCard;
