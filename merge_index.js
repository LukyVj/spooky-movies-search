const algoliasearch = require("algoliasearch");

require("dotenv").config();

const client2 = algoliasearch(
  process.env.NEXT_PUBLIC_ALGOLIA_APP_ID,
  process.env.ALGOLIA_ADMIN_API_KEY
);

const index1 = client2.initIndex("movies_copy");
const index2 = client2.initIndex("horror_movies");

index1.getSettings().then((settings) => {
  index2.setSettings(settings);
});
