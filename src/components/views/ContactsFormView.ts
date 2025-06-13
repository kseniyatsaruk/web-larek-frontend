import { IEvents } from "../base/events";
import { FormView } from "./FormView";

export class ContactsFormView extends FormView {
  inputs: HTMLInputElement[];

  constructor(template: HTMLTemplateElement, events: IEvents) {
    super(template, events);
    this.inputs = Array.from(this.form.querySelectorAll('.form__input'));

    this.inputs.forEach(input => {
      input.addEventListener('input', () => {
        this.events.emit('contacts:change', {
          field: input.name,
          value: input.value
        });
      });
    });
  }

  onSubmit(event: Event): void {
    event.preventDefault();
    this.events.emit('success:open');
  }
}