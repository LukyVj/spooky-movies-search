import { Configure, Hits, Index } from 'react-instantsearch';
import { Movie } from '../types';
import { Fragment } from 'react';

const PosterWall = () => {
  return (
    <Index indexName="horror_movies">
      <Configure
        hitsPerPage={40}
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
        />
      </div>
    </Index>
  );
};

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

export default PosterWall;
