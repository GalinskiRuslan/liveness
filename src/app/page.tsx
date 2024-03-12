import Link from "next/link";

const Page = () => {
  return (
    <main>
      <Link href="/liveness" prefetch={false}>Liveness</Link>
    </main>
  );
};

export default Page;
