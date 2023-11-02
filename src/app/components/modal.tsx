import cx from "classnames";
import { BanknotesIcon } from "@heroicons/react/20/solid";
import { Movie } from "../types";
import useOnClickOutside from "../hooks/useClickOutside";
import { useRef } from "react";

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

  return (
    <div
      className={cx(
        `modal fixed top-0 left-0 w-screen h-screen bg-black bg-opacity-50 z-50 ${
          isOpen ? "block" : "hidden"
        }`
      )}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-[rgb(20,20,20)] rounded-lg w-[90%] h-[90%] overflow-scroll scrollbar-hide"
        ref={modalRef}
      >
        <div
          className="flex flex-col items-center h-full"
          style={{
            background: `url(https://image.tmdb.org/t/p/w1280/${backdrop_path})no-repeat center center/cover`,
          }}
        >
          <header className="relative flex h-full cover-bottom">
            <div className={cx("w-full p-4 h-full", "z-10")}>
              <img
                src={`https://image.tmdb.org/t/p/w1280/${poster_path}`}
                className="w-1/4 object-cover object-bottom"
              />
            </div>
            <div className="w-1/2 justify-end p-4 relative z-20 right-0 text-right">
              <h2 className="text-3xl font-bold">{title}</h2>
              <h3 className="text-xl font-bold">{tagline}</h3>

              {original_title !== title && (
                <small>Original Title: {original_title}</small>
              )}
              <p className="text-lg text-gray-300">{overview}</p>
            </div>
          </header>

          <section className="mt-4 flex p-4">
            <h2 className="text-2xl font-bold">Cast</h2>
            <div>
              <h3 className="text-xl font-bold">Lead</h3>
              <ul>
                {cast_lead.map((castMember) => (
                  <li key={castMember.name}>{castMember.name}</li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-bold">Supporting</h3>
              <ul>
                {cast.map((castMember) => (
                  <li key={castMember.name}>{castMember.name}</li>
                ))}
              </ul>
            </div>
          </section>

          <section className="mt-4 flex p-4 ">
            <h2 className="text-2xl font-bold">Directors</h2>
            <ul>
              {directors.map((director) => (
                <li key={director.name}>{director.name}</li>
              ))}
            </ul>
          </section>

          <section className="mt-4 flex p-4 ">
            <h2 className="text-2xl font-bold">Genres</h2>
            <ul>
              {genres.map((genre) => (
                <li key={genre}>{genre}</li>
              ))}
            </ul>
          </section>

          <section className="mt-4 flex p-4 ">
            <h2 className="text-2xl font-bold">Languages</h2>
            <ul>
              {spoken_languages.map((language) => (
                <li key={language}>{language}</li>
              ))}
            </ul>
          </section>

          <section className="mt-4 flex p-4 ">
            <h2 className="text-2xl font-bold">Videos</h2>
            <ul>
              {videos.map((video) => (
                <li key={video.name}>{video.name}</li>
              ))}
            </ul>
          </section>

          <section className="mt-4 flex p-4 ">
            <h2 className="text-2xl font-bold">Release Date</h2>
            <time>{release_date}</time>
          </section>

          <section className="mt-4 flex p-4 ">
            <h2 className="text-2xl font-bold">Runtime</h2>
            <time>{runtime}</time>
          </section>

          <section className="mt-4 flex p-4 ">
            <h2 className="text-2xl font-bold">Budget</h2>
            <div className="flex items-center">
              <BanknotesIcon className="w-6 h-6 text-red-700" />
              <span>{budget}</span>
            </div>
          </section>

          <section className="mt-4 flex p-4 ">
            <h2 className="text-2xl font-bold">Popularity</h2>
            <span>{popularity}</span>
          </section>

          <section className="mt-4 flex p-4 ">
            <h2 className="text-2xl font-bold">Vote Average</h2>
            <span>{vote_average}</span>
          </section>

          <section className="mt-4 flex p-4 ">
            <h2 className="text-2xl font-bold">Vote Count</h2>
            <span>{vote_count}</span>
          </section>

          <section className="mt-4 flex p-4 ">
            <h2 className="text-2xl font-bold">Bayesian Average</h2>
            <span>{bayesian_avg}</span>
          </section>

          <section className="mt-4 flex p-4 ">
            <h2 className="text-2xl font-bold">Status</h2>
            <span>{status}</span>
          </section>

          <section className="mt-4 flex p-4 ">
            <h2 className="text-2xl font-bold">Tagline</h2>
            <span>{tagline}</span>
          </section>

          <section className="mt-4 flex p-4 ">
            <h2 className="text-2xl font-bold">Original Title</h2>
            <span>{original_title}</span>
          </section>

          <section className="mt-4 flex p-4 ">
            <h2 className="text-2xl font-bold">Original Language</h2>
            <span>{original_language}</span>
          </section>

          <section className="mt-4 flex p-4 ">
            <h2 className="text-2xl font-bold">Collection</h2>
            <span>{belongs_to_collection?.name}</span>
          </section>

          <section className="mt-4 flex p-4 ">
            <h2 className="text-2xl font-bold">Popularity Bucketed</h2>
            <span>{popularity_bucketed}</span>
          </section>

          <section className="mt-4 flex p-4 ">
            <h2 className="text-2xl font-bold">Record Type</h2>
            <span>{record_type}</span>
          </section>

          <section className="mt-4 flex p-4 ">
            <h2 className="text-2xl font-bold">Object ID</h2>
            <span>{objectID}</span>
          </section>

          <section className="mt-4 flex p-4 ">
            <h2 className="text-2xl font-bold">Release Year</h2>
            <span>{release_year}</span>
          </section>

          <button
            className="mt-4 bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
