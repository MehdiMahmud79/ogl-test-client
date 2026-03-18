import { Component, computed, inject, signal, WritableSignal } from '@angular/core';
import { ProductsService } from './services/products.service';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { maxLength, required, schema } from '@angular/forms/signals';
import { ActionMode, Product } from '../../shared/models';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { BaseTableComponent } from '../../shared/base-table/base-table';
import { SearchBarComponent } from '../../shared/search-bar/search-bar';

const initialProductModel: Product = {
  id: null,
  sku: '',
  price: null,
  description: '',
};
const productSchema = schema<Product>((rootPath) => {
  required(rootPath.sku, {
    message: 'SKU is required.',
  });
  required(rootPath.price, {
    message: 'Price must be greater than 0.',
  });

  required(rootPath.description, {
    message: 'Description is required.',
  });
  maxLength(rootPath.description, 255, {
    message: 'Description must be less than 255 characters.',
  });
})
@Component({
  selector: 'app-products',
  imports: [MatTableModule, MatSortModule, SearchBarComponent, MatButtonModule, MatIconModule, MatPaginatorModule],
  templateUrl: '../../shared/base-table/base-table.html',
  styleUrls: ['../../shared/base-table/base-table.css'],
})
export class Products extends BaseTableComponent<Product> {
  //#region serice injections
  private readonly productsService = inject(ProductsService);
  private readonly dialog = inject(MatDialog);
  //#endregion

  //#region properties
  override pageEvent: WritableSignal<PageEvent> = this.productsService.pageEvent;

  override displayedColumns: WritableSignal<{ key: string, label: string }[]> = signal([
    { key: 'id', label: 'ID' },
    { key: 'sku', label: 'SKU' },
    { key: 'price', label: 'Price' },
    { key: 'description', label: 'Description' }
  ]);
  override filterSig = this.productsService.filterSig;

  override sourceSig = computed(() => {
    const products = this.productsService.productsSig();
    return structuredClone(products);
  });

  protected fetch() {
    this.productsService.getProducts();
  }
  //#endregion

  //#region lifecycle hooks
  override ngOnInit() {
    this.fetch();
  }


  /**
   * Method to add a new product
   * @returns void
   */

  override onAdd() {
    this.openDialog(this.dialog, {
      model: initialProductModel,
      formSchema: productSchema,
      mode: ActionMode.CREATE,
      fields: [{ key: 'sku', label: 'SKU', type: 'text', placeholder: 'ABC123' },
      { key: 'price', label: 'Price', type: 'number', placeholder: '0.00' },
      { key: 'description', label: 'Description', type: 'textarea', placeholder: '' }]
    }).subscribe(result => {
      if (result?.data) {
        this.productsService.addProduct(result.data);
      }
    });
  }

  //#endregion

}
