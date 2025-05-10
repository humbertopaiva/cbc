export interface Genre {
  id: string
  name: string
}

export interface Movie {
  id: string
  title: string
  originalTitle?: string
  description?: string
  budget?: number
  releaseDate?: string
  duration?: number
  imageUrl?: string
  imageKey?: string
  backdropUrl?: string
  backdropKey?: string
  rating?: number
  createdBy: {
    id: string
    name: string
  }
  genres: Array<Genre>
  createdAt: string
  updatedAt: string
}

export interface MovieEdge {
  cursor: string
  node: Movie
}

export interface PageInfo {
  hasNextPage: boolean
  hasPreviousPage: boolean
  startCursor?: string
  endCursor?: string
}

export interface MovieConnection {
  edges: Array<MovieEdge>
  pageInfo: PageInfo
  totalCount: number
}

export interface MovieFilters {
  search?: string
  minDuration?: number
  maxDuration?: number
  releaseDateFrom?: string
  releaseDateTo?: string
  genreIds?: Array<string>
}

export interface CreateMovieInput {
  title: string
  originalTitle?: string
  description?: string
  budget?: number
  releaseDate?: string
  duration?: number
  genreIds?: Array<string>
  imageUrl?: string
  imageKey?: string
  backdropUrl?: string
  backdropKey?: string
  rating?: number
}

export interface UpdateMovieInput {
  id: string
  title?: string
  originalTitle?: string
  description?: string
  budget?: number
  releaseDate?: string
  duration?: number
  genreIds?: Array<string>
  imageUrl?: string
  imageKey?: string
  backdropUrl?: string
  backdropKey?: string
  rating?: number
}
