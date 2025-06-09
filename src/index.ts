import './scss/styles.scss';

import { CDN_URL, API_URL } from './utils/constants';
import { EventEmitter } from './components/base/events';
import { ApiService } from './components/base/ApiService';
import { DataModel } from './components/models/DataModel';
import { CatalogCardView } from './components/views/CatalogCardView';
import { ProductPreviewView } from './components/views/ProductPreviewView';
import { IOrderForm, IProduct } from './types';
import { ModalView } from './components/views/ModalView';
import { ensureElement } from './utils/utils';
import { BasketModel } from './components/models/BasketModel';
import { BasketView } from './components/views/BasketView';
import { BasketItemView } from './components/views/BasketItemView';
import { FormModel } from './components/models/FormModel';
import { OrderFormView } from './components/views/OrderFormView';
import { ContactsFormView } from './components/views/ContactsFormView';
import { OrderSuccessView } from './components/views/OrderSuccessView';

const cardCatalogTemplate = document.querySelector('#card-catalog') as HTMLTemplateElement;
const cardPreviewTemplate = document.querySelector('#card-preview') as HTMLTemplateElement;
const basketTemplate = document.querySelector('#basket') as HTMLTemplateElement;
const cardBasketTemplate = document.querySelector('#card-basket') as HTMLTemplateElement;
const orderTemplate = document.querySelector('#order') as HTMLTemplateElement;
const contactsTemplate = document.querySelector('#contacts') as HTMLTemplateElement;
const successTemplate = document.querySelector('#success') as HTMLTemplateElement;

const api = new ApiService(CDN_URL, API_URL);
const events = new EventEmitter();
const dataModel = new DataModel(events);
const modal = new ModalView(ensureElement<HTMLElement>('#modal-container'), events);
const basket = new BasketView(basketTemplate, events);
const basketModel = new BasketModel();
const formModel = new FormModel(events);
const order = new OrderFormView(orderTemplate, events);
const contacts = new ContactsFormView(contactsTemplate, events);

function renderCards() {
  const gallery = ensureElement<HTMLElement>('.gallery');
  gallery.innerHTML = '';

  dataModel.productCards.forEach(item => {
    const card = new CatalogCardView(cardCatalogTemplate, events, { onClick: () => events.emit('card:select', item) });
    gallery.append(card.render(item));
  });
}

function renderBasketItems() {
  basket.items = basketModel.basketProducts.map((item, index) => {
    const basketItem = new BasketItemView(cardBasketTemplate, events, { onClick: () => events.emit('basket:remove', item) });
    return basketItem.render(item, index + 1);
  });
}

events.on('cards:get', renderCards);

events.on('card:select', (item: IProduct) => {
  dataModel.setPreview(item);
});

events.on('card:open', (item: IProduct) => {
  const cardPreview = new ProductPreviewView(cardPreviewTemplate, events);
  modal.content = cardPreview.render(item);
  modal.render();
});

events.on('card:addBasket', () => {
  const product = dataModel.selectedСard;
  if (!product.addedToBasket) {
    product.addedToBasket = true;
      dataModel.productCards = dataModel.productCards.map(pr =>
      pr.id === product.id ? { ...pr, addedToBasket: true } : pr
    );
    basketModel.setSelectedСard(product);
    basket.renderBasketCounter(basketModel.getCount());
  }
  modal.close();
});

events.on('basket:open', () => {
  basket.renderSumProducts(basketModel.getSumProducts());
  renderBasketItems();
  modal.content = basket.render();
  modal.render();
});

events.on('basket:remove', (item: IProduct) => {
  basketModel.deleteSelectedCard(item);
  if (dataModel.selectedСard.id === item.id) {
    dataModel.selectedСard.addedToBasket = false;
  }
  dataModel.productCards = dataModel.productCards.map(pr =>
    pr.id === item.id ? { ...pr, addedToBasket: false } : pr
  );
  basket.renderBasketCounter(basketModel.getCount());
  basket.renderSumProducts(basketModel.getSumProducts());
  renderBasketItems();
});

events.on('order:open', () => {
  modal.content = order.render();
  modal.render();
  formModel.items = basketModel.basketProducts.map(item => item.id);
});

events.on('order:changePayment', (button: HTMLButtonElement) => {
  formModel.payment = button.name;
});

events.on(`order:changeAddress`, (data: { field: string, value: string }) => {
  formModel.setOrderDelivery(data.field, data.value);
});

events.on('errorsDelivery:change', (errors: Partial<IOrderForm>) => {
  const { address, payment } = errors;
  order.valid = !address && !payment;
  order.formErrors.textContent = Object.values({address, payment}).filter(i => !!i).join('; ');
});

events.on('contacts:open', () => {
  formModel.total = basketModel.getSumProducts();
  modal.content = contacts.render();
  modal.render();
});

events.on(`contacts:change`, (data: { field: string, value: string }) => {
  formModel.setOrderContacts(data.field, data.value);
});

events.on('errorsContacts:change', (errors: Partial<IOrderForm>) => {
  const { email, phone } = errors;
  contacts.valid = !email && !phone;
  contacts.formErrors.textContent = Object.values({phone, email}).filter(i => !!i).join('; ');
})

events.on('success:open', () => {
  api.postOrderLot(formModel.getOrder())
    .then(() => {
      const success = new OrderSuccessView(successTemplate, events);
      modal.content = success.render(basketModel.getSumProducts());
      basketModel.clearBasket();
      basket.renderBasketCounter(basketModel.getCount());
      modal.render();
    })
    .catch(error => console.log(error));
});

events.on('success:close', () => modal.close());

events.on('modal:open', () => {
  modal.locked = true;
});

events.on('modal:close', () => {
  modal.locked = false;
});

api.getProductCards()
  .then(function (data: IProduct[]) {
    dataModel.productCards = data;
  })
  .catch(error => console.log(error))