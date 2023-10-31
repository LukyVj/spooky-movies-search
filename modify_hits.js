const algoliasearch = require("algoliasearch");

const client = algoliasearch(
  process.env.NEXT_PUBLIC_ALGOLIA_APP_ID,
  process.env.ALGOLIA_ADMIN_API_KEY
);

const index = client.initIndex("movies_copy");

index.browseObjects({
  batch: (hits) => {
    hits.forEach((hit) => {
      if (hit.record_type !== "movie") {
        const year = new Date(hit.first_air_date).toString().split(" ")[3];
        hit.release_year = year;
      } else {
        // convert unix timestamp to integer and keep only YYYY
        const year = new Date(hit.release_date).toString().split(" ")[3];
        hit.release_year = year;
      }
    });
    index.saveObjects(hits);
  },
});
