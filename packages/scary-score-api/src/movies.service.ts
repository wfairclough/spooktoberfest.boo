import { Inject, Injectable } from "@nestjs/common";
import { CacheService } from "./cache.service";
import { urlencoded } from "express";

const movieDbUrlPrefix = `https://api.themoviedb.org/3`;

@Injectable()
export class MoviesService {

  constructor(
    @Inject('TMDB_API_TOKEN') private readonly tmdbApiToken: string,
    private readonly cacheService: CacheService,
  ) {}

  async searchMovies(
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
      return JSON.parse(cachedMovie);
    }
    const url = `${movieDbUrlPrefix}/movie/${movieId}`;
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${this.tmdbApiToken}`,
        Accept: 'application/json',
      },
    });
    const movieDetails = await response.json();
    await this.cacheService.set(cacheKey, JSON.stringify(movieDetails), { EX: 3600 });
    return movieDetails;
  }
}

