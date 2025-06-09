import { CatalogCardView } from "./CatalogCardView";
import { IActions, IProduct } from "../../types";
import { IEvents } from "../base/events";

export interface IProductPreviewView {
  text: HTMLElement;
  button: HTMLElement;
  render(data: IProduct): HTMLElement;
}

export class ProductPreviewView extends CatalogCardView implements IProductPreviewView {
  text: HTMLElement;
  button: HTMLButtonElement;

  constructor(template: HTMLTemplateElement, protected events: IEvents, actions?: IActions) {
    super(template, events, actions);

    this.text = this._cardElement.querySelector('.card__text');
    this.button = this._cardElement.querySelector('.card__button');
  }

  protected updateButton(product: IProduct) {
    const isSold = product.addedToBasket || product.price === null;

    this.button.disabled = isSold;
    this.button.textContent = isSold
      ? product.price === null
        ? 'Не продается'
        : 'Уже в корзине'
      : 'В корзину';

    if (!isSold) {
      this.button.onclick = () => this.events.emit('card:addBasket', product);
    } else {
      this.button.onclick = null;
    }
  }

  render(product: IProduct): HTMLElement {
    const element = super.render(product);
    this.text.textContent = product.description;
    this.updateButton(product);
    return element;
  }
}