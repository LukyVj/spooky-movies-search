import { useEffect, useState } from "react";
import { Movie } from "../types";
import { ALGOLIA_INDEX } from "../helpers/algolia";

const getInitialData = async () => {
  const latestHits = await ALGOLIA_INDEX.search("", {
    hitsPerPage: 40,
    attributesToRetrieve: ["poster_path"],
    filters: "genres:Horror",
  });

  return latestHits.hits.sort(() => Math.random() - 0.5);
};

const PosterWall = () => {
  const [paths, setPaths] = useState<Movie[]>([]); // State to store the fetched data

  useEffect(() => {
    getInitialData().then((data: any) => {
      setPaths(data);
    });
  }, []);

  return (
    <div
      className="absolute top-0 left-0 h-screen w-screen z-0"
      style={{
        perspective: "1000px",
        transformStyle: "preserve-3d",
      }}
    >
      <div className="flex flex-row flex-wrap h-full w-full relative -top-6 -left-6">
        {paths.map((path) => (
          <div className="w-1/8 h-1/3" key={path.poster_path}>
            <img
              src={`https://image.tmdb.org/t/p/w185/${path.poster_path}`}
              className="w-full h-full object-cover object-top"
              style={{
                transform: `skew(-15deg)`,
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default PosterWall;
