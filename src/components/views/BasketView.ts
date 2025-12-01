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
  protected listElement: HTMLElement; // эти свойства доступны внутри самого класса и в классах-наследниках, но недоступны извне
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

    this.buttonElement.addEventListener("click", onCheckout);
    this.ensureScrollbarStyles();
    this.setupScroll();
  }

  private setupScroll() {
    this.listElement.setAttribute(
      "style",
      ["max-height: 55vh", "overflow-y: auto", "padding-right: 8px"].join(";")
    );
  }

  private ensureScrollbarStyles() {
    if (document.getElementById("basket-scrollbar-style")) return;
    const style = document.createElement("style");
    style.id = "basket-scrollbar-style";
    style.textContent = `
      .basket__list{scrollbar-width:thin;scrollbar-color:#fff transparent;}
      .basket__list::-webkit-scrollbar{width:8px;}
      .basket__list::-webkit-scrollbar-track{background:transparent;}
      .basket__list::-webkit-scrollbar-thumb{
        background-color:rgba(255,255,255,.95);
        border-radius:8px;border:2px solid transparent;background-clip:content-box;
      }
      .basket__list::-webkit-scrollbar-thumb:hover{background-color:#fff;}
    `;
    document.head.appendChild(style);
  }

  set items(value: HTMLElement[]) {
    this.listElement.replaceChildren(...value);
    this.setupScroll();
  }

  set total(value: number) {
    this.totalElement.textContent = `${value} синапсов`;
  }

  set empty(flag: boolean) {
    this.buttonElement.disabled = flag;
    this.listElement.classList.toggle("basket__list_empty", flag);
    if (flag) this.listElement.textContent = "Корзина пуста";
    this.setupScroll();
  }

  render(data: IBasket): HTMLElement {
    super.render(data);
    this.setupScroll();
    return this.container;
  }
}