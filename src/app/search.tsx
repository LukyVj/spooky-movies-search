"use client";

import cx from "classnames";
import algoliasearch from "algoliasearch/lite";
import {
  Configure,
  InstantSearch,
  SearchBox,
  useSearchBox,
} from "react-instantsearch";
import CustomInfiniteHits from "@/app/components/hits";
import CustomSearchBox from "./components/searchbox";
import { useState } from "react";
import {
  MagnifyingGlassCircleIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/20/solid";
import { useShrinkOnScroll } from "./hooks/useShrinkOnScroll";

const searchClient = algoliasearch(
  "PVXYD3XMQP",
  "69636a752c16bee55133304edea993f7"
);

const Search = () => {
  const [query, setQuery] = useState("");
  const shrink = useShrinkOnScroll(200);

  const scrollToEnd = () => {
    window.scrollTo({
      top: document.body.scrollHeight,
      behavior: "smooth",
    });
  };

  return (
    <div className="relative">
      <div
        className={cx(
          "w-full absolute z-20 flex items-center justify-center top-0 left-0 transition-all duration-500 ease-in-out",
          shrink ? "" : "-translate-y-24"
        )}
      >
        <div
          className={cx(
            "h-full relative transition-[width] duration-500 ease-in-out",
            shrink ? "w-1/2" : "w-[420px]"
          )}
        >
          <input
            type="text"
            onClick={scrollToEnd}
            onChange={(e) => {
              setQuery(e.target.value);
            }}
            className="w-full h-[50px] bg-black rounded-lg shadow-lg left-0 right-0 mx-auto px-4 py-2 ring ring-red-700 focus:outline-none focus:ring-2 focus:border-4 focus:border-red-950"
          />

          <MagnifyingGlassIcon className="w-6 h-6 text-red-700 absolute right-4 top-1/2 transform -translate-y-1/2" />
        </div>
      </div>
      <InstantSearch searchClient={searchClient} indexName="movies_copy">
        <Configure query={query} />

        <CustomInfiniteHits title="Movies" genre="Horror" />
      </InstantSearch>

      <InstantSearch searchClient={searchClient} indexName="movies_copy">
        <Configure query={query} />

        <CustomInfiniteHits title="Shows" />
      </InstantSearch>
    </div>
  );
};

export default Search;
