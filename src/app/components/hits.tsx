"use client";

import {
  useConfigure,
  useInfiniteHits,
  type UseConfigureProps,
  useSearchBox,
  useRefinementList,
  UseRefinementListProps,
  useCurrentRefinements,
} from "react-instantsearch";

import { useEffect, useRef, useState } from "react";

import React from "react";
import Hit from "./hit";
import CustomRefinementList from "./custom-refinement-list";

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
        <li ref={sentinelRef}>{!hitsLoading ? "Loading..." : ""}</li>
      </ul>
    </div>
  );
};

const CustomInfiniteHits = ({
  genre,
  title,
  other,
}: {
  title: string;
  genre?: string;
  [key: string]: any;
}) => {
  const { hits, isLastPage, showMore } = useInfiniteHits();
  const [currentHits, setCurrentHits] = useState(hits);

  const { query } = useSearchBox();

  const currentFacetFilters = [`genres: ${genre}`];

  const { items } = useCurrentRefinements();

  console.log(items);

  useEffect(() => {
    setCurrentHits(hits);
  }, [hits]);

  return currentHits.length > 0 ? (
    <div className="mb-8 py-8">
      <header
        className="px-8 py-3 flex sticky top-0 z-20"
        style={{ filter: "drop-shadow(0px 4px 4px rgba(0, 0, 0, 1))" }}
      >
        <h2 className="text-2xl font-black pr-4">{title}</h2>

        <CustomRefinementList attribute="release_year" />
      </header>
      <CustomConfigure facetFilters={currentFacetFilters} query={query} />
      <RenderHits
        isLastPage={isLastPage}
        showMore={showMore}
        hits={currentHits}
      />
    </div>
  ) : null;
};

export default CustomInfiniteHits;
