// src/movies/entities/movie.entity.ts
import { Field, ID, ObjectType, Float, Int } from '@nestjs/graphql';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  ManyToMany,
  JoinTable,
  JoinColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Genre } from '../../genres/entities/genre.entity';

@ObjectType()
@Entity('movies')
export class Movie {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field()
  @Column()
  title: string;

  @Field({ nullable: true })
  @Column({ name: 'original_title', nullable: true })
  originalTitle?: string | null;

  @Field({ nullable: true })
  @Column({ type: 'text', nullable: true })
  description?: string | null;

  @Field(() => Float, { nullable: true })
  @Column({ type: 'decimal', precision: 15, scale: 2, nullable: true })
  budget?: number | null;

  @Field({ nullable: true })
  @Column({ name: 'release_date', nullable: true })
  releaseDate?: Date | null;

  @Field(() => Int, { nullable: true })
  @Column({ nullable: true })
  duration?: number | null;

  @Field({ nullable: true })
  @Column({ name: 'image_url', nullable: true })
  imageUrl?: string | null;

  @Field({ nullable: true })
  @Column({ name: 'backdrop_url', nullable: true })
  backdropUrl?: string | null;

  @Field(() => Float, { nullable: true })
  @Column({ type: 'decimal', precision: 3, scale: 1, nullable: true })
  rating?: number | null;

  @Field(() => User)
  @ManyToOne(() => User, user => user.movies)
  @JoinColumn({ name: 'created_by' })
  createdBy: User;

  @Field()
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @Field()
  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @Field(() => [Genre])
  @ManyToMany(() => Genre, genre => genre.movies)
  @JoinTable({
    name: 'movie_genres',
    joinColumn: { name: 'movie_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'genre_id', referencedColumnName: 'id' },
  })
  genres: Genre[];
}
