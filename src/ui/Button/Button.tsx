"use client";

import { useAppDispatch } from "@/hooks";
import { setLiveness } from "@/store/appSlice";

interface ButtonProps {}

const Button = ({}: ButtonProps) => {
  const dispatch = useAppDispatch();

  return (
    <button onClick={() => dispatch(setLiveness({ isOpen: true }))}>
      open
    </button>
  );
};

export default Button;
