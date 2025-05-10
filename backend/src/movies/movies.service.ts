import { Injectable, NotFoundException, ForbiddenException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
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
import { NotificationService } from './notification.service';

@Injectable()
export class MoviesService {
  private readonly logger = new Logger(MoviesService.name);

  constructor(
    @InjectRepository(Movie)
    private readonly moviesRepository: Repository<Movie>,
    private readonly fileUploadService: FileUploadService,
    private readonly genresService: GenresService,
    private readonly notificationService: NotificationService,
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

      if (filters.status) {
        queryBuilder.andWhere('movie.status = :status', {
          status: filters.status,
        });
      }

      if (filters.language) {
        queryBuilder.andWhere('movie.language ILIKE :language', {
          language: `%${filters.language}%`,
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
        where: { id: pagination.after },
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
      startCursor: edges[0]?.cursor,
      endCursor: edges[edges.length - 1]?.cursor,
    };

    return {
      edges,
      pageInfo,
      totalCount,
    };
  }

  async findById(id: string): Promise<Movie> {
    const movie = await this.moviesRepository.findOne({
      where: { id },
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
        revenue,
        releaseDate,
        duration,
        genreIds,
        imageUrl,
        imageKey,
        backdropUrl,
        backdropKey,
        rating,
        status,
        language,
        trailerUrl,
        popularity,
        voteCount,
        tagline, // Adicionando a desestruturação da tagline aqui
      } = createMovieInput;

      // Calcular lucro se orçamento e receita estiverem disponíveis
      let profit: number | undefined = undefined;
      if (budget !== undefined && revenue !== undefined) {
        profit = revenue - budget;
      }

      // Buscar gêneros
      let genres: Genre[] = [];
      if (genreIds?.length) {
        genres = await this.genresService.findByIds(genreIds);
      }

      // Criar nova movie
      const movie = new Movie();
      movie.title = title;
      movie.originalTitle = originalTitle;
      movie.description = description;
      movie.budget = budget;
      movie.revenue = revenue;
      movie.profit = profit;
      movie.releaseDate = releaseDate ? new Date(releaseDate) : undefined;
      movie.duration = duration;
      movie.status = status;
      movie.language = language;
      movie.trailerUrl = trailerUrl;
      movie.popularity = popularity;
      movie.voteCount = voteCount;
      movie.imageUrl = imageUrl || 'https://placehold.co/600x400?text=No+Image';
      movie.imageKey = imageKey;
      movie.backdropUrl = backdropUrl || 'https://placehold.co/1200x600?text=No+Backdrop';
      movie.backdropKey = backdropKey;
      movie.rating = rating;
      movie.createdBy = user;
      movie.tagline = tagline;
      movie.genres = genres;

      // Salvar o filme
      const savedMovie = await this.moviesRepository.save(movie);

      // Agendar notificação se a data de lançamento estiver no futuro
      if (savedMovie.releaseDate) {
        await this.notificationService.scheduleReleaseNotification(savedMovie);
      }

      return savedMovie;
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
        revenue,
        releaseDate,
        duration,
        genreIds,
        imageUrl,
        imageKey,
        backdropUrl,
        backdropKey,
        rating,
        status,
        language,
        trailerUrl,
        popularity,
        voteCount,
        tagline, // Adicionando a desestruturação da tagline aqui
      } = updateMovieInput;

      const movie = await this.findById(id);

      if (movie.createdBy.id !== user.id) {
        throw new ForbiddenException('You are not authorized to update this movie');
      }

      // Calcular lucro se orçamento e receita estiverem disponíveis
      let profit: number | undefined = undefined;
      if (budget !== undefined && revenue !== undefined) {
        profit = revenue - budget;
      } else if (budget !== undefined && movie.revenue !== undefined) {
        profit = movie.revenue - budget;
      } else if (revenue !== undefined && movie.budget !== undefined) {
        profit = revenue - movie.budget;
      }

      // Verificar se as imagens foram alteradas e excluir as antigas se necessário
      if (imageUrl !== undefined && imageUrl !== movie.imageUrl && movie.imageKey) {
        try {
          // Só tenta excluir se a imagem antiga for do próprio usuário
          if (movie.imageKey.includes(`/${user.id}/`)) {
            await this.fileUploadService.deleteFile(movie.imageKey, user);
          }
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Unknown error';
          this.logger.warn(`Failed to delete old image: ${errorMessage}`);
        }
      }

      if (backdropUrl !== undefined && backdropUrl !== movie.backdropUrl && movie.backdropKey) {
        try {
          // Só tenta excluir se o backdrop antigo for do próprio usuário
          if (movie.backdropKey.includes(`/${user.id}/`)) {
            await this.fileUploadService.deleteFile(movie.backdropKey, user);
          }
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Unknown error';
          this.logger.warn(`Failed to delete old image: ${errorMessage}`);
        }
      }

      // Buscar gêneros se genreIds são fornecidos, caso contrário manter os gêneros existentes
      let genres = movie.genres;
      if (genreIds?.length) {
        genres = await this.genresService.findByIds(genreIds);
      }

      // Armazenar a data de lançamento antiga para comparação
      const oldReleaseDate = movie.releaseDate;
      const newReleaseDate = releaseDate ? new Date(releaseDate) : oldReleaseDate;

      // Atualizar apenas os campos fornecidos
      if (title !== undefined) movie.title = title;
      if (originalTitle !== undefined) movie.originalTitle = originalTitle;
      if (description !== undefined) movie.description = description;
      if (budget !== undefined) movie.budget = budget;
      if (revenue !== undefined) movie.revenue = revenue;
      if (profit !== undefined) movie.profit = profit;
      if (releaseDate !== undefined) movie.releaseDate = new Date(releaseDate);
      if (duration !== undefined) movie.duration = duration;
      if (status !== undefined) movie.status = status;
      if (language !== undefined) movie.language = language;
      if (trailerUrl !== undefined) movie.trailerUrl = trailerUrl;
      if (popularity !== undefined) movie.popularity = popularity;
      if (voteCount !== undefined) movie.voteCount = voteCount;
      if (imageUrl !== undefined) movie.imageUrl = imageUrl;
      if (imageKey !== undefined) movie.imageKey = imageKey;
      if (backdropUrl !== undefined) movie.backdropUrl = backdropUrl;
      if (backdropKey !== undefined) movie.backdropKey = backdropKey;
      if (rating !== undefined) movie.rating = rating;
      if (tagline !== undefined) movie.tagline = tagline;
      if (genres) movie.genres = genres;

      const updatedMovie = await this.moviesRepository.save(movie);

      // Verificar se a data de lançamento foi alterada e se é no futuro
      const now = new Date();
      if (
        newReleaseDate &&
        (!oldReleaseDate || newReleaseDate.getTime() !== oldReleaseDate.getTime()) &&
        newReleaseDate > now
      ) {
        // Se a data foi alterada, agendar uma nova notificação
        await this.notificationService.scheduleReleaseNotification(updatedMovie);
      }

      return updatedMovie;
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

    // Excluir imagens associadas, se houver
    if (movie.imageKey) {
      try {
        await this.fileUploadService.deleteFile(movie.imageKey, user);
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Unknown error';
        this.logger.error(`Failed to delete movie image: ${message}`);
        throw error;
      }
    }

    if (movie.backdropKey) {
      try {
        await this.fileUploadService.deleteFile(movie.backdropKey, user);
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Unknown error';
        this.logger.error(`Failed to delete movie backdrop: ${message}`);
        throw error;
      }
    }

    await this.moviesRepository.remove(movie);
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
