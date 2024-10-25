export interface Photo {
  title: string;
  nasa_id: string;
  description: string;
  imageLink?: string;
  fullImageLink?: string;
  date_created: string;
  center: string;
}

export interface Link {
  href: string;
  rel: string;
  render?: string;
}

export interface DataItem {
  title: string;
  nasa_id: string;
  description: string;
  date_created: string;
  center: string;
}

export interface Item {
  data: DataItem[];
  links: Link[];
}