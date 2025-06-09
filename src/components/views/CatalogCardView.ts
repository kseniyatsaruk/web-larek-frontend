import { IActions, IProduct } from "../../types";
import { IEvents } from "../base/events";

export interface ICatalogCardView {
  render(data: IProduct): HTMLElement;
}

export class CatalogCardView implements ICatalogCardView {
  protected _cardElement: HTMLElement;
  protected _cardCategory: HTMLElement;
  protected _cardTitle: HTMLElement;
  protected _cardImage: HTMLImageElement;
  protected _cardPrice: HTMLElement;
  protected _colors: Record<string, string> = {
    "дополнительное": "additional",
    "софт-скил": "soft",
    "кнопка": "button",
    "хард-скил": "hard",
    "другое": "other",
  };

  constructor(template: HTMLTemplateElement, protected events: IEvents, actions?: IActions) {
    this._cardElement = template.content.querySelector('.card').cloneNode(true) as HTMLElement;
    this._cardCategory = this._cardElement.querySelector('.card__category');
    this._cardTitle = this._cardElement.querySelector('.card__title');
    this._cardImage = this._cardElement.querySelector('.card__image');
    this._cardPrice = this._cardElement.querySelector('.card__price');

    if (actions?.onClick) {
      this._cardElement.addEventListener('click', actions.onClick);
    }
  }

  private formatCategoryClass(category: string): string {
    const slug = this._colors[category] || 'other';
    return `card__category_${slug}`;
  }

  protected formatPrice(value: number | null): string {
    return value === null ? 'Бесценно' : `${value} синапсов`;
  }

  render(product: IProduct): HTMLElement {
    this._cardTitle.textContent = product.title;
    this._cardImage.src = product.image;
    this._cardImage.alt = product.title;
    this._cardCategory.textContent = product.category;
    this._cardCategory.className = `card__category ${this.formatCategoryClass(product.category)}`;
    this._cardPrice.textContent = this.formatPrice(product.price);
    return this._cardElement;
  }
}