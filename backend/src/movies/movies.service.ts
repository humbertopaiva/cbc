import { Injectable, NotFoundException, ForbiddenException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOptionsWhere } from 'typeorm';
import { Movie } from './entities/movie.entity';
import { CreateMovieInput } from './dto/create-movie.input';
import { UpdateMovieInput } from './dto/update-movie.input';
import { MovieFiltersInput } from './dto/movie-filters.input';
import { MoviesPaginationInput } from './dto/movies-pagination.input';
import { MovieConnection } from './dto/movie-connection';
import { MovieEdge } from './dto/movie-edge';
import { PageInfo } from './dto/page-info';
import { FileUploadService } from '../common/file-upload/file-upload.service';
import { GenresService } from '../genres/genres.service';
import { User } from '../users/entities/user.entity';
import { MovieOrderField, OrderDirection } from './dto/movie-order-by.input';
import { Genre } from '../genres/entities/genre.entity';

@Injectable()
export class MoviesService {
  private readonly logger = new Logger(MoviesService.name);

  constructor(
    @InjectRepository(Movie)
    private readonly moviesRepository: Repository<Movie>,
    private readonly fileUploadService: FileUploadService,
    private readonly genresService: GenresService,
  ) {}

  async findAll(
    filters?: MovieFiltersInput,
    pagination?: MoviesPaginationInput,
  ): Promise<MovieConnection> {
    const queryBuilder = this.moviesRepository
      .createQueryBuilder('movie')
      .leftJoinAndSelect('movie.genres', 'genre')
      .leftJoinAndSelect('movie.createdBy', 'user');

    if (filters) {
      if (filters.search) {
        queryBuilder.andWhere(
          '(movie.title ILIKE :search OR movie.originalTitle ILIKE :search OR movie.description ILIKE :search)',
          { search: `%${filters.search}%` },
        );
      }

      if (filters.minDuration != null) {
        queryBuilder.andWhere('movie.duration >= :minDuration', {
          minDuration: filters.minDuration,
        });
      }

      if (filters.maxDuration != null) {
        queryBuilder.andWhere('movie.duration <= :maxDuration', {
          maxDuration: filters.maxDuration,
        });
      }

      if (filters.releaseDateFrom) {
        queryBuilder.andWhere('movie.releaseDate >= :releaseDateFrom', {
          releaseDateFrom: new Date(filters.releaseDateFrom),
        });
      }

      if (filters.releaseDateTo) {
        queryBuilder.andWhere('movie.releaseDate <= :releaseDateTo', {
          releaseDateTo: new Date(filters.releaseDateTo),
        });
      }

      if (filters.genreIds?.length) {
        queryBuilder.andWhere('genre.id IN (:...genreIds)', {
          genreIds: filters.genreIds,
        });
      }
    }

    const totalCount = await queryBuilder.getCount();

    if (pagination?.orderBy) {
      const { field, direction } = pagination.orderBy;
      const column = this.getOrderByColumn(field);
      queryBuilder.orderBy(column, direction);
    } else {
      queryBuilder.orderBy('movie.title', 'ASC');
    }

    const limit = pagination?.first ?? 10;
    queryBuilder.take(limit);

    if (pagination?.after) {
      const afterMovie = await this.moviesRepository.findOne({
        where: { id: pagination.after } as FindOptionsWhere<Movie>,
      });

      if (afterMovie) {
        const field = pagination.orderBy?.field || MovieOrderField.TITLE;
        const direction = pagination.orderBy?.direction || OrderDirection.ASC;
        const operator = direction === OrderDirection.ASC ? '>' : '<';
        const column = this.getOrderByColumn(field);
        const value = this.getOrderFieldValue(afterMovie, field);

        queryBuilder.andWhere(`${column} ${operator} :cursorValue`, {
          cursorValue: value,
        });
      }
    }

    const movies = await queryBuilder.getMany();

    const edges = movies.map(
      (movie): MovieEdge => ({
        node: movie,
        cursor: movie.id,
      }),
    );

    const pageInfo: PageInfo = {
      hasNextPage: movies.length === limit,
      hasPreviousPage: !!pagination?.after,
      startCursor: edges[0]?.cursor ?? null,
      endCursor: edges[edges.length - 1]?.cursor ?? null,
    };

    return {
      edges,
      pageInfo,
      totalCount,
    };
  }

  async findById(id: string): Promise<Movie> {
    const movie = await this.moviesRepository.findOne({
      where: { id } as FindOptionsWhere<Movie>,
      relations: ['genres', 'createdBy'],
    });

    if (!movie) {
      throw new NotFoundException(`Movie with ID ${id} not found`);
    }

    return movie;
  }

