import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CacheService } from './cache.service';
import { ConfigModule } from '@nestjs/config';
import { MoviesService } from './movies.service';

@Module({
  imports: [
    ConfigModule.forRoot(),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    CacheService,
    MoviesService,
    {
      provide: 'REDIS_URL',
      useValue: process.env.REDIS_URL,
    },
    {
      provide: 'TMDB_API_TOKEN',
      useValue: process.env.TMDB_API_TOKEN,
    },
  ],
})
export class AppModule { }
