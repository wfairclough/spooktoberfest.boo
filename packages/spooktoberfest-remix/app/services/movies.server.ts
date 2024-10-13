import { Movie } from "~/models/movies";
import { CacheService, globalCacheService } from "./cache.server";

const movieDbUrlPrefix = `https://api.themoviedb.org/3`;

export interface SearchResults<T> {
  page: number;
  results: T[];
  total_results: number;
  total_pages: number;
}


const MovieTrailers: Record<string, string> = {
  '2675': 'https://www.youtube.com/watch?v=dUw26F0WfLg', // Signs
  '1216191': 'https://www.youtube.com/watch?v=tLNDvnv8B3A', // Oddity
  '938614': 'https://www.youtube.com/watch?v=cvt-mauboTc', // Late Night with the devil
  '723419': 'https://www.youtube.com/watch?v=4Un_ker71dg', // My Haringtons Phone
  '242224': 'https://www.youtube.com/watch?v=k5WQZzDRVtw', // The Babadook
  '597208': 'https://www.youtube.com/watch?v=Q81Yf46Oj3s', // Nightmare Alley
  '1032823': 'https://www.youtube.com/watch?v=hJiPAJKjUVg', // Trap (2024)
  '1700': 'https://www.youtube.com/watch?v=XHQ9CPRfDsw', // Misery 
  '493922': 'https://www.youtube.com/watch?v=V6wWKNij_1M', // Hereditary
  '1091': 'https://www.youtube.com/watch?v=5ftmr17M-a4', // The Thing (1982)
  '1226578': 'https://www.youtube.com/watch?v=FXOtkvx25gI', // Longlegs (2024)
  '49018': 'https://www.youtube.com/watch?v=zuZnRUcoWos', // Insidious
  '82507': 'https://www.youtube.com/watch?v=apghx7q9oeY', // Sinister
  '397243': 'https://www.youtube.com/watch?v=BNxsaFCzqxc', // The autopsy of Jane Doe
  '21506': 'https://www.youtube.com/watch?v=ixVC1LYEMbM', // Noroi: The curse 
  '9374': 'https://www.youtube.com/watch?v=NFXQQ2uAeHM', // Death Becomes her
  '530385': 'https://www.youtube.com/watch?v=1Vnghdsjmd0', // Midsommer
  '31417': 'https://www.youtube.com/watch?v=qSrgdWjOASc', // Eyes without a face
  '858017': 'https://www.youtube.com/watch?v=kymDzCgPwj0', // I saw the TV Glow
  '920': 'https://www.youtube.com/watch?v=pQly7_Cj34U', // Cars
  '8413': 'https://www.youtube.com/watch?v=OVlnER8SxfQ', // Event Horizon
  '931628': 'https://www.youtube.com/watch?v=I_okcXmUx2s', // A Sacrifice
  '869291': 'https://www.youtube.com/watch?v=NuON7HH0UkQ', // Cuckoo
}


export class MoviesService {

  constructor(
    private readonly tmdbApiToken: string,
    private readonly cacheService: CacheService,
  ) {
    console.log('MoviesService initialized');
    console.log('tmdbApiToken:', tmdbApiToken);
  }

  async searchMovies(
    query: string,
    page: number = 1,
  ): Promise<SearchResults<Movie>> {
    const url = encodeURI(`https://api.themoviedb.org/3/search/movie?query=${query}&page=${page}`);
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${this.tmdbApiToken}`,
        Accept: 'application/json',
      },
    });
    const searchResults = await response.json();
    return searchResults;
  }

  async searchHorrorMovies(
    query: string,
    page: number = 1,
  ) {
    const url = encodeURI(`https://api.themoviedb.org/3/search/movie?query=${query}&page=${page}`);
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${this.tmdbApiToken}`,
        Accept: 'application/json',
      },
    });
    const searchResults = await response.json();
    const horrorMovies = searchResults.results.filter((movie: any) => {
      console.log(movie);
      return movie.genre_ids?.includes(27) || movie.genre_ids?.includes(53) || movie.genre_ids?.includes(80);
    });
    const diff = searchResults.results.length - horrorMovies.length;
    if (diff > 0) {
      searchResults.results = horrorMovies;
    }
    return searchResults;
  }

  async getMovieDetails(movieId: string) {
    const cacheKey = `movie:${movieId}`;
    const cachedMovie = await this.cacheService.get(cacheKey);
    if (cachedMovie) {
      const mv = JSON.parse(cachedMovie);
      mv.trailerUrl = MovieTrailers[mv.id + ''];
      return mv;
    }
    const url = `${movieDbUrlPrefix}/movie/${movieId}`;
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${this.tmdbApiToken}`,
        Accept: 'application/json',
      },
    });
    const movieDetails = await response.json();
    movieDetails.trailerUrl = MovieTrailers[movieDetails.id + ''];
    await this.cacheService.set(cacheKey, JSON.stringify(movieDetails), { EX: 3600 });
    return movieDetails;
  }
}

export const globalMoviesService = new MoviesService(
  process.env.TMDB_API_TOKEN!,
  globalCacheService,
);

