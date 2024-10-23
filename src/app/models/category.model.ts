export interface Category {
  id?: number;
  name: string;
  pages: Page[];
}

export interface Page {
  id?: number;
  title: string;
  categoryId?: number;
  notes: Note[];
}