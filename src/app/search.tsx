'use client';

import cx from 'classnames';
import { Index, SearchBox, useInstantSearch } from 'react-instantsearch';
import { MagnifyingGlassIcon } from '@heroicons/react/20/solid';
import { useShrinkOnScroll } from './hooks/useShrinkOnScroll';
import { Movie } from './types';

const Search = () => {
  const shrink = useShrinkOnScroll(200);
  const [allGenres, setAllGenres] = useState<any[]>([]);
  const scrollToEnd = () => {
    window.scrollTo({
      top: 500,
      behavior: "smooth",
    });
  };

  const getAllGenres = async () => {
    const response = await ALGOLIA_INDEX.searchForFacetValues("genres", "", {
      maxFacetHits: 100,
    }).then((facet) => {
      return facet.facetHits;
    });

    return response;
  };

  useEffect(() => {
    getAllGenres().then((data) => {
      console.log(data);
      setAllGenres(data);
    });
  }, []);

  return (
    <div className="relative">
      <Index indexName="horror_movies">
        <SearchBox
          classNames={{
            root: cx(
              'w-full absolute z-20 flex items-center justify-center top-0 left-0 transition-all duration-500 ease-in-out',
              shrink ? '' : '-translate-y-24'
            ),
            form: cx(
              'h-full relative transition-[width] duration-500 ease-in-out',
              shrink ? 'w-1/2' : 'w-[420px]'
            ),
            input:
              'w-full h-[50px] bg-black rounded-lg shadow-lg left-0 right-0 mx-auto px-4 py-2 ring ring-red-700 focus:outline-none focus:ring-2 focus:border-4 focus:border-red-950',
          }}
          submitIconComponent={() => (
            <MagnifyingGlassIcon className="w-6 h-6 text-red-700 absolute right-4 top-1/2 transform -translate-y-1/2" />
          )}
          onClick={() => {
            window.scrollTo({
              top: 500,
              behavior: 'smooth',
            });
          }}
        />
        <Categories />
      </Index>
    </div>
  );
};

function Categories() {
  const { results } = useInstantSearch();
  const rawCategories = (results.hits as Movie[]).reduce<
    Record<string, Movie[]>
  >((categories, movie) => {
    movie.genres.forEach((category) => {
      // eslint-disable-next-line no-param-reassign
      (categories[category] ||= []).push(movie);
    });

    return categories;
  }, {});

  const categories = Object.entries(rawCategories || {})
    .sort((a, b) => b[1].length - a[1].length)
    .slice(0, 5);

  return (
    <>
      {categories.map(([category, hits]) => (
        <>
          <strong>{category}</strong>
          <ul>
            {hits.map((hit) => (
              <li>{hit.title}</li>
            ))}
          </ul>
          <hr />
        </>
      ))}
    </>
  );
}

export default Search;
