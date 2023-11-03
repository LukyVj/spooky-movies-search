import { useInfiniteHits, useInstantSearch } from 'react-instantsearch';
import { Movie } from '../types';
import { useEffect, useRef } from 'react';

export function useInfinitelyScrolledHits() {
  const { hits, isLastPage, showMore } = useInfiniteHits<Movie>();
  const { status } = useInstantSearch();
  const isLoading = status !== 'idle';

  const sentinelRef = useRef(null);

  useEffect(() => {
    if (sentinelRef.current !== null) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !isLastPage) {
            showMore?.();
          }
        });
      });

      observer.observe(sentinelRef.current);

      return () => {
        observer.disconnect();
      };
    }
  }, [sentinelRef, isLastPage]);

  return { hits, isLoading, sentinelRef };
}
