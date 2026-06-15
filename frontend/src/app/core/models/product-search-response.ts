import { Product } from './product';

export interface ProductSearchResponse {
  searchedTerm: string;
  resultCount: number;
  bestOffer: Product | null;
  results: Product[];
}
