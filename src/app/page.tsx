"use client";

import dynamic from "next/dynamic";
import {
  Configure,
  CurrentRefinements,
  Highlight,
  Index,
  InstantSearch,
  SearchBox,
  useCurrentRefinements,
} from "react-instantsearch";
import algoliasearch from "algoliasearch/lite";
import { forwardRef, useEffect, useState } from "react";
import { Movie } from "./types";
import cx from "classnames";
import Modal from "./components/modal";
import { useShrinkOnScroll } from "./hooks/useShrinkOnScroll";
import { MagnifyingGlassIcon, StarIcon } from "@heroicons/react/20/solid";
import CustomRefinementList from "./components/custom-refinement-list";
import { useInfinitelyScrolledHits } from "./hooks/useInfinitelyScrolledHits";
import { indexName } from "./helpers/algolia";

const Hero = dynamic(() => import("./components/hero"), {
  ssr: false,
});

const searchClient = algoliasearch(
  "PVXYD3XMQP",
  "69636a752c16bee55133304edea993f7"
);

export default function Home() {
  return (
    <InstantSearch searchClient={searchClient} indexName={indexName}>
      <Search />
    </InstantSearch>
  );
}

function Search() {
  const shrink = useShrinkOnScroll(200);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  useEffect(() => {
    if (selectedMovie) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [selectedMovie]);

  return (
    <main>
      <Hero />
      <Index indexName={indexName}>
        <div className={cx("relative mih-screen")}>
          <Modal
            data={selectedMovie}
            setData={setSelectedMovie}
            onClose={() => {
              setSelectedMovie(null);
            }}
            isOpen={Boolean(selectedMovie)}
          />

          <div
            className={cx(
              "w-full flex flex-wrap items-center justify-center bottom-0 left-0 transition-all duration-500 ease-in-out z-30 backdrop-filter backdrop-blur-lg bg-black bg-opacity-5",
              shrink ? "sticky top-0 py-4" : "-translate-y-24 relative"
            )}
          >
            <div
              className={cx(
                "h-full relative transition-[width] duration-500 ease-in-out",
                shrink ? "w-1/2" : "w-[420px]"
              )}
            >
              <SearchBox
                className="w-full h-[50px] bg-black rounded-lg shadow-lg left-0 right-0 mx-auto px-4 py-2 ring ring-red-700 focus:outline-none focus:ring-2 focus:border-4 focus:border-red-950 placeholder-gray-500 text-white text-xl"
                classNames={{ input: "bg-transparent w-full" }}
                placeholder="Search for a movie, an actor, director…"
              />

              <MagnifyingGlassIcon className="w-6 h-6 text-red-700 absolute right-4 top-1/2 transform -translate-y-1/2" />
            </div>
            <CustomRefinementList attribute="release_year" placeholder="Year" />
            <CustomRefinementList attribute="genres" placeholder="Genre" />

            <CustomRefinementList
              attribute="directors.name"
              placeholder="Directors"
            />

            <CustomRefinementList attribute="cast.name" placeholder="Actors" />

            <div className="flex w-full">
              <CurrentRefinements />
            </div>
          </div>
          <MoviesList onSelect={setSelectedMovie} />
        </div>
      </Index>
    </main>
  );
}

type MoviesListProps = {
  onSelect?(hit: Movie): void;
};

function MoviesList({ onSelect }: MoviesListProps) {
  const { items } = useCurrentRefinements();

  const isRefined = items.length > 0;

  return isRefined ? (
    <AllMovies onSelect={onSelect} />
  ) : (
    <CategorizedMovies onSelect={onSelect} />
  );
}

type AllMoviesProps = {
  onSelect?(hit: Movie): void;
};

function AllMovies({ onSelect }: AllMoviesProps) {
  const { hits, sentinelRef, isLoading } = useInfinitelyScrolledHits();

  return (
    <div className="mb-8 py-8">
      <MoviesHeading>All Movies</MoviesHeading>

      <div className="mx-auto max-w-full overflow-hidden sm:px-6 lg:px-8">
        <h2 className="sr-only">Horror Movies List</h2>

        <ul className="overflow-scroll gap-4 scrollbar-hide grid grid-cols-5">
          {hits.map((hit) => {
            return (
              <li key={hit.objectID} onClick={() => onSelect?.(hit)}>
                <MovieItem hit={hit} />
              </li>
            );
          })}
          <LoadingIndicator ref={sentinelRef} isLoading={isLoading} />
        </ul>
      </div>
    </div>
  );
}

type CategorizedMoviesProps = {
  onSelect?(hit: Movie): void;
};

function CategorizedMovies({ onSelect }: CategorizedMoviesProps) {
  const { hits, sentinelRef, isLoading } = useInfinitelyScrolledHits();

  const rawCategories = hits.reduce<Record<string, Movie[]>>(
    (categories, movie) => {
      movie.genres.forEach((category) => {
        // eslint-disable-next-line no-param-reassign
        (categories[category] ||= []).push(movie);
      });

      return categories;
    },
    {}
  );

  const categories = Object.entries(rawCategories || {}).sort(
    (a, b) => b[1].length - a[1].length
  );

  return (
    <div className="relative">
      {categories.map(([category, hits]) => (
        <div className="mb-8 py-8" key={category}>
          <MoviesHeading>{category}</MoviesHeading>

          <div className="mx-auto max-w-full overflow-hidden sm:px-6 lg:px-8">
            <ul className="overflow-scroll gap-4 scrollbar-hide flex">
              {hits.map((hit) => {
                return (
                  <li key={hit.objectID} onClick={() => onSelect?.(hit)}>
                    <MovieItem hit={hit} />
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      ))}
      <div className="bg-red-700 p-8">
        <LoadingIndicator ref={sentinelRef} isLoading={isLoading} />
      </div>
    </div>
  );
}

type MovieItemProps = {
  hit: Movie;
};

function MovieItem({ hit }: MovieItemProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="group relative mr-1 border-2 border-transparent rounded-lg">
      <div
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={cx(
          "cover relative h-[320px] aspect-h-1 aspect-w-1 overflow-hidden group-hover:opacity-75 p-4 transition-[width] ease-in-out",
          isHovered ? "w-[600px]" : "w-auto"
        )}
        style={{
          background: `url(https://www.themoviedb.org/t/p/w1280/${hit.backdrop_path}no-repeat center center/cover`,
        }}
      >
        <div className="relative z-10 flex">
          <img
            src={`https://www.themoviedb.org/t/p/w1280/${hit.poster_path}`}
            alt={`https://www.themoviedb.org/t/p/w1280/${hit.poster_path}`}
            className="h-72 object-cover object-center rounded-lg"
            loading="lazy"
            style={{ minWidth: "200px" }}
          />

          {isHovered && (
            <div className="pb-4 pt-10 text-center p-4 sm:p-6 bottom-0 flex flex-col grow overflow-hidden">
              {/* The following div must appear once the mouse is hovered with a delay */}
              <div
                className={cx(
                  "inset-0 transition-all ease-in-out",
                  "hidden group-hover:block"
                )}
                style={{
                  transitionDelay: "500ms",
                }}
              >
                <h3 className="text-2xl font-medium text-gray-100">
                  <span aria-hidden="true" className="absolute inset-0" />
                  <Highlight attribute="title" hit={hit} />
                </h3>
                <p className="mt-1 text-sm text-gray-300">
                  {hit.overview?.split(" ").slice(0, 30).join(" ") + "..."}
                </p>
                <div className="mt-3 flex items-center flex-col">
                  <p className="text-sm text-gray-300">{hit.release_year}</p>
                  <p className="">{hit.vote_average / 2 - 1} out of 5 stars</p>
                  <div className="flex items-center">
                    {[0, 1, 2, 3, 4].map((rating) => (
                      <StarIcon
                        key={rating}
                        className={cx(
                          hit.vote_average / 2 - 1 > rating
                            ? "text-yellow-400"
                            : "text-gray-200",
                          "h-5 w-5 flex-shrink-0"
                        )}
                        aria-hidden="true"
                      />
                    ))}
                  </div>
                  <p className="mt-1 text-sm text-gray-300">
                    {hit.vote_count} votes
                  </p>
                </div>
                <p className="mt-4 text-base font-medium text-gray-300">
                  {hit.popularity} popularity
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

type MoviesHeadingProps = React.PropsWithChildren;

function MoviesHeading({ children }: MoviesHeadingProps) {
  return (
    <header
      className="px-8 py-3 flex sticky top-20 z-20 border-l-4 border-red-700"
      style={{ filter: "drop-shadow(0px 4px 4px rgba(0, 0, 0, 1))" }}
    >
      <h2 className="text-2xl font-black pr-4">{children}</h2>
    </header>
  );
}

type LoadingIndicatorProps = {
  isLoading: boolean;
};

const LoadingIndicator = forwardRef(function LoadingIndicator(
  { isLoading }: LoadingIndicatorProps,
  ref
) {
  return (
    <div ref={ref as React.ForwardedRef<HTMLDivElement>}>
      {isLoading ? "Loading..." : ""}
    </div>
  );
});
