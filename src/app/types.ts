import { Hit, BaseHit } from "instantsearch.js";

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
  // Define the properties of a video if available
};

type Collection = {
  // Define the properties of a collection if available
};

export type MovieResponse = {
  hits: Movie[];
};
