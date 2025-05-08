import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GenresService } from './genres.service';
import { Genre } from './entities/genre.entity';
import { GenresResolver } from './genres.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([Genre])],
  providers: [GenresService, GenresResolver],
  exports: [GenresService],
})
export class GenresModule {}
