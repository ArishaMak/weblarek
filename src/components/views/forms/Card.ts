import type { IProduct } from "../../types";
import type { IEvents } from "../base/Events";
import { EVENTS } from "../base/eventNames";
export class CartModel {
  private items: Map<string, IProduct> = new Map();
  constructor(private events?: IEvents) {}

  public getItems(): IProduct[] {
    //получить товары из корзины
    return Array.from(this.items.values());
  }

  public add(product: IProduct) {
    if (!product?.id) return;
    if (product.price === null) return;
    this.items.set(product.id, product);
    this.events?.emit(EVENTS.CART_CHANGED, {});
  }

  public remove(id: string) {
    this.items.delete(id);
    this.events?.emit(EVENTS.CART_CHANGED, {});
  }

  public clear() {
    if (this.items.size) {
      this.items.clear();
      this.events?.emit(EVENTS.CART_CHANGED, {});
    }
  }

  public getCount(): number {
    return this.items.size;
  }

  public has(id: string): boolean {
    return this.items.has(id);
  }

  public getTotal(): number {
    return Array.from(this.items.values()).reduce((sum, p) => {
      return sum + (typeof p.price === "number" ? p.price : 0);
    }, 0);
  }
}