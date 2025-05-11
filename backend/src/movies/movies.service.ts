import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Movie } from './entities/movie.entity';
import { CreateMovieInput } from './dto/create-movie.input';
import { UpdateMovieInput } from './dto/update-movie.input';
import { MovieFiltersInput } from './dto/movie-filters.input';
import {
  MoviesPaginationInput,
  MovieOrderField,
  OrderDirection,
} from './dto/movies-pagination.input';
import { MovieConnection } from './dto/movie-connection';
import { FileUploadService } from '../common/file-upload/file-upload.service';
import { GenresService } from '../genres/genres.service';
import { User } from '../users/entities/user.entity';

@Injectable()
export class MoviesService {
  constructor(
    @InjectRepository(Movie)
    private readonly moviesRepository: Repository<Movie>,
    private readonly fileUploadService: FileUploadService,
    private readonly genresService: GenresService,
  ) {}

  async findAll(
    filters?: MovieFiltersInput,
    pagination?: MoviesPaginationInput,
    user?: User,
  ): Promise<MovieConnection> {
    const qb = this.moviesRepository
      .createQueryBuilder('movie')
      .leftJoinAndSelect('movie.genres', 'genre')
      .leftJoinAndSelect('movie.createdBy', 'user');

    // Filtrar apenas os filmes do usuário logado
    if (user) {
      qb.andWhere('movie.createdBy = :userId', { userId: user.id });
    }

    // Aplicar filtros
    if (filters?.search) {
      qb.andWhere(
        '(movie.title ILIKE :search OR movie.originalTitle ILIKE :search OR movie.description ILIKE :search)',
        {
          search: `%${filters.search}%`,
        },
      );
    }

    if (filters?.minDuration) {
      qb.andWhere('movie.duration >= :minDuration', { minDuration: filters.minDuration });
    }

    if (filters?.maxDuration) {
      qb.andWhere('movie.duration <= :maxDuration', { maxDuration: filters.maxDuration });
    }

    if (filters?.releaseDateFrom) {
      qb.andWhere('movie.releaseDate >= :releaseDateFrom', {
        releaseDateFrom: filters.releaseDateFrom,
      });
    }

    if (filters?.releaseDateTo) {
      qb.andWhere('movie.releaseDate <= :releaseDateTo', { releaseDateTo: filters.releaseDateTo });
    }

    if (filters?.genreIds?.length) {
      qb.andWhere('genre.id IN (:...genreIds)', { genreIds: filters.genreIds });
    }

    if (filters?.status) {
      qb.andWhere('movie.status = :status', { status: filters.status });
    }

    if (filters?.language) {
      qb.andWhere('movie.language ILIKE :language', { language: `%${filters.language}%` });
    }

    // Contar total
    const totalCount = await qb.getCount();

    // Aplicar ordenação
    if (pagination?.orderBy) {
      const { field, direction } = pagination.orderBy;
      const column = this.getOrderByColumn(field);
      qb.orderBy(column, direction);
    } else {
      qb.orderBy('movie.createdAt', 'DESC'); // Ordenação padrão: mais recentes primeiro
    }

    // Aplicar paginação - implementação cursor-based
    const limit = pagination?.first || 10; // Padrão: 10 filmes por página
    qb.take(limit);

    if (pagination?.after) {
      try {
        const lastMovie = await this.findById(pagination.after);
        if (lastMovie) {
          // Obter os valores de ordenação
          const fieldValue = pagination?.orderBy?.field || MovieOrderField.CREATED_AT;
          const directionValue = pagination?.orderBy?.direction || OrderDirection.DESC;

          // Aplicar a condição de paginação apropriada
          this.applyPaginationCondition(qb, fieldValue, directionValue, lastMovie);
        }
      } catch (error) {
        console.error('Error applying cursor pagination:', error);
      }
    }

    const movies = await qb.getMany();

    // Verificar se há próxima página
    const hasNextPage = movies.length === limit;

    // Construir e retornar MovieConnection
    return {
      edges: movies.map(movie => ({
        node: movie,
        cursor: movie.id,
      })),
      pageInfo: {
        hasNextPage: hasNextPage,
        hasPreviousPage: !!pagination?.after,
        startCursor: movies.length > 0 ? movies[0]?.id : undefined,
        endCursor: movies.length > 0 ? movies[movies.length - 1]?.id : undefined,
      },
      totalCount: totalCount,
    };
  }

