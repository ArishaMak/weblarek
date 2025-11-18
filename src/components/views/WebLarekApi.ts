import { Api } from "./base/Api";
import type {
  IProductsResponse,
  IProduct,
  IOrderPayload,
  IOrderResult,
} from "../types";

export class WebLarekApi extends Api {
  constructor(baseUrl: string, options: RequestInit = {}) {
    super(baseUrl, options);
  }

  public async getProducts(): Promise<IProduct[]> {
    const result = await this.get<IProductsResponse>("/product/");
    return result.items;
  }

  public async postOrder(payload: IOrderPayload): Promise<IOrderResult> {
    const result = await this.post<IOrderResult>("/order/", payload, "POST");
    return result;
  }
}