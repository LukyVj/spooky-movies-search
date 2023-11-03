"use client";

import cx from "classnames";
import dynamic from "next/dynamic";

import { useShrinkOnScroll } from "../hooks/useShrinkOnScroll";

const PosterWall = dynamic(() => import("./poster-wall"), {
  ssr: false,
});

export default function Hero() {
  const shrink = useShrinkOnScroll(200);

  return (
    <section
      className={cx(
        "h-[600px] grid place-items-center relative z-10 overflow-hidden transition-height duration-500 ease-in-out"
      )}
    >
      <PosterWall />

      <header
        className="h-[600px] w-full grid place-items-center relative z-10 overflow-hidden"
        style={{
          background:
            "linear-gradient(180deg, rgba(20,20,20,0.8) 0%, rgba(20,20,20,1) 70%,  rgba(20,20,20,1) 100%)",
        }}
      >
        <h1 className="sr-only">Horror Movies Database</h1>
        <img
          src="/SpookyMovieSearch.png"
          className={cx(
            "object-cover object-center transition-all duration-500 ease-in-out w-[300px] md:w-[600px]",
            shrink ? "scale-50" : ""
          )}
          alt="Horror Movies Database"
        />
      </header>
    </section>
  );
}
