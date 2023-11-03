import { Fragment, useMemo } from 'react';
import { Configure, Hits, Index } from 'react-instantsearch';

import { shuffle } from '../helpers/shuffle';
import { indexName } from '../helpers/algolia';

import type { Movie } from '../types';

export default function PosterWall() {
  const salt = useMemo(() => Math.random(), []);

  return (
    <Index indexName={indexName}>
      <Configure
        hitsPerPage={200}
        attributesToRetrieve={['poster_path']}
        filters="genres:Horror"
      />
      <div
        className="absolute top-0 left-0 h-screen w-screen z-0"
        style={{
          perspective: '1000px',
          transformStyle: 'preserve-3d',
        }}
      >
        <Hits
          hitComponent={Hit}
          classNames={{
            list: 'flex flex-row flex-wrap h-full w-full relative -top-6 -left-6',
            item: 'w-1/8 h-1/3',
          }}
          transformItems={(hits) => shuffle(hits, salt)}
        />
      </div>
    </Index>
  );
}

type HitProps = {
  hit: Movie;
};

function Hit({ hit }: HitProps) {
  return (
    <Fragment key={hit.poster_path}>
      <img
        src={`https://image.tmdb.org/t/p/w185/${hit.poster_path}`}
        className="w-full h-full object-cover object-top"
        style={{
          transform: `skew(-15deg)`,
        }}
      />
    </Fragment>
  );
}
