"use client";

import Image from "next/image";
import { useAppSelector } from "@/hooks";

interface PhotoProps {}

const Photo = ({}: PhotoProps) => {
  const imageData = useAppSelector((state) => state.app.imageData);

  if (imageData) {
    return <Image src={imageData} width={200} height={200} alt="" />;
  }

  return null;
};

export default Photo;
