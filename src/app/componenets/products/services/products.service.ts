import { inject, Injectable, signal } from '@angular/core';
import { ApiService } from '../../../services/api/api.service';
import { Product } from '../../../shared/models';
import { PageEvent } from '@angular/material/paginator';

@Injectable({
  providedIn: 'root',
})
export class ProductsService {

  //#region service injections
  private readonly apiService = inject(ApiService);
  //#endregion
  //#region properties
  public productsSig = signal<Product[]>([]);
  public pageEvent = signal<PageEvent>({
    pageIndex: 0,
    pageSize: 20,
    length: 1000,
  });
  public filterSig = signal<string>('');

  //#endregion

  //#region public methods
  /**
   * Method to get all products
   * @returns void
   */
  public getProducts(): void {
    this.apiService.getProducts().subscribe((products) => {
      this.pageEvent.update(pe => (structuredClone({ ...pe, length: products?.length ?? 0 })));
      this.productsSig.set(structuredClone(products));
    });
  }

  /**
   * Method to add a new product
   * @param product Product to be added
   * @returns void
   */
  public addProduct(product: Product): void {
    this.apiService.addProduct(product).subscribe((newProduct) => {
      this.productsSig.update((products) => [...products, structuredClone(newProduct) as Product]);
    });
  }
  //#endregion
}
