import dynamic from "next/dynamic";
import Button from "@/ui/Button/Button";
import Photo from "@/ui/Photo/Photo";

const Liveness = dynamic(
  () => {
    return import("@/Liveness");
  },
  { ssr: false, loading: () => <p>Loading...</p> }
);

const Page = () => {
  return (
    <main>
      <Button />
      <Photo />
      <Liveness />
    </main>
  );
};

export default Page;
