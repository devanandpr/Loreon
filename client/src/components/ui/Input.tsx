import { InputHTMLAttributes } from "react";

export default function Input(
  props: InputHTMLAttributes<HTMLInputElement>
) {
  return (
    <input
      {...props}
      className="
        w-full
        rounded-xl
        border
        border-zinc-800
        bg-zinc-900
        px-5
        py-3
        outline-none
        transition
        focus:border-white
      "
    />
  );
}