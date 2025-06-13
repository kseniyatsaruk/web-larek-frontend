# Проектная работа "Веб-ларек"

Стек: HTML, SCSS, TS, Webpack

Структура проекта:
- src/ — исходные файлы проекта
- src/components/ — папка с JS компонентами
- src/components/base/ — папка с базовым кодом

Важные файлы:
- src/pages/index.html — HTML-файл главной страницы
- src/types/index.ts — файл с типами
- src/index.ts — точка входа приложения
- src/scss/styles.scss — корневой файл стилей
- src/utils/constants.ts — файл с константами
- src/utils/utils.ts — файл с утилитами

## Установка и запуск
Для установки и запуска проекта необходимо выполнить команды

```
npm install
npm run start
```

или

```
yarn
yarn start
```
## Сборка

```
npm run build
```

или

```
yarn build
```

# Общее описание проекта
  Название: Web-ларёк
  Описание: интернет-магазин с товарами для веб-разработчиков. В нём можно посмотреть каталог товаров, добавить товары в корзину и сделать заказ. 

# Описание проекта
  В проекте реализован паттерн MVP (Model-View-Presenter), он обеспечивает разделение обязанностей между слоями.
    1. Model — данные, в которых отражена вся ценность приложения.
    2. View — интерфейс для взаимодействия с пользователем.
    3. Presenter - посредник между View и Model.
  Коммуникация между компонентами осуществляется через EventEmitter для полной независимости модулей и лёгкой масштабируемости.

# Описание классов

## EventEmitter
  Класс для управления событиями — «Брокер событий».
  Методы:
  - `on(eventName: EventName, callback: (event: T) => void)` - устанавливает обработчик на событие
  - `off(eventName: EventName, callback: Subscriber)` - снимает обработчик с события
  - `emit(eventName: string, data?: T)` - инициирует событие с данными
  - `onAll(callback: (event: EmitterEvent) => void)` - слушает все события
  - `offAll()` - сбрасывает все обработчики
  - `trigger(eventName: string, context?: Partial<T>)` - делает коллбек триггер, генерирующий событие при вызове

## Api
  Базовый класс для отправки HTTP-запросов к серверу.
  Конструктор:
  - `baseUrl: string` - базовый URL, к которому будут добавляться пути uri при выполнении запросов
  - `options: RequestInit` - глобальные опции запроса.
  Методы:
  - `get(uri: string)` - выполняет GET-запрос по адресу baseUrl + uri
  - `post(uri: string, data: object, method: ApiPostMethods = 'POST')` - выполняет POST/PUT/DELETE-запрос с телом data. Метод по умолчанию — POST
  - `handleResponse(response: Response): Promise<object>` - обрабатывает ответ сервера

## ApiService
  Класс-обёртка над API.
  Конструктор: 
  - `cdnUrl: string`
  - `baseUrl: string`
  - `options?: RequestInit`
  Методы:
  - `getProductCards(): Promise<IProduct[]>` - получает список товаров
  - `postOrderLot(order: IOrderData): Promise<IOrderData>` - отправляет заказ

## BasketModel
  Отвечает за: хранение товаров в корзине, расчёт суммы, счётчик, очистку корзины.
  Методы:
  - `getCount()` - количество товаров
  - `getSumProducts()` - сумма синапсов всех товаров в корзине
  - `setSelectedСard(product: IProduct)` - добавляет товар в корзину
  - `deleteSelectedCard(product: IProduct)` - удаляет товар из корзины
  - `clearBasket()` - очищает корзину

## DataModel
  Хранит данные с сервера.
  Конструктор: 
  - `events: IEvents`
  Хранит:
  `productCards: IProduct[]` — массив всех товаров
  `selectedCard: IProduct` — выбранная карточка
  Методы:
  - `setPreview(item: IProduct)` - данные открытой карточки

## FormModel
  Хранит и валидирует данные от пользователя.
  Конструктор: 
  - `events: IEvents`
  Методы:
  - `setOrderDelivery(field: string,, value: string)` - принимаем данные доставки
  - `setOrderContacts(field: string,, value: string)` - принимаем контактные данные
  - `validateDelivery(): boolean` - проверяет данные доставки
  - `validateContacts(): boolean` - проверяет контактные данные
  - `getOrder(): IOrderData` - возвращает объект данных и выбранных товаров.

