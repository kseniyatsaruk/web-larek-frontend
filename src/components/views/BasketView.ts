import { createElement } from "../../utils/utils";
import { IEvents } from "../base/events";

export interface IBasketView {
  basket: HTMLElement;
  title: HTMLElement;
  basketList: HTMLElement;
  button: HTMLButtonElement;
  basketPrice: HTMLElement;
  basketButton: HTMLButtonElement;
  basketCounter: HTMLElement;
  renderBasketCounter(value: number): void;
  renderSumProducts(sumAll: number): void;
  render(): HTMLElement;
  items: HTMLElement[];
}

export class BasketView implements IBasketView {
  basket: HTMLElement;
  title: HTMLElement;
  basketList: HTMLElement;
  button: HTMLButtonElement;
  basketPrice: HTMLElement;
  basketButton: HTMLButtonElement;
  basketCounter: HTMLElement;

  constructor(template: HTMLTemplateElement, protected events: IEvents) {
    this.basket = template.content.querySelector('.basket').cloneNode(true) as HTMLElement;
    this.title = this.basket.querySelector('.modal__title');
    this.basketList = this.basket.querySelector('.basket__list');
    this.button = this.basket.querySelector('.basket__button');
    this.basketPrice = this.basket.querySelector('.basket__price');
    this.basketButton = document.querySelector('.header__basket');
    this.basketCounter = document.querySelector('.header__basket-counter');
  
    this.button.addEventListener('click', () => { this.events.emit('order:open') });
    this.basketButton.addEventListener('click', () => { this.events.emit('basket:open') });
  }

  set items(items: HTMLElement[]) {
    if (items.length > 0) {
      this.basketList.replaceChildren(...items);
      this.button.removeAttribute('disabled');
    } else {
      this.basketList.replaceChildren(this.renderEmptyState());
      this.button.setAttribute('disabled', 'disabled');
    }
  }

  renderBasketCounter(count: number) {
    this.basketCounter.textContent = String(count);
  }

  renderSumProducts(sum: number) {
    this.basketPrice.textContent = `${sum} синапсов`;
  }

  render() {
    this.title.textContent = 'Корзина';
    return this.basket;
  }

  protected renderEmptyState(): HTMLElement {
    return createElement<HTMLParagraphElement>('p', {
      textContent: 'Корзина пуста',
    });
  }
}