export interface Movie {
  id: number;
  title: string;
  overview: string;
  release_date: string;
  poster_path: string;
}

export interface MovieQuery {
  results: Movie[];
}
