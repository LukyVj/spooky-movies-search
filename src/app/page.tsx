import dynamic from "next/dynamic";
import Search from "./search";

const Hero = dynamic(() => import("./components/hero"), {
  ssr: false,
});

export default function Home() {
  return (
    <main>
      <Hero />
      <Search />
    </main>
  );
}
