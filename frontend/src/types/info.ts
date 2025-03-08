export interface IInfo {
  _id: string;
  title: string;
  content: string;
  category: {
    _id: string;
    name: string;
  };
  createdAt: Date;
}

export interface ICategory {
  _id: string;
  name: string;
  description: string;
}

export interface IArticleFormData {
  title: string;
  content: string;
  category: string;
}