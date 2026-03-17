import { inject, Injectable, signal } from '@angular/core';
import { ApiService } from '../../../services/api/api.service';
import { Product } from '../../../shared/models';

@Injectable({
  providedIn: 'root',
})
export class ProductsService {

  //#region service injections
  private readonly apiService = inject(ApiService);
  //#endregion
  //#region properties
  public productsSig = signal<Product[]>([]);
  //#endregion

  //#region public methods
  /**
   * Method to get all products
   * @returns void
   */
  public getProducts(): void {
    this.apiService.getProducts().subscribe((products) => {
      this.productsSig.set(products as Product[]);
    });
  }

  /**
   * Method to add a new product
   * @param product Product to be added
   * @returns void
   */
  public addProduct(product: Product): void {
    this.apiService.addProduct(product).subscribe((newProduct) => {
      this.productsSig.update((products) => [...products, newProduct as Product]);
    });
  }
  //#endregion
}
