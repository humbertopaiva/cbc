import { Field, ID, ObjectType } from '@nestjs/graphql';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { Movie } from './movie.entity';

@ObjectType()
@Entity('pending_notifications')
export class PendingNotification {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field(() => Movie)
  @ManyToOne(() => Movie, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'movie_id' })
  movie: Movie;

  @Column({ name: 'movie_id' })
  movieId: string;

  @Field()
  @Column({ name: 'notification_date' })
  notificationDate: Date;

  @Field()
  @Column({ name: 'notification_sent', default: false })
  notificationSent: boolean;

  @Field()
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
