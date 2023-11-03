import {
  BanknotesIcon,
  EllipsisHorizontalCircleIcon,
  PlayIcon,
  StarIcon,
  XMarkIcon,
} from "@heroicons/react/20/solid";
import cx from "classnames";
import { useRef } from "react";

import useOnClickOutside from "../hooks/useClickOutside";
import { Movie } from "../types";
import { VideoWithPreview } from "./video-with-preview";
import { run } from "node:test";
import { searchClient } from "../helpers/algolia";
import { relatedProducts } from "@algolia/recommend-js";
import algoliarecommend from "@algolia/recommend";
import Hit from "./hit";
import { RelatedProducts } from "@algolia/recommend-react";

const Avatar = ({
  name,
  profile_path,
}: {
  name: string;
  profile_path: string | null;
}) => {
  return (
    <div className="flex items-center group">
      <div>
        <img
          className="inline-block h-8 w-8 rounded-full object-cover"
          src={
            profile_path
              ? `https://image.tmdb.org/t/p/original/${profile_path}`
              : "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png"
          }
          alt=""
        />
      </div>
      <div className="ml-3">
        <p className="text-sm font-medium text-gray-300 group-hover:text-white">
          {name}
        </p>
      </div>
    </div>
  );
};

type YouTubeVideoProps = {
  id: string;
};

export function YouTubeVideo({ id }: YouTubeVideoProps) {
  return (
    <VideoWithPreview
      className="aspect-video w-full rounded"
      allow="autoplay"
      src={`//www.youtube.com/embed/${id}?autoplay=1&showinfo=0`}
      preview={({ status, load }) =>
        ["idle", "loading"].includes(status) && (
          <button onClick={() => load()} className="group block">
            <div className="relative flex aspect-video items-center overflow-hidden rounded text-white">
              <img
                src={`//img.youtube.com/vi/${id}/hqdefault.jpg`}
                className="opacity-80 transition-opacity group-hover:opacity-100"
                alt="YouTube video preview"
              />
              <div className="from-dark-blue absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t opacity-80 transition-opacity group-hover:opacity-70" />
              <span className="absolute top-0 left-0 right-0 bottom-0 flex items-center justify-center">
                {status === "idle" && <PlayIcon className="w-16 h-16" />}
                {status === "loading" && (
                  <EllipsisHorizontalCircleIcon className="w-16 h-16 animate-spin" />
                )}
              </span>
            </div>
          </button>
        )
      }
    />
  );
}

const convertRuntime = (runtime: number) => {
  const hours = Math.floor(runtime / 60);
  const minutes = runtime % 60;

  return `${hours}h ${minutes}m`;
};

const convetBudget = (budget: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(budget);
};

