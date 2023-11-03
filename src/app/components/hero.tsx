'use client';

import cx from 'classnames';
import dynamic from 'next/dynamic';

import { useShrinkOnScroll } from '../hooks/useShrinkOnScroll';

const PosterWall = dynamic(() => import('./poster-wall'), {
  ssr: false,
});

export default function Hero() {
  const shrink = useShrinkOnScroll(200);

  return (
    <section
      className={cx(
        'h-screen grid place-items-center relative z-10 overflow-hidden transition-height duration-500 ease-in-out',
        shrink && 'shrinked'
      )}
    >
      <PosterWall />

      <header
        className="h-screen w-full grid place-items-center relative z-10 overflow-hidden"
        style={{
          background:
            'linear-gradient(180deg, rgba(20,20,20,0.8) 0%, rgba(20,20,20,1) 70%,  rgba(20,20,20,1) 100%)',
        }}
      >
        <h1 className="sr-only">Horror Movies Database</h1>
        <img
          src="/SpookyMovieSearch.png"
          className={cx(
            'object-cover object-center transition-all duration-500 ease-in-out',
            shrink ? 'w-[300px]' : 'w-[800px]'
          )}
          alt="Horror Movies Database"
        />
      </header>
    </section>
  );
}
