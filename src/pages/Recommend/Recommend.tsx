import { useSearchParams } from 'react-router-dom';
import React, {
  FC, useCallback, useEffect, useState,
} from 'react';
import {
  Box,
  Grid,
  Paper,
  Container,
} from '@mui/material';
import { useQuery } from '@apollo/client';
import { FormattedMessage } from 'react-intl';
import { Div } from '../Favorites/Favorites';
import { HomeError } from '../Home/HomeError/HomeError';
import { Movie } from '../../components/typedefs/typedefs';
import { MOVIES_BY_IDS_QUERY } from './queries';
import { MovieCard } from '../../components/MovieCard/MovieCard';
import { useMovie } from '../../hooks/useMovie';
import { HomeLoader } from '../Home/HomeLoader/HomeLoader';
import {
  useLocalStorageMovie,
} from '../../components/MovieCard/useLocalStorageMovie';

interface Params {
  ids: number[],
  title: string | null,
}

export const Recommend: FC = () => {
  const [searchParams] = useSearchParams();
  const [params, setParams] = useState<Params>({
    ids: [],
    title: '',
  });

  const [favoriteMovies, setMovie] = useLocalStorageMovie<Movie[]>('movies_favorite', []);

  const handleToggle = useCallback((movie: Movie) => {
    const isAlreadyAdded = favoriteMovies.some(({ id }) => id === movie.id);

    if (isAlreadyAdded) {
      const newMovies = favoriteMovies.filter(({ id }) => id !== movie.id);

      setMovie(newMovies);

      return;
    }

    const newMovies = [...favoriteMovies, movie];

    setMovie(newMovies);
  }, [favoriteMovies, setMovie]);

  const { selectMovie } = useMovie();

  const {
    loading,
    error,
    data,
  } = useQuery(MOVIES_BY_IDS_QUERY, { variables: { ids: params.ids } });

  useEffect(() => {
    const idsForParams = searchParams.get('ids');
    const title = searchParams.get('title');
    const ids = idsForParams !== null
      ? idsForParams.split(',').map((id) => Number(id))
      : [];

    setParams({
      ids,
      title,
    });
  }, [searchParams]);

  return (
    <Container maxWidth="xl">
      <Box sx={{ height: '100%' }}>
        <Paper elevation={3} sx={{ pl: 5, pr: 5, minHeight: 'calc(100vh - 70px)' }}>
          {loading && <HomeLoader />}

          {error && <HomeError text="No selected movies" />}

          {data?.moviesByIds && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Div><FormattedMessage id="your_selected_movies" /></Div>

              <Grid container spacing={2}>
                {data.moviesByIds.map((movie: Movie) => {
                  const isAlreadyAdded = favoriteMovies.some(({ id }) => id === movie.id);

                  return (
                    <Grid key={movie.id} item xs={6} sm={4} md={3} lg={2}>
                      <MovieCard
                        onToggleLC={handleToggle}
                        movie={movie}
                        onCardSelect={selectMovie}
                        isPreviewMode={false}
                        isAdded={isAlreadyAdded}
                      />
                    </Grid>
                  );
                })}
              </Grid>
            </Box>
          )}
        </Paper>
      </Box>
    </Container>
  );
};
