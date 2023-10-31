"use client";

import cx from "classnames";
import algoliasearch from "algoliasearch/lite";
import {
  Configure,
  Index,
  InstantSearch,
  SearchBox,
  useInstantSearch,
  useSearchBox,
} from "react-instantsearch";
import CustomInfiniteHits from "@/app/components/hits";
import CustomSearchBox from "./components/searchbox";
import { use, useEffect, useState } from "react";
import {
  MagnifyingGlassCircleIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/20/solid";
import { useShrinkOnScroll } from "./hooks/useShrinkOnScroll";
import { ALGOLIA_INDEX } from "./helpers/algolia";
import { Movie } from "./types";

const searchClient = algoliasearch(
  "PVXYD3XMQP",
  "69636a752c16bee55133304edea993f7"
);

const MoviesList = ({ query }: { query: string }) => {
  const { results } = useInstantSearch();
  const rawCategories = (results.hits as Movie[]).reduce<
    Record<string, Movie[]>
  >((acc, curr) => {
    curr.genres.forEach((genre) => {
      (acc[genre] ||= []).push(curr);
    });
    return acc;
  }, {});

  const categories = Object.entries(rawCategories || {})
    .sort((a, b) => b[1].length - a[1].length)
    .slice(0, 100);

  return (
    <>
      {categories.map(([category, hits]) => (
        <Index indexName="horror_movies">
          <Configure query={query} />

          <CustomInfiniteHits title={category} genre={category} />
        </Index>
      ))}
    </>
  );
};

const Search = () => {
  const [query, setQuery] = useState("");
  const shrink = useShrinkOnScroll(200);
  const [allGenres, setAllGenres] = useState<any[]>([]);
  const scrollToEnd = () => {
    window.scrollTo({
      top: document.body.scrollHeight,
      behavior: "smooth",
    });
  };

  const getAllGenres = async () => {
    const response = await ALGOLIA_INDEX.searchForFacetValues(
      "genres",
      "",
      {}
    ).then((facet) => {
      return facet.facetHits;
    });

    return response;
  };

  useEffect(() => {
    getAllGenres().then((data) => {
      console.log(data);
      setAllGenres(data);
    });
  }, []);

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
      <InstantSearch searchClient={searchClient} indexName="horror_movies">
        <MoviesList query={query} />
      </InstantSearch>
    </div>
  );
};

export default Search;
