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

export enum MovieStatus {
  RELEASED = 'released',
  IN_PRODUCTION = 'in_production',
}

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
  originalTitle?: string;

  @Field({ nullable: true })
  @Column({ type: 'text', nullable: true })
  description?: string;

  @Field({ nullable: true })
  @Column({ type: 'text', nullable: true, name: 'tagline' })
  tagline?: string;

  @Field(() => Float, { nullable: true })
  @Column({ type: 'decimal', precision: 15, scale: 2, nullable: true })
  budget?: number;

  @Field(() => Float, { nullable: true })
  @Column({ type: 'decimal', precision: 15, scale: 2, nullable: true, name: 'revenue' })
  revenue?: number;

  @Field(() => Float, { nullable: true })
  @Column({ type: 'decimal', precision: 15, scale: 2, nullable: true, name: 'profit' })
  profit?: number;

  @Field({ nullable: true })
  @Column({ name: 'release_date', nullable: true })
  releaseDate?: Date;

  @Field(() => Int, { nullable: true })
  @Column({ nullable: true })
  duration?: number;

  @Field({ nullable: true })
  @Column({
    name: 'status',
    type: 'enum',
    enum: MovieStatus,
    default: MovieStatus.IN_PRODUCTION,
    nullable: true,
  })
  status?: MovieStatus;

  @Field({ nullable: true })
  @Column({ name: 'language', nullable: true })
  language?: string;

  @Field({ nullable: true })
  @Column({ name: 'trailer_url', nullable: true })
  trailerUrl?: string;

  @Field(() => Int, { nullable: true })
  @Column({ type: 'int', nullable: true, name: 'popularity' })
  popularity?: number;

  @Field(() => Int, { nullable: true })
  @Column({ type: 'int', nullable: true, name: 'vote_count' })
  voteCount?: number;

  @Field({ nullable: true })
  @Column({ name: 'image_url', nullable: true })
  imageUrl?: string;

  @Field({ nullable: true })
  @Column({ name: 'image_key', nullable: true })
  imageKey?: string;

  @Field({ nullable: true })
  @Column({ name: 'backdrop_url', nullable: true })
  backdropUrl?: string;

  @Field({ nullable: true })
  @Column({ name: 'backdrop_key', nullable: true })
  backdropKey?: string;

  @Field(() => Float, { nullable: true })
  @Column({ type: 'decimal', precision: 3, scale: 1, nullable: true })
  rating?: number;

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
