import { IEvents } from "../base/events";

export interface IOrderFormView {
  order: HTMLFormElement;
  buttonAll: HTMLButtonElement[];
  paymentSelection: String;
  formErrors: HTMLElement;
  render(): HTMLElement;
}

export class OrderFormView implements IOrderFormView {
  order: HTMLFormElement;
  buttonAll: HTMLButtonElement[];
  buttonSubmit: HTMLButtonElement;
  formErrors: HTMLElement;

  constructor(template: HTMLTemplateElement, protected events: IEvents) {
    this.order = template.content.querySelector('.form').cloneNode(true) as HTMLFormElement;
    this.buttonAll = Array.from(this.order.querySelectorAll('.button_alt'));
    this.buttonSubmit = this.order.querySelector('.order__button');
    this.formErrors = this.order.querySelector('.form__errors');

    this.buttonAll.forEach(button => {
      button.addEventListener('click', () => {
        this.paymentSelection = button.name;
        this.events.emit('order:changePayment', button);
      });
    });

    this.order.addEventListener('input', (event: Event) => {
      const target = event.target as HTMLInputElement;
      this.events.emit(`order:changeAddress`, {
        field: target.name,
        value: target.value,
      });
    });

    this.order.addEventListener('submit', (event: Event) => {
      event.preventDefault();
      this.events.emit('contacts:open');
    });
  }

  set paymentSelection(paymentMethod: string) {
    this.buttonAll.forEach(button => {
      button.classList.toggle('button_alt-active', button.name === paymentMethod);
    })
  }

  set valid(value: boolean) {
    this.buttonSubmit.disabled = !value;
  }

  render() {
    return this.order;
  }
}