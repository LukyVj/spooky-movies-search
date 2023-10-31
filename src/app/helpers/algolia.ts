import algoliasearch from "algoliasearch";

const searchClient = algoliasearch(
  process.env.NEXT_PUBLIC_ALGOLIA_APP_ID as string,
  process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_API_KEY as string
);

export const ALGOLIA_INDEX = searchClient.initIndex("movies_copy");
