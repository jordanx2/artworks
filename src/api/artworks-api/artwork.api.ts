import { Artwork, ArtworkFormik } from '../../model/artwork.model';
import { mapArtworksFromApi, mapArtworksToApi } from './artwork.api.mappers';
import baseApiAxios from '../base-axios-api/base-axios-api';

const ENDPOINT = 'artworks';

// Get all artworks
export const getAllArtworks = async () => {
  const response = await baseApiAxios.get<Artwork[]>(ENDPOINT);

  return response.data.map(res => mapArtworksFromApi(res));
};

// Get artwork by ID
export const getArtworkById = async (id: string) => {
  const response = await baseApiAxios.get<Artwork>(`${ENDPOINT}/${id}`);
  return response.data;
};

// Search artworks
export const searchArtworks = async (criteria: Partial<ArtworkFormik>) => {
  const params = new URLSearchParams();

  if (criteria.Title) params.append('Title', criteria.Title);
  if (criteria.Artist) params.append('Artist', criteria.Artist);
  if (criteria._id) params.append('_id', criteria._id);

  const response = await baseApiAxios.get<Artwork[]>(`${ENDPOINT}/search`, {
    params
  });

  return response.data.map(res => mapArtworksFromApi(res));
};

// Create a new artwork
export const createArtwork = async (artwork: ArtworkFormik) => {
  const response = await baseApiAxios.post<Artwork>(ENDPOINT, mapArtworksToApi(artwork));
  return mapArtworksFromApi(response.data);
};

// Update an existing artwork
export const updateArtwork = async (updated: ArtworkFormik) => {
  const response = await baseApiAxios.put<Artwork>(`${ENDPOINT}/${updated._id}`, mapArtworksToApi(updated));
  return mapArtworksFromApi(response.data);
};

// Delete an artwork
export const deleteArtwork = async (id: string) => {
  const response = await baseApiAxios.delete<{ message: string }>(`${ENDPOINT}/${id}`);
  return response.data;
};