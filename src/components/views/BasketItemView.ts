import { IActions, IProduct } from "../../types";
import { IEvents } from "../base/events";

export interface IBasketItemView {
  basketItem: HTMLElement;
	index:HTMLElement;
	title: HTMLElement;
	price: HTMLElement;
	buttonDelete: HTMLButtonElement;
	render(data: IProduct, item: number): HTMLElement;
}

export class BasketItemView implements IBasketItemView {
  basketItem: HTMLElement;
	index:HTMLElement;
	title: HTMLElement;
	price: HTMLElement;
	buttonDelete: HTMLButtonElement;

  constructor (template: HTMLTemplateElement, protected events: IEvents, actions?: IActions) {
    this.basketItem = template.content.querySelector('.basket__item').cloneNode(true) as HTMLElement;
		this.index = this.basketItem.querySelector('.basket__item-index');
		this.title = this.basketItem.querySelector('.card__title');
		this.price = this.basketItem.querySelector('.card__price');
		this.buttonDelete = this.basketItem.querySelector('.basket__item-delete');

		if (actions?.onClick) {
			this.buttonDelete.addEventListener('click', actions.onClick);
		}
  }

	private formatPrice(value: number | null): string {
    return value === null ? 'Бесценно' : `${value} синапсов`;
  }

	render(product: IProduct, index: number) {
		this.index.textContent = String(index);
		this.title.textContent = product.title;
		this.price.textContent = this.formatPrice(product.price);
		return this.basketItem;
	}
}