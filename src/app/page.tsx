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
  useHits,
} from "react-instantsearch";
import algoliasearch from "algoliasearch/lite";
import { forwardRef, useEffect, useRef, useState } from "react";
import { Movie } from "./types";
import cx from "classnames";
import Modal from "./components/modal";
import { useShrinkOnScroll } from "./hooks/useShrinkOnScroll";
import { MagnifyingGlassIcon, StarIcon } from "@heroicons/react/20/solid";
import CustomRefinementList from "./components/custom-refinement-list";
import { useInfinitelyScrolledHits } from "./hooks/useInfinitelyScrolledHits";
import { indexName } from "./helpers/algolia";
import AlgoliaLogo from "@/app/icons/algolia";
import CustomCurrentRefinements from "./components/custom-current-refinement";

const Hero = dynamic(() => import("./components/hero"), {
  ssr: false,
});

const searchClient = algoliasearch(
  "PVXYD3XMQP",
  "69636a752c16bee55133304edea993f7"
);

function shortenDesc(hit: Movie) {
  return hit.tagline
    ? hit.tagline.length > 200
      ? `${hit.tagline?.substring(0, 100)}...`
      : hit.tagline
    : hit.overview && hit.overview.length > 200
    ? `${hit.overview?.substring(0, 100)}...`
    : hit.overview;
}

export default function Home() {
  return (
    <InstantSearch searchClient={searchClient} indexName={indexName} routing>
      <Search />
    </InstantSearch>
  );
}

function Search() {
  const shrink = useShrinkOnScroll(500);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const [headerSize, setHeaderSize] = useState(0);

  useEffect(() => {
    if (headerRef.current) {
      setHeaderSize(headerRef.current.getBoundingClientRect().height);
    }

    window.addEventListener("resize", () => {
      if (headerRef.current) {
        setHeaderSize(headerRef.current!.getBoundingClientRect().height);
      }
    });

    window.addEventListener("scroll", (e) => {
      // Stop listening when the scroll value is over 600
      if (headerRef.current) {
        setHeaderSize(headerRef.current!.getBoundingClientRect().height);
      }
    });

    return () => {
      window.removeEventListener("resize", () => {
        setHeaderSize(headerRef?.current!.getBoundingClientRect().height);
      });
      window.removeEventListener("scroll", () => {
        setHeaderSize(headerRef?.current!.getBoundingClientRect().height);
      });
    };
  }, [headerRef.current]);

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
              "w-full items-center justify-center bottom-0 left-0 duration-500 ease-in-out z-30 backdrop-filter backdrop-blur-lg",
              shrink
                ? "sticky grid md:grid-cols-2 top-0 py-4 bg-black bg-opacity-5"
                : "relative flex flex-wrap"
            )}
            ref={headerRef}
          >
            <div
              className={cx(
                "h-full relative ease-in-out md:pl-8",
                shrink ? "md:w-full" : "md:w-[420px]"
              )}
            >
              <SearchBox
                className={cx(
                  "h-[50px] bg-black rounded-lg shadow-lg left-0 right-0 mx-auto px-4 py-2 ring ring-red-700 focus:outline-none focus:ring-2 focus:border-4 focus:border-red-950 placeholder-gray-500 text-white text-xl"
                )}
                classNames={{
                  input:
                    "bg-transparent w-full border-0 ring-0 focus:ring-0 outline-none",
                  submitIcon: "hidden",
                  resetIcon: "hidden",
                  loadingIcon:
                    "absolute right-4 top-1/2 transform -translate-y-1/2",
                }}
                placeholder="Search for a movie, an actor, director…"
              />

              <MagnifyingGlassIcon className="hidden md:block w-6 h-6 text-red-700 absolute right-4 top-1/2 transform -translate-y-1/2" />
            </div>

            <div
              className={cx(shrink ? "hidden md:flex justify-end" : "hidden")}
            >
              <CustomRefinementList
                attribute="release_year"
                placeholder="Year"
              />
              <CustomRefinementList attribute="genres" placeholder="Genre" />

              <CustomRefinementList
                attribute="directors.name"
                placeholder="Directors"
              />

              <CustomRefinementList
                attribute="cast.name"
                placeholder="Actors"
              />
            </div>

            <div className="flex w-full">
              <CustomCurrentRefinements />
            </div>
          </div>
          <MoviesList onSelect={setSelectedMovie} headerHeight={headerSize} />
        </div>
      </Index>
      <footer>
        <div className="mx-auto py-12 px-4 overflow-hidden sm:px-6 lg:px-8 bg-black text-center">
          <p>
            Made with{" "}
            <a
              href="https://www.algolia.com/?utm_source=https://spooky-movies-search.vercel.app/"
              className="text-red-500"
            >
              Algolia
            </a>
            ,{" "}
            <a href="https://nextjs.org/" className="text-red-500">
              Next.js
            </a>{" "}
            &{" "}
            <a href="https://vercel.com/" className="text-red-500">
              Vercel
            </a>
            .
          </p>
          <p>
            Data from{" "}
            <a href="https://www.themoviedb.org/" className="text-red-500">
              The Movie Database
            </a>
            .
          </p>

          <a href="https://algolia.com?utm_source=https://spooky-movies-search.vercel.app/">
            <AlgoliaLogo className="w-40 mt-12 h-auto m-auto text-red-600" />
          </a>
        </div>
      </footer>
    </main>
  );
}

type MoviesListProps = {
  onSelect?(hit: Movie): void;
  headerHeight?: number;
};

