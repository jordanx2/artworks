import { Artwork } from '../../model/artwork.model';
import { mapArtworksFromApi } from '../artworks-api/artwork.api.mappers';
import baseApiAxios from '../base-axios-api/base-axios-api';

const ENDPOINT = 'collections';

// Get all collections for a user
export const getUserCollections = async (username: string) => {
  const response = await baseApiAxios.get<Artwork[]>(`users/${username}/${ENDPOINT}`);
  return response.data.map(res => mapArtworksFromApi(res));
};

// Add a new artwork to a user's collection
export const addToUserCollections = async (username: string, artworkId: string) => {
  const response = await baseApiAxios.post<{ message: string; collections: string[] }>(`users/${username}/${ENDPOINT}`,{ artworkId });
  return response.data;
};

// Remove an artwork from a user's collection
export const removeFromUserCollections = async (username: string, artworkId: string) => {
  const response = await baseApiAxios.delete<{ message: string; collections: string[] }>(`users/${username}/${ENDPOINT}`, { data: { artworkId } });

  return response.data;
};
