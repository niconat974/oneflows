export interface Note {
  id?: number;
  title: string;
  content: string;
  createdAt?: Date;
  updatedAt?: Date;
  userId?: number;
  pageId?: number;
  images?: Array<{
    url: string;
    name: string;
    file?: File;
  }>;
}