## PageView
  Отображает галерею товаров на главной странице.
  Конструктор: 
  - без параметров (автоматически ищет .gallery в DOM)
  Методы: 
  - `appendToGallery(element: HTMLElement)` - добавляет карточку товара в галерею
  - `clearGallery() ` - очищает контейнер галереи от всех товаров

## CatalogCardView
  Отображение карточек товаров в каталоге.
  Конструктор: 
  - `template: HTMLTemplateElement`
  - `events: IEvents`
  - `actions: IActions`
  Методы: 
  - `render(product: IProduct)`

## ProductPreviewView
  Отображение товара в модальном окне.
  Обрабатывает добавление товара в корзину.
  Конструктор: 
  - `template: HTMLTemplateElement`
  - `events: IEvents`
  - `actions: IActions`
  Методы: 
  - `render(product: IProduct)`
  - `updateButton(product: IProduct)` - обновление состояния кнопки «В корзину»

## ModalView
  Работа модального окна.
  Умеет открывать/закрывать. Блокирует скролл страницы. Закрывается по кнопке или клику вне окна.
  Конструктор: 
  - `modalContainer: HTMLElement`
  - `events: IEvents`
  Методы: 
  - `render()`
  - `open()` - открыть
  - `close()` - закрыть
  - `locked(value: boolean)`

## BasketView
  Основной компонент корзины.
  Показывает список товаров. Общую сумму. Кнопку «Оформить».
  Конструктор: 
  - `template: HTMLTemplateElement`
  - `events: IEvents`
  Методы: 
  - `render()`
  - `renderBasketCounter(count: number)` - количество товаров
  - `renderSumProducts(sum: number)` - общая сумму

## BasketItemView
  Отображает один товар в корзине с кнопкой удаления.
  Конструктор: 
  - `template: HTMLTemplateElement`
  - `events: IEvents`
  - `actions: IActions`
  Методы: 
  - `render(product: IProduct, index: number)`

## FormView
  Базовый класс для форм. Содержит общую логику для всех форм.
  Конструктор:
  - `template: HTMLTemplateElement`
  - `events: IEvents`
  Методы:
  - `onSubmit(event: Event): void` — метод для отправки (реализуется в наследниках)
  - `valid(value: boolean)` — флаг активности кнопки отправки формы
  - `render(): HTMLElement`

## ContactsFormView
  Форма для ввода контактных данных. Наследует FormView.
  Конструктор: 
  - `template: HTMLTemplateElement`
  - `events: IEvents`
  Наследуемые методы:
  - `render()`
  - `valid(value: boolean)` — флаг активности кнопки
  - `onSubmit(event: Event)` — генерирует событие

## OrderFormView
  Форма для ввода данных доставки. Наследует FormView.
  Конструктор: 
  - `template: HTMLTemplateElement`
  - `events: IEvents`
  Наследуемые методы: 
  - `render()`
  - `valid(value: boolean)` — флаг активности кнопки
  - `onSubmit(event: Event)` — генерирует событие

## OrderSuccessView
  Рендерит экран «Заказ оформлен» с суммой.
  Конструктор: 
  - `template: HTMLTemplateElement`
  - `events: IEvents`
  Методы: 
  - `render(sum: number)`

# Взаимодействие компонентов
  1. Модели управляют данными и логикой приложения.
  2. Представления отображают интерфейс и передают события в EventEmitter.
  3. EventEmitter обрабатывает события, вызывая нужные методы моделей и обновляя представления.

# Типы данных
  Все типы и интерфейсы хранятся в `src/types/`.

```ts
/*
  * Описывает карточку товара в магазине
* */
interface IProduct {
  id: string;
  title: string;
  description: string;
  category: string;
  image: string;
  price: number | null;
  addedToBasket: boolean;
}

/*
  * Описывает поля заказа товара
* */
interface IOrderForm {
  payment: string;
  address: string;
  phone: string;
  email: string;
  total: number | string;
}

interface IOrderData extends IOrderForm {
  items: string[];
}

/*
  Описывает ошибки валидации форм
*/
type FormErrors = Partial<Record<keyof IOrderForm, string>>;
```