function MoviesList({ onSelect, headerHeight }: MoviesListProps) {
  const { items } = useCurrentRefinements();

  const isRefined = items.length > 0;

  return isRefined ? (
    <AllMovies onSelect={onSelect} headerHeight={headerHeight} />
  ) : (
    <CategorizedMovies onSelect={onSelect} headerHeight={headerHeight} />
  );
}

type AllMoviesProps = {
  onSelect?(hit: Movie): void;
  headerHeight?: number;
};

function AllMovies({ onSelect, headerHeight }: AllMoviesProps) {
  const { hits, sentinelRef, isLoading } = useInfinitelyScrolledHits();

  return (
    <div className="mb-8 py-8">
      {/* <MoviesHeading headerHeight={headerHeight}>All Movies</MoviesHeading> */}

      <div className="mx-auto max-w-full overflow-hidden sm:px-6 lg:px-8">
        <h2 className="sr-only">Horror Movies List</h2>

        <ul className="overflow-scroll gap-4 scrollbar-hide flex py-12">
          {hits.map((hit) => {
            return (
              <li key={hit.objectID} onClick={() => onSelect?.(hit)}>
                <MovieItem hit={hit} />
              </li>
            );
          })}
          <li>
            {" "}
            <LoadingIndicator ref={sentinelRef} isLoading={isLoading} />
          </li>
        </ul>
      </div>
    </div>
  );
}

type CategorizedMoviesProps = {
  onSelect?(hit: Movie): void;
  headerHeight?: number;
};

function CategorizedMovies({ onSelect, headerHeight }: CategorizedMoviesProps) {
  const { hits } = useHits();

  const rawCategories = hits.reduce<Record<string, Movie[]>>(
    (categories, movie) => {
      (movie.genres as string[]).forEach((category) => {
        // eslint-disable-next-line no-param-reassign
        (categories[category] ||= []).push(movie as any);
      });

      return categories;
    },
    {}
  );

  const categories = Object.keys(rawCategories || {}).sort(
    (a, b) => b[1].length - a[1].length
  );

  return (
    <div className="relative">
      {categories.map((category) => (
        <div className="mb-8 py-8" key={category}>
          <MoviesHeading headerHeight={headerHeight}>{category}</MoviesHeading>

          <div className="mx-auto max-w-full overflow-hidden sm:px-6 lg:px-8">
            <Index indexName={indexName}>
              <Configure filters={`genres:"${category}"`} />
              <MovieCategory onSelect={onSelect} />
            </Index>
          </div>
        </div>
      ))}
    </div>
  );
}

type MovieCategoryProps = {
  onSelect?(hit: Movie): void;
};

function MovieCategory({ onSelect }: MovieCategoryProps) {
  const { hits, sentinelRef, isLoading } = useInfinitelyScrolledHits();

  return (
    <ul className="overflow-scroll gap-4 scrollbar-hide flex py-12">
      {hits.map((hit) => {
        return (
          <li
            key={hit.objectID}
            onClick={() => {
              onSelect?.(hit);
            }}
          >
            <MovieItem hit={hit} />
          </li>
        );
      })}
      <LoadingIndicator ref={sentinelRef} isLoading={isLoading} />
    </ul>
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
          "relative h-[320px] aspect-h-1 aspect-w-1 overflow-hidden group-hover:opacity-75 p-4 transition-transform ease-in-out",
          isHovered ? "scale-110" : ""
        )}
        style={{
          background: `url(https://www.themoviedb.org/t/p/w1280/${hit.backdrop_path}no-repeat center center/cover`,
        }}
      >
        <div className="relative z-10 flex">
          <img
            src={`https://www.themoviedb.org/t/p/w342${hit.poster_path}`}
            alt={`https://www.themoviedb.org/t/p/w342${hit.poster_path}`}
            className="h-72 object-cover object-center rounded-lg shadow-lg shadow-black"
            loading="lazy"
            style={{ minWidth: "200px" }}
          />

          {isHovered && (
            <div className="text-center p-2 bottom-0 overflow-hidden absolute bg-black/80 flex flex-col grow w-full h-full justify-between py-4 rounded-md">
              {/* The following div must appear once the mouse is hovered with a delay */}
              <div
                className={cx(
                  "inset-0 transition-all ease-in-out",
                  "hidden group-hover:flex flex-col grow justify-between"
                )}
                style={{
                  transitionDelay: "500ms",
                }}
              >
                <h3 className="text-xl font-medium text-gray-100">
                  <span aria-hidden="true" className="absolute inset-0" />
                  <Highlight attribute="title" hit={hit} />
                </h3>
                <p className="mt-1 text-sm text-gray-300">{shortenDesc(hit)}</p>
                <div className="mt-3 flex items-center flex-col">
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
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

type MoviesHeadingProps = React.PropsWithChildren & {
  headerHeight?: number;
};

function MoviesHeading({ children, headerHeight }: MoviesHeadingProps) {
  return (
    <header
      className="px-8 py-3 flex sticky z-20 border-l-4 border-red-700 ml-4 md:ml-8"
      style={{
        filter: "drop-shadow(0px 4px 4px rgba(0, 0, 0, 1))",
        top: headerHeight,
      }}
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
    <div
      ref={ref as React.ForwardedRef<HTMLDivElement>}
      className={cx(
        isLoading &&
          "flex flex-col items-center justify-center px-16 h-72 bg-black rounded-lg shadow-lg shadow-black animate-pulse transition-all duration-500 ease-in-out"
      )}
    >
      {isLoading ? "Loading..." : ""}
    </div>
  );
});
