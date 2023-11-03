import { StarIcon, XMarkIcon } from "@heroicons/react/20/solid";
import cx from "classnames";
import { useState } from "react";
import { Highlight } from "react-instantsearch";

import Link from "next/link";

const Hit = (data: any) => {
  const hit = data.item ? data.item : data;

  const [isHovered, setIsHovered] = useState(false);
  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={cx(
        "cover relative h-[320px] aspect-h-1 aspect-w-1 overflow-hidden group-hover:opacity-75 p-4 transition-[width] ease-in-out",
        isHovered ? "w-[600px]" : "w-auto"
      )}
      style={{
        background: `url(https://www.themoviedb.org/t/p/w1280/${hit.backdrop_path}no-repeat center center/cover`,
      }}
    >
      <div className="relative z-10 flex">
        <img
          src={`https://www.themoviedb.org/t/p/w1280/${hit.poster_path}`}
          alt={`https://www.themoviedb.org/t/p/w1280/${hit.poster_path}`}
          className="h-72 object-cover object-center rounded-lg"
          loading="lazy"
          style={{ minWidth: "200px" }}
        />

        {isHovered && (
          <div className="pb-4 pt-10 text-center p-4 sm:p-6 bottom-0 flex flex-col grow overflow-hidden">
            {/* The following div must appear once the mouse is hovered with a delay */}
            <div
              className={cx(
                "inset-0 transition-all ease-in-out",
                "hidden group-hover:block"
              )}
              style={{
                transitionDelay: "500ms",
              }}
            >
              <h3 className="text-2xl font-medium text-gray-100">
                <span aria-hidden="true" className="absolute inset-0" />
                <Highlight attribute="title" hit={hit} />
              </h3>
              <p className="mt-1 text-sm text-gray-300">
                {hit.overview?.split(" ").slice(0, 30).join(" ") + "..."}
              </p>
              <div className="mt-3 flex items-center flex-col">
                <p className="text-sm text-gray-300">{hit.release_year}</p>
                <p className="">{hit.vote_average / 2 - 1} out of 5 stars</p>
                <div className="flex items-center">
                  {[0, 1, 2, 3, 4].map((rating) => (
                    <StarIcon
                      key={rating}
                      className={cx(
                        hit.vote_average / 2 - 1 > rating
                          ? "text-yellow-400"
                          : "text-gray-200",
                        "h-5 w-5 flex-shrink-0"
                      )}
                      aria-hidden="true"
                    />
                  ))}
                </div>
                <p className="mt-1 text-sm text-gray-300">
                  {hit.vote_count} votes
                </p>
              </div>
              <p className="mt-4 text-base font-medium text-gray-300">
                {hit.popularity} popularity
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Hit;
