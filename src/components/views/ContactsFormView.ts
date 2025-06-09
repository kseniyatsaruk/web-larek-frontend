import { IEvents } from "../base/events";

export interface IContactsFormView {
  contacts: HTMLFormElement;
  inputs: HTMLInputElement[];
  buttonSubmit: HTMLButtonElement;
  formErrors: HTMLElement;
  render(): HTMLElement;
}

export class ContactsFormView implements IContactsFormView {
  contacts: HTMLFormElement;
  inputs: HTMLInputElement[];
  buttonSubmit: HTMLButtonElement;
  formErrors: HTMLElement;

  constructor(template: HTMLTemplateElement, protected events: IEvents) {
    this.contacts = template.content.querySelector('.form').cloneNode(true) as HTMLFormElement;
    this.inputs = Array.from(this.contacts.querySelectorAll('.form__input'));
    this.buttonSubmit = this.contacts.querySelector('.button');
    this.formErrors = this.contacts.querySelector('.form__errors');

    this.inputs.forEach(input => {
      input.addEventListener('input', () => {
        this.events.emit(`contacts:change`,  {
          field: input.name,
          value: input.value,
        });
      })
    })

    this.contacts.addEventListener('submit', (event: Event) => {
      event.preventDefault();
      this.events.emit('success:open');
    });
  }

  set valid(value: boolean) {
    this.buttonSubmit.disabled = !value;
  }

  render() {
    return this.contacts;
  }
}