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
      <div className="poster-wall-container absolute top-0 left-0 w-screen z-[5]">
        <Hits
          hitComponent={Hit}
          classNames={{
            list: 'flex flex-row flex-wrap w-full relative',
            item: '',
          }}
          transformItems={(hits) => shuffle(hits, salt).slice(0, 16)}
        />
        <div
          className="absolute inset-0 w-full h-full pointer-events-none"
          style={{
            background: 'linear-gradient(180deg, rgba(20,20,20,0.8) 0%, rgba(20,20,20,1) 70%, rgba(20,20,20,1) 100%)',
          }}
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
      <div style={{ aspectRatio: '2/3', width: '12.5vw' }}>
        <img
          src={`https://image.tmdb.org/t/p/w185/${hit.poster_path}`}
          className="w-full h-full object-cover object-top"
        />
      </div>
    </Fragment>
  );
}
