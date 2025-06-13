import { ensureElement } from '../../utils/utils';

export class PageView {
  protected gallery: HTMLElement;

  constructor() {
    this.gallery = ensureElement<HTMLElement>('.gallery');
  }

  clearGallery() {
    this.gallery.innerHTML = '';
  }

  appendToGallery(element: HTMLElement) {
    this.gallery.append(element);
  }
}