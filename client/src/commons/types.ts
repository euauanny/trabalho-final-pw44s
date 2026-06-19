export interface IUserRegister {
    displayName: string;
    username: string;
    email: string;
    password: string;
}

export interface IResponse {
    status?: number;
    success?: boolean;
    message?: string;
    data?: object
}

export interface IUserLogin {
    username: string;
    password: string;
}

export interface Authorities {
  authority: string;
}

export interface AuthenticatedUser {
  displayName: string;
  username: string;
  authorities: Authorities[];
}

export interface AuthenticationResponse {
  token: string;
  user: AuthenticatedUser;
}

export interface ICategory {
  id?: number;
  name: string;
}

export interface IProduct {
  id?: number;
  name: string;
  description: string;
  price: number;
  urlImage?: string;
  category: ICategory;
}

export interface ICartItem {
  product: IProduct;
  quantity: number;
}

export interface IAddress {
  id?: number;
  userId?: number;
  logradouro: string;
  complemento: string;
  numero: string;
  bairro: string;
  cep: string;
}

export interface IOrderItem {
  id?: number;
  productId: number;
  productName: string;
  price: number;
  quantity: number;
}

export interface IOrder {
  id?: number;
  date: string;
  userId: number;
  deliveryAddress?: string;
  items: IOrderItem[];
  total: number;
}

export interface ICheckout {
  addressId?: number;
  items: {
    productId: number;
    quantity: number;
  }[];
}
