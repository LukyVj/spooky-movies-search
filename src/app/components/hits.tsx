"use client";

import cx from "classnames";

import {
  useConfigure,
  useInfiniteHits,
  type UseConfigureProps,
  type UseInfiniteHitsProps,
  useSearchBox,
  useRefinementList,
  UseRefinementListProps,
  Highlight,
  useInstantSearch,
} from "react-instantsearch";
import { StarIcon, XMarkIcon } from "@heroicons/react/20/solid";
import { sentenceToColor } from "../helpers";
import { useEffect, useRef, useState } from "react";
import { Movie } from "../types";

import React from "react";
import Hit from "./hit";

function CustomConfigure(props: UseConfigureProps) {
  useConfigure(props);

  return null;
}

const RenderHits = ({
  isLastPage,
  showMore,
  hits,
}: {
  isLastPage: boolean;
  showMore: () => void;
  hits: any;
}) => {
  const [hitsLoading, setHitsLoading] = useState(true);

  const sentinelRef = useRef(null);

  useEffect(() => {
    // refine(query);
    if (sentinelRef.current !== null) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !isLastPage) {
            showMore();
            setHitsLoading(false);
          }
        });
      });

      observer.observe(sentinelRef.current);

      return () => {
        observer.disconnect();
      };
    }
  }, [sentinelRef, isLastPage]);

  return (
    <div className="mx-auto max-w-full overflow-hidden sm:px-6 lg:px-8">
      <h2 className="sr-only">Horror Movies List</h2>

      <ul className="flex overflow-scroll gap-4 scrollbar-hide">
        {hits.map((hit: any) => {
          return <Hit {...hit} />;
        })}
        <li ref={sentinelRef}>{!hitsLoading ? "Loading..." : "loaded"}</li>
      </ul>
    </div>
  );
};

const CustomRefinementList = (props: UseRefinementListProps) => {
  const { items, refine } = useRefinementList(props);

  return (
    <div className="ml-4 border-l-2 border-red-700">
      <label htmlFor="genres" className="sr-only">
        {props.attribute}
      </label>
      <select
        id="genres"
        name="genres"
        className="block w-full pl-3 pr-10 py-2 text-base border-red-700 focus:outline-none focus:ring-red-700 focus:border-red-700 sm:text-sm rounded-md bg-transparent"
        defaultValue={"2020"}
        onChange={(e) => {
          refine(e.target.value);
        }}
      >
        {items.map((item) => (
          <option key={item.label} value={item.label}>
            {item.label}
          </option>
        ))}
      </select>
    </div>
  );
};

const CustomInfiniteHits = ({
  genre,
  title,
}: {
  title: string;
  genre?: string;
}) => {
  const { hits, isLastPage, showMore } = useInfiniteHits();
  const [currentHits, setCurrentHits] = useState(hits);

  const { query } = useSearchBox();

  const currentFacetFilters = [`genres: ${genre}`];

  useEffect(() => {
    setCurrentHits(hits);
  }, [hits]);

  return (
    <div className="mb-8 py-8">
      <header
        className="px-8 py-3 flex sticky top-0 z-20"
        style={{ filter: "drop-shadow(0px 4px 4px rgba(0, 0, 0, 1))" }}
      >
        <h2 className="text-2xl font-black ">{title}</h2>

        <CustomRefinementList attribute="release_year" />
      </header>
      <CustomConfigure facetFilters={currentFacetFilters} query={query} />
      <RenderHits
        isLastPage={isLastPage}
        showMore={showMore}
        hits={currentHits}
      />
    </div>
  );
};

export default CustomInfiniteHits;
