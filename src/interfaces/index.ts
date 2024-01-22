
export interface StolenBikes {
  cycle_type_slug?: string,
  date_stolen?: string | null,
  description?: string | null,
  external_id?: null,
  frame_colors?: Array<string>,
  frame_model?: string,
  id: number,
  is_stock_img?: boolean,
  large_img?: string | null,
  location_found?: string,
  manufacturer_name?: string,
  propulsion_type_slug?: string,
  registry_name?: null,
  registry_url?: null,
  serial?: string,
  status?: string,
  stolen?: boolean,
  stolen_coordinates?: Array<number> | null,
  stolen_location?: string | null,
  thumb?: string | null,
  title?: string,
  url?: string,
  year?: string | number | null,
}

export interface Error{
  text:string,
  isError:boolean
}

export interface Loader{
  text:string, 
  isLoading:boolean
}

export interface UrlOptions {
  location: string,
  distance: number,
  stolenness: string,
  query: string,
}   