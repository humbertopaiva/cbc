import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { MoviesModule } from './movies/movies.module';
import { GenresModule } from './genres/genres.module';
import { CommonModule } from './common/common.module';
import { GraphQLModule } from './graphql.module';
import { User } from './users/entities/user.entity';
import { Movie } from './movies/entities/movie.entity';
import { Genre } from './genres/entities/genre.entity';
import { PendingNotification } from './movies/entities/pending-notification.entity';
import { EmailModule } from './common/email/email.module';
import { PasswordResetToken } from './auth/entities/password-reset-token.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DB_HOST', 'localhost'),
        port: configService.get('DB_PORT', 5432),
        username: configService.get('DB_USERNAME', 'postgres'),
        password: configService.get('DB_PASSWORD', 'postgres'),
        database: configService.get('DB_DATABASE', 'cubos_movies'),
        entities: [User, Movie, Genre, PendingNotification, PasswordResetToken],
        synchronize: configService.get('NODE_ENV') !== 'production',
        logging: configService.get('NODE_ENV') !== 'production',
      }),
    }),
    GraphQLModule,
    ScheduleModule.forRoot(),
    AuthModule,
    UsersModule,
    MoviesModule,
    GenresModule,
    CommonModule,
    EmailModule,
  ],
})
export class AppModule {}
