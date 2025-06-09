import { IEvents } from '../base/events';
import { FormErrors } from '../../types/index'

export interface IFormModel {
  payment: string;
  email: string;
  phone: string;
  address: string;
  total: number;
  items: string[];
  setOrderDelivery(field: string, value: string): void;
  setOrderContacts(field: string, value: string): void;
  validateDelivery(): boolean;
  validateContacts(): boolean;
  getOrder(): object;
}

export class FormModel implements IFormModel {
  payment = '';
  email = '';
  phone = '';
  address = '';
  total = 0;
  items: string[] = [];
  formErrors: FormErrors = {};

  constructor(protected events: IEvents) {}

  setOrderDelivery(field: string, value: string): void {
    if (field === 'address' && this.address !== value) {
      this.address = value;
      this.checkReadyAndEmit();
    }
    if (field === 'payment' && this.payment !== value) {
      this.payment = value;
      this.checkReadyAndEmit();
    }
  }

  setOrderContacts(field: string, value: string): void {
    if (field === 'email' && this.email !== value) {
      this.email = value;
      this.checkReadyAndEmit();
    }
    if (field === 'phone' && this.phone !== value) {
      this.phone = value;
      this.checkReadyAndEmit();
    }
  }

  validateDelivery(): boolean {
    return this.updateErrors(() => {
      const errors: FormErrors = {};
      if (!this.address) errors.address = 'Необходимо указать адрес';
      if (!this.payment) errors.payment = 'Выберите способ оплаты';
      return errors;
    }, 'errorsDelivery:change');
  }

  validateContacts(): boolean {
    return this.updateErrors(() => {
      const errors: FormErrors = {};
      if (!this.email) errors.email = 'Необходимо указать email';
      if (!this.phone) errors.phone = 'Необходимо указать телефон';
      return errors;
    }, 'errorsContacts:change');
  }

  getOrder() {
    return {
      payment: this.payment,
      email: this.email,
      phone: this.phone,
      address: this.address,
      total: this.total,
      items: this.items,
    }
  }

  private checkReadyAndEmit(): void {
    const isValid = this.validateDelivery() && this.validateContacts();
    if (isValid) {
      this.events.emit('order:ready', this.getOrder());
    }
  }

  private updateErrors(
    validateFn: () => FormErrors,
    eventName: string
  ): boolean {
    const errors = validateFn();
    this.formErrors = errors;
    this.events.emit(eventName, this.formErrors);
    return Object.keys(errors).length === 0;
  }
}