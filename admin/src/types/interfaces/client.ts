export interface Client {
  id: string;
  name: string;
  avatar: string;
  email: string;
  phone?: string;
  createdAt: Date;
  updatedAt: Date;
}
