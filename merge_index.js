const algoliasearch = require("algoliasearch");
const client1 = algoliasearch("8L3BNIKU8L", "28f0da5e7f0be89e03998c16caf3a681");
const client2 = algoliasearch("PVXYD3XMQP", "6e7c0f06fd1de7cccb6baecf8665b911");

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
