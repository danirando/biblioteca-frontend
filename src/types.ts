export interface Book {
  id: number;
  titolo: string;
  autore: string;
  anno: number;
  genere: string;
  descrizione: string;
}

export interface PaginationData {
  current_page: number;
  last_page: number;
  prev_page_url: string | null;
  next_page_url: string | null;
  total: number;
  links: Array<{
    url: string | null;
    label: string;
    active: boolean;
  }>;
}
