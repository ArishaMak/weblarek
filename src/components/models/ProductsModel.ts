import type { IProduct } from "../../types";

export class ProductsModel {
  private items: IProduct[] = [];
  private selectedId: string | null = null;

  constructor() {}

  public setItems(items: IProduct[]) {
    //сохр массив товаров
    this.items = [...items];
  }

  public getItems(): IProduct[] {
    //получить копию массива товаров
    return [...this.items];
  }

  //найти товар по айди
  public getItemById(id: string): IProduct | undefined {
    return this.items.find((p) => p.id === id);
  }

  public setSelectedProduct(id: string | null) {
    //сохранить айди товара
    this.selectedId = id;
  }

  public getSelectedProduct(): IProduct | null {
    if (!this.selectedId) return null;
    return this.getItemById(this.selectedId) ?? null;
  }
}