'use client';

import cx from 'classnames';
import {
  useConfigure,
  useInfiniteHits,
  type UseConfigureProps,
  useSearchBox,
  useRefinementList,
  UseRefinementListProps,
  useCurrentRefinements,
} from 'react-instantsearch';

import { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react';

import React from 'react';
import Hit from './hit';
import CustomRefinementList from './custom-refinement-list';
import { Movie } from '../types';

function CustomConfigure(props: UseConfigureProps) {
  useConfigure(props);

  return null;
}

const RenderHits = ({
  isLastPage,
  showMore,
  hits,
  grid,
  setPickedMovie,
}: {
  isLastPage: boolean;
  showMore: () => void;
  grid: boolean;
  hits: any;
  setPickedMovie: Dispatch<SetStateAction<Movie | null>>;
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

      <ul
        className={cx(
          'overflow-scroll gap-4 scrollbar-hide',
          grid ? 'grid grid-cols-5' : 'flex '
        )}
      >
        {hits.map((hit: any) => {
          return (
            <li
              key={hit.objectID}
              className="group relative mr-1 border-2 border-transparent rounded-lg"
              onClick={() => setPickedMovie(hit)}
            >
              <Hit {...hit} />
            </li>
          );
        })}
        <li ref={sentinelRef}>{!hitsLoading ? 'Loading...' : ''}</li>
      </ul>
    </div>
  );
};

const CustomInfiniteHits = ({
  genre,
  title,
  grid = false,
  setPickedMovie,
  other,
}: {
  title: string;
  genre?: string;
  grid?: boolean;
  setPickedMovie?: Dispatch<SetStateAction<Movie | null>>;
  [key: string]: any;
}) => {
  const { hits, isLastPage, showMore } = useInfiniteHits();
  const [currentHits, setCurrentHits] = useState(hits);

  const { query } = useSearchBox();

  const currentFacetFilters = [`genres: ${genre}`];

  useEffect(() => {
    setCurrentHits(hits);
  }, [hits]);

  return currentHits.length > 0 ? (
    <div className="mb-8 py-8">
      <header
        className="px-8 py-3 flex sticky top-20 z-20 border-l-4 border-red-700"
        style={{ filter: 'drop-shadow(0px 4px 4px rgba(0, 0, 0, 1))' }}
      >
        <h2 className="text-2xl font-black pr-4">{title}</h2>
      </header>
      <CustomConfigure facetFilters={currentFacetFilters} query={query} />
      <RenderHits
        isLastPage={isLastPage}
        showMore={showMore}
        hits={currentHits}
        grid={grid}
        setPickedMovie={setPickedMovie as any}
      />
    </div>
  ) : (
    <></>
  );
};

export default CustomInfiniteHits;