  // Método auxiliar para aplicar a condição de paginação
  private applyPaginationCondition(
    qb: ReturnType<Repository<Movie>['createQueryBuilder']>,
    field: MovieOrderField,
    direction: OrderDirection,
    lastMovie: Movie,
  ): void {
    // Comparar com os valores do enum em vez de strings
    if (field === MovieOrderField.TITLE) {
      if (direction === OrderDirection.ASC) {
        qb.andWhere('movie.title > :title', { title: lastMovie.title });
      } else {
        qb.andWhere('movie.title < :title', { title: lastMovie.title });
      }
    } else if (field === MovieOrderField.RELEASE_DATE) {
      if (direction === OrderDirection.ASC) {
        qb.andWhere('movie.releaseDate > :releaseDate', {
          releaseDate: lastMovie.releaseDate,
        });
      } else {
        qb.andWhere('movie.releaseDate < :releaseDate', {
          releaseDate: lastMovie.releaseDate,
        });
      }
    } else if (field === MovieOrderField.DURATION) {
      if (direction === OrderDirection.ASC) {
        qb.andWhere('movie.duration > :duration', { duration: lastMovie.duration });
      } else {
        qb.andWhere('movie.duration < :duration', { duration: lastMovie.duration });
      }
    } else if (field === MovieOrderField.RATING) {
      if (direction === OrderDirection.ASC) {
        qb.andWhere('movie.rating > :rating', { rating: lastMovie.rating });
      } else {
        qb.andWhere('movie.rating < :rating', { rating: lastMovie.rating });
      }
    } else {
      // CREATED_AT é o padrão
      if (direction === OrderDirection.ASC) {
        qb.andWhere('movie.createdAt > :createdAt', { createdAt: lastMovie.createdAt });
      } else {
        qb.andWhere('movie.createdAt < :createdAt', { createdAt: lastMovie.createdAt });
      }
    }
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
    const {
      title,
      originalTitle,
      description,
      tagline,
      budget,
      revenue,
      releaseDate,
      duration,
      status,
      language,
      trailerUrl,
      popularity,
      voteCount,
      genreIds,
      imageUrl,
      imageKey,
      backdropUrl,
      backdropKey,
      rating,
    } = createMovieInput;

    // Calcular o lucro se orçamento e receita estiverem disponíveis
    let profit = undefined;
    if (budget !== undefined && revenue !== undefined) {
      profit = revenue - budget;
    }

    // Buscar gêneros
    const genres = genreIds?.length ? await this.genresService.findByIds(genreIds) : [];

    // Criar filme
    const movie = this.moviesRepository.create({
      title,
      originalTitle,
      description,
      tagline,
      budget,
      revenue,
      profit,
      releaseDate,
      duration,
      status,
      language,
      trailerUrl,
      popularity,
      voteCount,
      imageUrl,
      imageKey,
      backdropUrl,
      backdropKey,
      rating,
      createdBy: user,
      genres,
    });

    return this.moviesRepository.save(movie);
  }

  async update(updateMovieInput: UpdateMovieInput, user: User): Promise<Movie> {
    const {
      id,
      title,
      originalTitle,
      description,
      tagline,
      budget,
      revenue,
      releaseDate,
      duration,
      status,
      language,
      trailerUrl,
      popularity,
      voteCount,
      genreIds,
      imageUrl,
      imageKey,
      backdropUrl,
      backdropKey,
      rating,
    } = updateMovieInput;

    const movie = await this.findById(id);

    // Verificar se o usuário é o criador do filme
    if (movie.createdBy.id !== user.id) {
      throw new Error('You are not authorized to update this movie');
    }

    // Calcular o lucro se orçamento e receita estiverem disponíveis
    let profit = movie.profit;
    if (budget !== undefined && revenue !== undefined) {
      profit = revenue - budget;
    } else if (budget !== undefined && movie.revenue !== undefined) {
      profit = movie.revenue - budget;
    } else if (revenue !== undefined && movie.budget !== undefined) {
      profit = revenue - movie.budget;
    }

    // Buscar gêneros
    let genres = movie.genres;
    if (genreIds?.length) {
      genres = await this.genresService.findByIds(genreIds);
    }

    // Atualizar filme
    Object.assign(movie, {
      title: title ?? movie.title,
      originalTitle: originalTitle ?? movie.originalTitle,
      description: description ?? movie.description,
      tagline: tagline ?? movie.tagline,
      budget: budget ?? movie.budget,
      revenue: revenue ?? movie.revenue,
      profit,
      releaseDate: releaseDate ?? movie.releaseDate,
      duration: duration ?? movie.duration,
      status: status ?? movie.status,
      language: language ?? movie.language,
      trailerUrl: trailerUrl ?? movie.trailerUrl,
      popularity: popularity ?? movie.popularity,
      voteCount: voteCount ?? movie.voteCount,
      imageUrl: imageUrl ?? movie.imageUrl,
      imageKey: imageKey ?? movie.imageKey,
      backdropUrl: backdropUrl ?? movie.backdropUrl,
      backdropKey: backdropKey ?? movie.backdropKey,
      rating: rating ?? movie.rating,
      genres,
    });

    return this.moviesRepository.save(movie);
  }

  async delete(id: string, user: User): Promise<boolean> {
    const movie = await this.findById(id);

    // Verificar se o usuário é o criador do filme
    if (movie.createdBy.id !== user.id) {
      throw new Error('You are not authorized to delete this movie');
    }

    // Limpar arquivos de imagem
    if (movie.imageKey) {
      // Se o FileUploadService espera um segundo argumento 'user'
      await this.fileUploadService.deleteFile(movie.imageKey, user);
    }

    if (movie.backdropKey) {
      await this.fileUploadService.deleteFile(movie.backdropKey, user);
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
      default:
        return 'movie.createdAt';
    }
  }
}
