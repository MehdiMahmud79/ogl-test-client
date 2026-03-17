import { Component, computed, effect, inject, ViewChild } from '@angular/core';
import { ProductsService } from './services/products.service';
import { MatSort, MatSortModule, Sort } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { take } from 'rxjs';
import { maxLength, required, schema } from '@angular/forms/signals';
import { ActionMode, FormDialogData, Product } from '../../shared/models';
import { GenericFormDialog } from '../../shared/manager/generic-form-dialog';

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
  imports: [MatTableModule, MatSortModule, MatButtonModule, MatIconModule],
  templateUrl: './products.html',
  styleUrl: './products.css',
})
export class Products {
  //#region serice injections
  private readonly productsService = inject(ProductsService);
  private _liveAnnouncer = inject(LiveAnnouncer);
  private readonly dialog = inject(MatDialog);
  //#endregion

  //#region properties
  public productsListSig = this.productsService.productsSig;
  public displayedColumns: string[] = ['id', 'sku', 'price', 'description'];
  public dataSource = computed(() => new MatTableDataSource(this.productsListSig()));

  @ViewChild(MatSort) sort!: MatSort;
  private _ = effect(() => {
    this.dataSource().sort = this.sort;
  });
  //#endregion

  //#region lifecycle hooks
  ngOnInit() {
    this.productsService.getProducts();
  }

  /** Announce the change in sort state for assistive technology. */
  announceSortChange(sortState: Sort) {
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
  }
  /**
   * Method to add a new product
   * @returns void
   */
  public addProduct(): void {
    const dialogRef = this.dialog.open(GenericFormDialog<Product>, {
      data: {
        model: initialProductModel,
        formSchema: productSchema,
        mode: ActionMode.CREATE,
        fields: [
          { key: 'sku', label: 'SKU', type: 'text', placeholder: 'ABC123' },
          { key: 'price', label: 'Price', type: 'number', placeholder: '0.00' },
          { key: 'description', label: 'Description', type: 'textarea', placeholder: '' }
        ]

      } as FormDialogData<Product>,
      disableClose: true,
    });
    dialogRef.afterClosed().pipe(take(1)).subscribe((result) => {
      if (result?.data) {
        this.productsService.addProduct(result.data);
      }

    });
  }

  //#endregion

}
