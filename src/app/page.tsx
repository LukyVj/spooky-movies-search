import dynamic from "next/dynamic";

const Hero = dynamic(() => import("./components/hero"), {
  ssr: false,
});

const Search = dynamic(() => import("./search"), {
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
