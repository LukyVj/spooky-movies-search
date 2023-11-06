const algoliasearch = require("algoliasearch");

require("dotenv").config();

const client2 = algoliasearch(
  process.env.NEXT_PUBLIC_ALGOLIA_APP_ID,
  process.env.ALGOLIA_ADMIN_API_KEY
);

const client1 = algoliasearch("xxxx", "xxx");

const index1 = client1.initIndex("movies");
const index2 = client2.initIndex("horror_movies");

index1.browseObjects({
  batch: (hits) => {
    hits.map((hit) => {
      if (hit.record_type === "movie" && hit.genres.includes("Horror")) {
        console.log(hit.title);
        index2.saveObject(hit);
        console.log("saved", hit.title);
      }
    });
  },
});
