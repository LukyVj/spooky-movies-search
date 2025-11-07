"use client";

import cx from "classnames";

import { useShrinkOnScroll } from "../hooks/useShrinkOnScroll";

export default function Hero() {
  const shrink = useShrinkOnScroll(200);

  return (
    <section
      className={cx(
        "h-[400px] 3xl:h-[600px] grid place-items-center relative z-10 overflow-hidden transition-height duration-500 ease-in-out"
      )}
    >
      <header className="h-[400px] 3xl:h-[600px] w-full grid place-items-center relative z-10 overflow-hidden">
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
