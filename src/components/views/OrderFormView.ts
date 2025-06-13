import { IEvents } from "../base/events";
import { FormView } from "./FormView";

export class OrderFormView extends FormView {
  buttonsPayment: HTMLButtonElement[];

  constructor(template: HTMLTemplateElement, events: IEvents) {
    super(template, events);
    this.buttonsPayment = Array.from(this.form.querySelectorAll('.button_alt'));

    this.buttonsPayment.forEach(button => {
      button.addEventListener('click', () => {
        this.paymentSelection = button.name;
        this.events.emit('order:changePayment', button);
      });
    });

    this.form.addEventListener('input', (event: Event) => {
      const target = event.target as HTMLInputElement;
      this.events.emit('order:changeAddress', {
        field: target.name,
        value: target.value
      });
    });
  }

  set paymentSelection(method: string) {
    this.buttonsPayment.forEach(button => {
      button.classList.toggle('button_alt-active', button.name === method);
    });
  }

  onSubmit(event: Event): void {
    event.preventDefault();
    this.events.emit('contacts:open');
  }
}