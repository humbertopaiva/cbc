import { useState } from 'react'
import { useQuery } from '@apollo/client'
import { GET_GENRES, GET_MOVIES } from '../graphql/movies.graphql'
import type { Genre, MovieConnection, MovieFilters } from '../model/movie.model'

export class MoviesListViewModel {
  setupMoviesQuery(filters?: MovieFilters, first: number = 10, after?: string) {
    const { data, loading, error, fetchMore, refetch } = useQuery<
      { movies: MovieConnection },
      { filters?: MovieFilters; pagination?: { first: number; after?: string } }
    >(GET_MOVIES, {
      variables: {
        filters,
        pagination: {
          first,
          after,
        },
      },
      fetchPolicy: 'cache-and-network',
      notifyOnNetworkStatusChange: true,
    })

    return {
      movies: data?.movies,
      loading,
      error,
      loadMore: (afterCursor: string) => {
        fetchMore({
          variables: {
            pagination: {
              first,
              after: afterCursor,
            },
          },
          updateQuery: (prev, { fetchMoreResult }) => {
            return {
              movies: {
                ...fetchMoreResult.movies,
                edges: [...prev.movies.edges, ...fetchMoreResult.movies.edges],
              },
            }
          },
        })
      },
      refetch,
    }
  }

  setupGenresQuery() {
    const { data, loading } = useQuery<{ genres: Array<Genre> }>(GET_GENRES)
    return {
      genres: data?.genres || [],
      loading,
    }
  }
}

export function useMoviesListViewModel() {
  const [filters, setFilters] = useState<MovieFilters>({})
  const viewModel = new MoviesListViewModel()

  const { movies, loading, error, loadMore, refetch } =
    viewModel.setupMoviesQuery(filters)
  const { genres, loading: loadingGenres } = viewModel.setupGenresQuery()

  const handleFilterChange = (newFilters: MovieFilters) => {
    setFilters(newFilters)
    refetch({
      filters: newFilters,
      pagination: {
        first: 10,
      },
    })
  }

  const handleLoadMore = () => {
    if (movies?.pageInfo.endCursor) {
      loadMore(movies.pageInfo.endCursor)
    }
  }

  return {
    movies,
    genres,
    loading,
    loadingGenres,
    error,
    filters,
    handleFilterChange,
    handleLoadMore,
  }
}
