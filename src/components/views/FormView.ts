import { IEvents } from "../base/events";

export interface IFormView {
  form: HTMLFormElement;
  buttonSubmit: HTMLButtonElement;
  formErrors: HTMLElement;
  valid: boolean;
  render(): HTMLElement;
}

export abstract class FormView implements IFormView {
  form: HTMLFormElement;
  buttonSubmit: HTMLButtonElement;
  formErrors: HTMLElement;

  constructor(template: HTMLTemplateElement, protected events: IEvents) {
    this.form = template.content.querySelector('.form')!.cloneNode(true) as HTMLFormElement;
    this.buttonSubmit = this.form.querySelector('button[type="submit"]')!;
    this.formErrors = this.form.querySelector('.form__errors')!;

    this.form.addEventListener('submit', this.onSubmit.bind(this));
  }

  abstract onSubmit(event: Event): void;

  set valid(value: boolean) {
    this.buttonSubmit.disabled = !value;
  }

  render(): HTMLElement {
    return this.form;
  }
}