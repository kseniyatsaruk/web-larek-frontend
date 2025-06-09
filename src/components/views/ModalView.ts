import { IEvents } from "../base/events";

export interface IModalView {
  open(): void;
  close(): void;
  render(): HTMLElement;
}

export class ModalView implements IModalView {
  protected modalContainer: HTMLElement;
  protected closeButton: HTMLButtonElement;
  protected _content: HTMLElement;
  protected _pageWrapper: HTMLElement;

  constructor(modalContainer: HTMLElement, protected events: IEvents) {
    this.modalContainer = modalContainer;
    this.closeButton = modalContainer.querySelector('.modal__close');
    this._content = modalContainer.querySelector('.modal__content');
    this._pageWrapper = document.querySelector('.page__wrapper');

    this.closeButton.addEventListener('click', this.close.bind(this));
    this.modalContainer.addEventListener('click', this.close.bind(this));
    this.modalContainer.querySelector('.modal__container').addEventListener('click', event => event.stopPropagation());
    document.addEventListener('keydown', this.handleEscape);
  }

  private handleEscape = (event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      this.close();
    }
  };

  set content(value: HTMLElement) {
    if (value) {
      this._content.replaceChildren(value);
    } else {
      this._content.replaceChildren();
    }
  }

  open() {
    this.modalContainer.classList.add('modal_active');
    this.events.emit('modal:open');
  }

  close() {
    this.modalContainer.classList.remove('modal_active');
    this.content = null;
    this.events.emit('modal:close');
  }

  set locked(value: boolean) {
    this._pageWrapper.classList.toggle('page__wrapper_locked', value);
  }

  render(): HTMLElement {
    this._content;
    this.open();
    return this.modalContainer;
  }
}