'use client';

import algoliasearch from 'algoliasearch/lite';
import dynamic from 'next/dynamic';
import { InstantSearch } from 'react-instantsearch';

const Hero = dynamic(() => import('./components/hero'), {
  ssr: false,
});

const Search = dynamic(() => import('./search'), {
  ssr: false,
});

const searchClient = algoliasearch(
  'PVXYD3XMQP',
  '69636a752c16bee55133304edea993f7'
);

export default function Home() {
  return (
    <main>
      <InstantSearch searchClient={searchClient} indexName="horror_movies">
        <Hero />
        <Search />
      </InstantSearch>
    </main>
  );
}
