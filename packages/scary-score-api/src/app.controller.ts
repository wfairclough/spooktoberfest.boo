import { Controller, Get, Param, ParseIntPipe, Query } from '@nestjs/common';
import { AppService } from './app.service';
import { MoviesService } from './movies.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly moviesService: MoviesService,
  ) {}

  @Get('movies/:movieId/scary-meter-ratings')
  getScaryMeterRating(@Param('movieId') movieId: string) {
    return this.appService.getScaryMeterRating(movieId);
  }

  @Get('movies')
  searchMovies(
    @Query('query') query: string,
    @Query('page', ParseIntPipe) page: number,
  ) {
    return this.moviesService.searchMovies(query, page);
  }

  @Get('movies/horror/search')
  searchHorrorMovies(
    @Query('query') query: string,
    @Query('page', ParseIntPipe) page: number,
  ) {
    return this.moviesService.searchHorrorMovies(query, page);
  }

  @Get('movies/:movieId')
  getMovieById(@Param('movieId') movieId: string) {
    return this.moviesService.getMovieDetails(movieId);
  }
}
