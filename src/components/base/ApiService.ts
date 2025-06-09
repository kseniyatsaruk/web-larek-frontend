import { ApiListResponse, Api } from './api'
import { IOrderData, IProduct } from '../../types';

export class ApiService extends Api {
  cdn_url: string;
  items: IProduct[];

  constructor(cdn_url: string, baseUrl: string, options?: RequestInit) {
    super(baseUrl, options);
    this.cdn_url = cdn_url;
  }

  getProductCards(): Promise<IProduct[]> {
    return this.get('/product').then((data: ApiListResponse<IProduct>) =>
      data.items.map((item) => ({
        ...item,
        addedToBasket: false,
        image: this.cdn_url + item.image,
      }))
    );
  }

  postOrderLot(order: IOrderData): Promise<IOrderData> {
    return this.post(`/order`, order).then((data: IOrderData) => data);
  }
}