import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Entity, PrimaryGeneratedColumn, Column, ManyToMany } from 'typeorm';
import type { Movie } from '../../movies/entities/movie.entity';

@ObjectType()
@Entity('genres')
export class Genre {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field()
  @Column({ unique: true })
  name: string;

  @Field(() => [Object], { description: 'Related movies' })
  @ManyToMany('Movie', 'genres')
  movies: Movie[];
}
