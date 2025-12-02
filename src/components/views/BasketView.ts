// src/components/views/BasketView.ts

import { Component } from "../base/Component"; 
import { ensureElement } from "../../utils/utils"; 

// компонент корзины ожидает получить следующие данные: 
export interface IBasket { 
  items: HTMLElement[]; 
  total: number; 
  empty: boolean; 
} 

//класс BasketView наследует функциональность от базового класса Component<IBasket> 
export class BasketView extends Component<IBasket> { 
  protected listElement: HTMLElement; 
  protected totalElement: HTMLElement; 
  protected buttonElement: HTMLButtonElement; 
  protected actionsElement: HTMLElement; 

  constructor(container: HTMLElement, onCheckout: () => void) {
  super(container); 
  this.listElement = ensureElement(".basket__list", this.container); 
  this.totalElement = ensureElement(".basket__price", this.container); 
  this.buttonElement = ensureElement<HTMLButtonElement>( 
    ".basket__button", 
    this.container 
  ); 
  this.actionsElement = ensureElement(".modal__actions", this.container); 

  // Добавляем слушатель для кнопки оформления заказа
  this.buttonElement.addEventListener("click", onCheckout); 
  } 

  set items(value: HTMLElement[]) { 
  this.listElement.replaceChildren(...value);
 } 

  set total(value: number) { 
  this.totalElement.textContent = `${value} синапсов`; 
 } 

  set empty(flag: boolean) { 
  this.buttonElement.disabled = flag; 
  this.listElement.classList.toggle("basket__list_empty", flag); 
  if (flag) this.listElement.textContent = "Корзина пуста"; 
} 

  render(data?: IBasket): HTMLElement { 
  super.render(data);
  return this.container; 
 } 
}