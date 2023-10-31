const algoliasearch = require("algoliasearch");
const client1 = algoliasearch(
  process.env.ALGOLIA_APP_ID_FABIEN,
  process.ALGOLIA_ADMIN_API_KEY_FABIEN
);
const client2 = algoliasearch(
  process.env.NEXT_PUBLIC_ALGOLIA_APP_ID,
  process.env.ALGOLIA_ADMIN_API_KEY
);

const slugify = (string) => {
  if (typeof string !== "string") {
    throw new Error("slugify: string argument expected");
  }

  var locale = {};

  var replacement = "-";

  var trim = true;

  var slug = string
    .normalize()
    .split("")
    // replace characters based on charMap
    .reduce(function (result, ch) {
      var appendChar = locale[ch];
      if (appendChar === undefined) appendChar = ch;
      if (appendChar === replacement) appendChar = " ";
      return (
        result +
        appendChar
          // remove not allowed characters
          .replace(/[^\w\s$*_+~.()'"!\-:@]+/g, "")
      );
    }, "");

  if (trim) {
    slug = slug.trim();
  }

  // Replace spaces with replacement character, treating multiple consecutive
  // spaces as a single space.
  slug = slug.replace(/\s+/g, replacement);

  return slug;
};

const index1 = client1.initIndex("movies");

const index2 = client2.initIndex("movies_copy");

// I need to browse the objects from index1 and save them to index2, but, I need to do it in batches of 1000 objects. And by modifying the objectID to be the slugified title of the movie.

// index1.browseObjects({
//   batch: (hits) => {
//     index2.saveObjects(hits);
//   },
// });

index1.browseObjects({
  batch: (hits) => {
    hits.forEach((hit) => {
      hit.objectID = slugify(hit.poster_path);
    });
    index2.partialUpdateObjects(hits);
  },
});
