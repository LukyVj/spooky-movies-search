"use client";

import cx from "classnames";
import algoliasearch from "algoliasearch/lite";
import {
  Configure,
  InstantSearch,
  RefinementList,
  SearchBox,
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
import CustomRefinementList from "./components/custom-refinement-list";

const searchClient = algoliasearch(
  "PVXYD3XMQP",
  "69636a752c16bee55133304edea993f7"
);

const Search = () => {
  const [query, setQuery] = useState("");
  const shrink = useShrinkOnScroll(200);
  const [allGenres, setAllGenres] = useState<any[]>([]);
  const [pickedYear, setPickedYear] = useState("");
  const [pickedGenre, setPickedGenre] = useState("");
  const [pickedDirector, setPickedDirector] = useState("");
  const [currentFilters, setCurrentFilters] = useState<any[]>([]);

  const [searchRefined, setSearchRefined] = useState(false);

  const scrollToEnd = () => {
    window.scrollTo({
      top: 500,
      behavior: "smooth",
    });
  };

  const getAllGenres = async () => {
    const response = await ALGOLIA_INDEX.searchForFacetValues("genres", "", {
      maxFacetHits: 100,
    }).then((facet) => {
      return facet.facetHits;
    });

    return response;
  };

  useEffect(() => {
    getAllGenres().then((data) => {
      setAllGenres(data);
    });
  }, []);

  useEffect(() => {
    if (pickedGenre !== "") {
      setSearchRefined(true);
    } else {
      setSearchRefined(false);
    }
  }, [pickedGenre, pickedDirector]);

  useEffect(() => {
    setCurrentFilters([
      `release_year: ${pickedYear}`,
      pickedGenre !== "" ? `genres: ${pickedGenre}` : ``,
      pickedDirector !== "" ? `directors.name: ${pickedDirector}` : ``,
    ]);
  }, [pickedYear, pickedGenre, pickedDirector]);

  return (
    <div className="relative">
      <div
        className={cx(
          "w-full flex items-center justify-center bottom-0 left-0 transition-all duration-500 ease-in-out z-30 backdrop-filter backdrop-blur-lg bg-black bg-opacity-5",
          shrink ? "sticky top-0 py-4" : "-translate-y-24 relative"
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
            className="w-full h-[50px] bg-black rounded-lg shadow-lg left-0 right-0 mx-auto px-4 py-2 ring ring-red-700 focus:outline-none focus:ring-2 focus:border-4 focus:border-red-950 placeholder-gray-500 text-white text-xl"
            placeholder="Search for a movie, an actor, director..."
          />

          <MagnifyingGlassIcon className="w-6 h-6 text-red-700 absolute right-4 top-1/2 transform -translate-y-1/2" />
        </div>
        <CustomRefinementList
          attribute="release_year"
          placeholder="Year"
          onChange={(e) => {
            setPickedYear(e.target.value);
          }}
        />
        <CustomRefinementList
          attribute="genres"
          placeholder="Genre"
          onChange={(e) => {
            setPickedGenre(e.target.value);
          }}
        />

        <CustomRefinementList
          attribute="directors.name"
          placeholder="Directors"
          onChange={(e) => {
            setPickedDirector(e.target.value);
          }}
        />
      </div>
      {searchRefined ? (
        <InstantSearch searchClient={searchClient} indexName="horror_movies">
          <Configure query={query} facetFilters={currentFilters} />

          <CustomInfiniteHits title={"All Movies"} />
        </InstantSearch>
      ) : (
        <div className="relative">
          {allGenres.map((genre) => {
            return (
              <InstantSearch
                searchClient={searchClient}
                indexName="horror_movies"
              >
                <Configure query={query} facetFilters={currentFilters} />

                <CustomInfiniteHits title={genre.value} genre={genre.value} />
              </InstantSearch>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Search;