  async create(createMovieInput: CreateMovieInput, user: User): Promise<Movie> {
    try {
      const {
        title,
        originalTitle,
        description,
        budget,
        releaseDate,
        duration,
        genreIds,
        imageFile,
        backdropFile,
        rating,
      } = createMovieInput;

      let imageUrl: string | null = null;
      let backdropUrl: string | null = null;

      // Aqui está a correção principal: verificamos se imageFile existe e tratamos como Upload
      if (imageFile) {
        imageUrl = await this.fileUploadService.uploadFile(imageFile.promise, 'movies/posters');
      }

      // Mesma correção para backdropFile
      if (backdropFile) {
        backdropUrl = await this.fileUploadService.uploadFile(
          backdropFile.promise,
          'movies/backdrops',
        );
      }

      let genres: Genre[] = [];
      if (genreIds?.length) {
        genres = await this.genresService.findByIds(genreIds);
      }

      const newMovie = this.moviesRepository.create({
        title,
        originalTitle: originalTitle ?? null,
        description: description ?? null,
        budget: budget ?? null,
        releaseDate: releaseDate ? new Date(releaseDate) : null,
        duration: duration ?? null,
        imageUrl,
        backdropUrl,
        rating: rating ?? null,
        createdBy: user,
        genres,
      }) as Partial<Movie>;

      return await this.moviesRepository.save(newMovie);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      this.logger.error(`Failed to create movie: ${message}`);
      throw error;
    }
  }

  async update(updateMovieInput: UpdateMovieInput, user: User): Promise<Movie> {
    try {
      const {
        id,
        title,
        originalTitle,
        description,
        budget,
        releaseDate,
        duration,
        genreIds,
        imageFile,
        backdropFile,
        rating,
      } = updateMovieInput;

      const movie = await this.findById(id);

      if (movie.createdBy.id !== user.id) {
        throw new ForbiddenException('You are not authorized to update this movie');
      }

      let imageUrl = movie.imageUrl ?? null;
      let backdropUrl = movie.backdropUrl ?? null;

      // Handle image file update
      if (imageFile) {
        if (movie.imageUrl) {
          await this.fileUploadService.deleteFile(movie.imageUrl);
        }
        imageUrl = await this.fileUploadService.uploadFile(
          imageFile.then(file => file),
          'movies/posters',
        );
      }

      // Handle backdrop file update
      if (backdropFile) {
        if (movie.backdropUrl) {
          await this.fileUploadService.deleteFile(movie.backdropUrl);
        }
        backdropUrl = await this.fileUploadService.uploadFile(
          backdropFile.then(file => file),
          'movies/backdrops',
        );
      }

      // Fetch genres if genreIds are provided, otherwise keep existing genres
      let genres = movie.genres;
      if (genreIds?.length) {
        genres = await this.genresService.findByIds(genreIds);
      }

      Object.assign(movie, {
        title: title ?? movie.title,
        originalTitle: originalTitle ?? movie.originalTitle,
        description: description ?? movie.description,
        budget: budget ?? movie.budget,
        releaseDate: releaseDate ? new Date(releaseDate) : movie.releaseDate,
        duration: duration ?? movie.duration,
        imageUrl,
        backdropUrl,
        rating: rating ?? movie.rating,
        genres,
      });

      return await this.moviesRepository.save(movie);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      this.logger.error(`Failed to update movie: ${message}`);
      throw error;
    }
  }

  async delete(id: string, user: User): Promise<boolean> {
    const movie = await this.findById(id);

    if (movie.createdBy.id !== user.id) {
      throw new ForbiddenException('You are not authorized to delete this movie');
    }

    if (movie.imageUrl) {
      await this.fileUploadService.deleteFile(movie.imageUrl);
    }

    if (movie.backdropUrl) {
      await this.fileUploadService.deleteFile(movie.backdropUrl);
    }

    await this.moviesRepository.delete(id);
    return true;
  }

  private getOrderByColumn(field: MovieOrderField): string {
    switch (field) {
      case MovieOrderField.TITLE:
        return 'movie.title';
      case MovieOrderField.RELEASE_DATE:
        return 'movie.releaseDate';
      case MovieOrderField.DURATION:
        return 'movie.duration';
      case MovieOrderField.RATING:
        return 'movie.rating';
      case MovieOrderField.CREATED_AT:
        return 'movie.createdAt';
      default:
        return 'movie.title';
    }
  }

  private getOrderFieldValue(movie: Movie, field: MovieOrderField): string | number | Date {
    switch (field) {
      case MovieOrderField.TITLE:
        return movie.title;
      case MovieOrderField.RELEASE_DATE:
        return movie.releaseDate ?? new Date(0);
      case MovieOrderField.DURATION:
        return movie.duration ?? 0;
      case MovieOrderField.RATING:
        return movie.rating ?? 0;
      case MovieOrderField.CREATED_AT:
        return movie.createdAt;
      default:
        return movie.title;
    }
  }
}
