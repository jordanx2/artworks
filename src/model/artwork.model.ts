export interface Artwork {
  _id?: string;
  Title: string;
  Artist: string[];
  ConstituentID?: number[];
  ArtistBio?: string[];
  Nationality?: string[];
  BeginDate?: number[];
  EndDate?: number[];
  Gender?: string[];
  Date: string;
  Medium?: string;
  Dimensions?: string;
  CreditLine?: string;
  AccessionNumber?: string;
  Classification: string;
  Department?: string;
  DateAcquired?: string;
  Cataloged?: string;
  ObjectID: number;
  URL: string;
  ImageURL?: string;
  OnView?: string;
  'Height (cm)'?: number;
  'Width (cm)'?: number;
}

export interface ArtworkFormik {
  _id: string;
  Title: string;
  Artist: string;
  ConstituentID?: number;
  ArtistBio?: string;
  Nationality?: string;
  BeginDate?: number;
  EndDate?: number;
  Gender?: string;
  Date: string;
  Medium?: string;
  Dimensions?: string;
  CreditLine?: string;
  AccessionNumber?: string;
  Classification: string;
  Department?: string;
  DateAcquired?: string;
  Cataloged?: string;
  ObjectID: number;
  URL: string;
  ImageURL?: string;
  OnView?: string;
  'Height (cm)'?: number;
  'Width (cm)'?: number;
}