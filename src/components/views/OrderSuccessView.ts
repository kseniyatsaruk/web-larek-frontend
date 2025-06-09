import { IEvents } from "../base/events";

export interface IOrderSuccessView {
  success: HTMLElement;
  description: HTMLElement;
  button: HTMLButtonElement;
  render(sum: number): HTMLElement;
}

export class OrderSuccessView implements IOrderSuccessView {
  success: HTMLElement;
  description: HTMLElement;
  button: HTMLButtonElement;

  constructor(template: HTMLTemplateElement, protected events: IEvents) {
    this.success = template.content.querySelector('.order-success').cloneNode(true) as HTMLElement;
    this.description = this.success.querySelector('.order-success__description');
    this.button = this.success.querySelector('.order-success__close');

    this.button.addEventListener('click', () => { events.emit('success:close') });
  }

  render(sum: number) {
    this.description.textContent = `Списано ${sum} синапсов`;
    return this.success;
  }
}