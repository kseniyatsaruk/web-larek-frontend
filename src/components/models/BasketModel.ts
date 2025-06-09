import { IProduct } from "../../types";

export interface IBasketModel {
  basketProducts: IProduct[];
  getCount: () => number;
  getSumProducts: () => number;
  setSelectedСard(data: IProduct): void;
  deleteSelectedCard(item: IProduct): void;
  clearBasket(): void;
}

export class BasketModel implements IBasketModel {
  protected _basketProducts: IProduct[];

  constructor() {
    this._basketProducts = [];
  }

  set basketProducts(data: IProduct[]) {
    this._basketProducts = data;
  }

  get basketProducts() {
    return this._basketProducts;
  }

  getCount() {
    return this.basketProducts.length;
  }

  getSumProducts() {
    let sum = 0;
    this.basketProducts.forEach(item => sum = sum + item.price );
    return sum;
  }

  setSelectedСard(product: IProduct) {
    this._basketProducts.push(product);
  }

  deleteSelectedCard(product: IProduct) {
    const index = this._basketProducts.indexOf(product);
    if (index >= 0) {
      this._basketProducts.splice(index, 1);
    }
  }

  clearBasket() {
    this.basketProducts = [];
  }
}