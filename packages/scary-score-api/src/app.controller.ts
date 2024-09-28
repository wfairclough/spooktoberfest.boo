import { Body, Controller, Get, Param, ParseIntPipe, Post, Query, UsePipes } from '@nestjs/common';
import { AppService } from './app.service';
import { MoviesService } from './movies.service';
import { ZodValidationPipe } from './zod-validation.pipe';
import { Nomination, NominationSchema, NominationService } from './nomination.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly moviesService: MoviesService,
    private readonly nominationService: NominationService,
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

  @Post('nominations')
  @UsePipes(new ZodValidationPipe(NominationSchema))
  nominateMovies(@Body() nomination: Nomination) {
    return this.nominationService.nominateMovies(nomination);
  }
}

