const algoliasearch = require("algoliasearch");

const client = algoliasearch("PVXYD3XMQP", "6e7c0f06fd1de7cccb6baecf8665b911");

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