const convertDateToReadable = (date: number) => {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

/* Here's the type of Movie


  export interface Movie extends Hit<BaseHit> {
  record_type: string;
  backdrop_path: string | null;
  poster_path: string | null;
  title: string;
  overview: string | null;
  tagline: string | null;
  genres: string[];
  status: string;
  original_title: string;
  original_language: string;
  spoken_languages: string[];
  popularity: number;
  popularity_bucketed: number;
  vote_average: number;
  vote_count: number;
  cast: CastMember[];
  cast_lead: CastMember[];
  directors: Director[];
  videos: Video[];
  budget: number;
  belongs_to_collection: Collection | null;
  release_date: number;
  release_year: number;
  runtime: number;
  bayesian_avg: number;
  objectID: string;
}

export type CastMember = {
  name: string;
  facet: string;
  profile_path: string | null;
  character: string | null;
};

export type Director = {
  name: string;
  facet: string;
  profile_path: string | null;
};

type Video = {
  name: string;
  site: string;
  key: string;
  published_at: number;
};


*/
const Modal = ({
  data,
  onClose,
  isOpen,
}: {
  data: Movie | null;
  onClose: () => void;
  isOpen: boolean;
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  useOnClickOutside(modalRef, onClose);

  if (!data) return null;

  const {
    title,
    overview,
    poster_path,
    backdrop_path,
    cast_lead,
    cast,
    directors,
    genres,
    spoken_languages,
    videos,
    release_date,
    runtime,
    budget,
    popularity,
    vote_average,
    vote_count,
    bayesian_avg,
    status,
    tagline,
    original_title,
    original_language,
    belongs_to_collection,
    popularity_bucketed,
    record_type,
    objectID,
    release_year,
  } = data;

  // Column must be up to 3 columns
  const COLUMNS = {
    1: "grid-cols-1",
    2: "grid-cols-2",
    3: "grid-cols-3",
  };

  const recommendClient = algoliarecommend(
    process.env.NEXT_PUBLIC_ALGOLIA_APP_ID!,
    process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_API_KEY!
  );

  const recommendedMovies = relatedProducts({
    objectIDs: ["movie_520763"],
    recommendClient,
    indexName: "horror_movies",
    itemComponent({ item }) {
      return (
        <pre>
          <code>{JSON.stringify(item)}</code>
        </pre>
      );
    },
  });

  console.log(recommendedMovies);

  return (
    <div
      className={cx(
        `modal fixed top-0 left-0 w-screen h-screen bg-black bg-opacity-70 z-50 ${
          isOpen ? "block" : "hidden"
        }`
      )}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-[rgb(20,20,20)] rounded-lg w-[90%] h-[90%] overflow-scroll scrollbar-hide shadow-lg border-4 border-red-950"
        ref={modalRef}
      >
        <div
          className="relative flex flex-wrap h-full cover-bottom"
          style={{
            background: `url(https://image.tmdb.org/t/p/w1280/${backdrop_path})no-repeat center center/cover`,
          }}
        >
          <div
            className={cx(
              "w-1/3 p-4 h-full flex items-start justify-center",
              "z-10"
            )}
          >
            <img
              src={`https://image.tmdb.org/t/p/w1280/${poster_path}`}
              className=" w-10/12 h-10/12 object-cover object-top ratio-2:3"
            />
          </div>
          <div className="w-2/3 p-4 relative z-20 right-0">
            <h2 className="text-6xl font-bold mb-2 border-l-8 border-red-700 pl-4">
              {title}{" "}
            </h2>
            <h3 className="text-xl font-bold mb-1">{tagline}</h3>

            <small className="text-gray-400">
              {convertDateToReadable(release_date)} ({release_year}) — 
              {convertRuntime(runtime)}
            </small>

            <div className="flex flex-col">
              {original_title !== title && (
                <small>
                  Original Title: <b>{original_title}</b>
                </small>
              )}
              {original_language && (
                <small>
                  Original Language: <b>{original_language}</b>
                </small>
              )}
            </div>
            <p className="text-lg text-gray-300 mt-4">{overview}</p>

            <a
              href={`https://www.themoviedb.org/movie/${objectID.replace(
                "movie_",
                ""
              )}`}
              className="text-red-700 hover:text-red-600 font-bold mt-4"
            >
              See more on TMDB
            </a>

            <section className="mt-4 py-4 relative z-10">
              <h2 className="text-2xl font-bold border-l-4 border-red-700 pl-4 mb-4">
                Genres
              </h2>
              <ul className="flex gap-4">
                {genres.map((genre) => (
                  <li key={genre}>
                    <span className="inline-flex items-center rounded-md bg-red-50 px-2 py-1 text-xs font-medium text-red-700 ring-1 ring-inset ring-red-600/10">
                      {genre}
                    </span>
                  </li>
                ))}
              </ul>
            </section>

            <section className="mt-4 py-4 relative z-10 flex-wrap">
              <h2 className="text-2xl font-bold border-l-4 border-red-700 pl-4 mb-4">
                Directors
              </h2>
              <ul>
                {directors.map((director) => (
                  <li key={director.name}>
                    <Avatar
                      name={director.name}
                      profile_path={director.profile_path}
                    />
                  </li>
                ))}
              </ul>
            </section>

            <section className="mt-4 py-4 relative z-10 flex-wrap">
              <h2 className="text-2xl font-bold mb-4 border-l-4 border-red-700 pl-4">
                Casting
              </h2>
              <div>
                <ul className="flex flex-wrap gap-4">
                  {cast.map((castMember) => (
                    <li key={castMember.name}>
                      <Avatar
                        name={castMember.name}
                        profile_path={castMember.profile_path}
                      />
                    </li>
                  ))}
                </ul>
              </div>
            </section>

            {/* <section className="mt-4 flex p-4 relative z-10">
              <h2 className="text-2xl font-bold">Languages</h2>
              <ul>
                {spoken_languages.map((language) => (
                  <li key={language}>{language}</li>
                ))}
              </ul>
            </section> */}

            {videos.length > 0 && (
              <section className="mt-4 py-4 relative z-10">
                <h2 className="text-2xl font-bold border-l-4 border-red-700 pl-4">
                  Trailers
                </h2>
                <ul
                  className={cx(
                    "grid gap-4",
                    videos.length >= 2 ? "grid-cols-3" : COLUMNS
                  )}
                >
                  {videos.map((video) => (
                    <li key={video.name}>
                      {video.site === "YouTube" && (
                        <YouTubeVideo id={video.key} />
                      )}
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {/* <section className="mt-4 flex py-4 relative z-10"> */}
            {/* <h2 className="text-2xl font-bold border-l-4 border-red-700 pl-4"> */}
            {/* Budget */}
            {/* </h2> */}
            {/* <div className="flex items-center"> */}
            {/* <BanknotesIcon className="w-6 h-6 text-red-700" /> */}
            {/* <span>{convetBudget(budget)}</span> */}
            {/* </div> */}
            {/* </section> */}

            {/* <section className="mt-4 flex py-4 relative z-10"> */}
            {/* <h2 className="text-2xl font-bold border-l-4 border-red-700 pl-4"> */}
            {/* Popularity */}
            {/* </h2> */}
            {/* <span>{popularity}</span> */}
            {/* </section> */}

            {/*  <section className="mt-4 flex py-4 relative z-10">
              <h2 className="text-2xl font-bold border-l-4 border-red-700 pl-4">
                Vote Average
              </h2>
            </section> */}

            {/* <section className="mt-4 flex py-4 relative z-10">
              <h2 className="text-2xl font-bold border-l-4 border-red-700 pl-4">
                Vote Count
              </h2>

              <span>{vote_count}</span>
            </section>

            <section className="mt-4 flex py-4 relative z-10">
              <h2 className="text-2xl font-bold border-l-4 border-red-700 pl-4">
                Popularity Bucketed
              </h2>
              <span>{popularity_bucketed}</span>
            </section> */}
          </div>

          <div>
            <RelatedProducts
              recommendClient={recommendClient}
              indexName="horror_movies"
              headerComponent={() => <h2>Recommended Movies</h2>}
              objectIDs={[objectID]}
              itemComponent={({ item }) => (
                <div>
                  <Hit {...item} open />
                </div>
              )}
              maxRecommendations={3}
              classNames={{
                list: "flex flex-wrap gap-4",
              }}
            />
            <button
              className="mt-4 bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded absolute top-4 right-4 z-20"
              onClick={onClose}
            >
              <span className="sr-only">Close</span>
              <XMarkIcon className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
