import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Movie } from './entities/movie.entity';
import { FileUploadModule } from '../common/file-upload/file-upload.module';
import { EmailModule } from '../common/email/email.module';
import { GenresModule } from '../genres/genres.module';
import { MoviesService } from './movies.service';
import { MoviesResolver } from './movies.resolver';
import { NotificationService } from './notification.service';

@Module({
  imports: [TypeOrmModule.forFeature([Movie]), FileUploadModule, EmailModule, GenresModule],
  providers: [MoviesService, MoviesResolver, NotificationService],
  exports: [MoviesService],
})
export class MoviesModule {}
