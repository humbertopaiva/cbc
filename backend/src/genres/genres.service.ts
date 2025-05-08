import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Genre } from './entities/genre.entity';

@Injectable()
export class GenresService {
  constructor(
    @InjectRepository(Genre)
    private readonly genresRepository: Repository<Genre>,
  ) {}

  async findAll(): Promise<Genre[]> {
    return this.genresRepository.find();
  }

  async findById(id: string): Promise<Genre> {
    const genre = await this.genresRepository.findOne({ where: { id } });

    if (!genre) {
      throw new NotFoundException(`Genre with ID ${id} not found`);
    }

    return genre;
  }

  async findByIds(ids: string[]): Promise<Genre[]> {
    return this.genresRepository.find({ where: { id: In(ids) } });
  }

  async findByName(name: string): Promise<Genre | null> {
    return this.genresRepository.findOne({ where: { name } });
  }

  async create(data: { name: string }): Promise<Genre> {
    const genre = this.genresRepository.create(data);
    return this.genresRepository.save(genre);
  }
}
