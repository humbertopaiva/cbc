import React from 'react'
import { Link } from '@tanstack/react-router'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import type { Movie } from '../model/movie.model'

interface MovieCardProps {
  movie: Movie
}

export const MovieCard: React.FC<MovieCardProps> = ({ movie }) => {
  return (
    <div className="bg-card shadow-md rounded-lg overflow-hidden transition-transform hover:scale-[1.02]">
      <div className="relative h-48 overflow-hidden">
        <img
          src={movie.imageUrl || 'https://placehold.co/600x400?text=No+Image'}
          alt={movie.title}
          className="w-full h-full object-cover"
        />
        {movie.rating && (
          <span className="absolute top-2 right-2 bg-primary text-primary-foreground px-2 py-1 rounded-full text-sm font-bold">
            {movie.rating}/10
          </span>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-bold text-lg mb-1 line-clamp-1">{movie.title}</h3>
        {movie.originalTitle && (
          <p className="text-muted-foreground text-sm italic mb-2 line-clamp-1">
            {movie.originalTitle}
          </p>
        )}
        {movie.releaseDate && (
          <p className="text-sm mb-2">
            <span className="font-medium">Lançamento:</span>{' '}
            {format(new Date(movie.releaseDate), 'dd/MM/yyyy', {
              locale: ptBR,
            })}
          </p>
        )}
        {movie.duration && (
          <p className="text-sm mb-2">
            <span className="font-medium">Duração:</span> {movie.duration} min
          </p>
        )}
        <div className="flex flex-wrap gap-1 mt-2">
          {movie.genres.slice(0, 3).map((genre) => (
            <span
              key={genre.id}
              className="bg-secondary text-secondary-foreground text-xs px-2 py-1 rounded-full"
            >
              {genre.name}
            </span>
          ))}
          {movie.genres.length > 3 && (
            <span className="bg-secondary text-secondary-foreground text-xs px-2 py-1 rounded-full">
              +{movie.genres.length - 3}
            </span>
          )}
        </div>
        <div className="mt-4 flex justify-end">
          <Link
            to="/movies/$id"
            params={{ id: movie.id }}
            className="text-primary hover:underline text-sm"
          >
            Ver detalhes
          </Link>
        </div>
      </div>
    </div>
  )
}
