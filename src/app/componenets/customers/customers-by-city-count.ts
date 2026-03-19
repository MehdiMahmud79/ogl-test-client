import { Component, computed, inject, signal, WritableSignal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { CustomerService } from './services/customer.service';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { take } from 'rxjs';
import { GenericFormDialog } from '../../shared/manager/generic-form-dialog';
import { ActionMode, Customer, FormDialogData } from '../../shared/models';
import { ConfirmDialogComponent } from '../../shared/confirm-dialog/confirm-dialog.component';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { BaseTableComponent } from '../../shared/base-table/base-table';
import { SearchBarComponent } from '../../shared/search-bar/search-bar';

@Component({
  selector: 'app-customers',
  imports: [MatTableModule, MatSortModule, SearchBarComponent, MatButtonModule, MatIconModule, ScrollingModule, MatPaginatorModule],
  templateUrl: '../../shared/base-table/base-table.html',
  styleUrls: ['../../shared/base-table/base-table.css'],
})
export class CustomersByCityCountComponent extends BaseTableComponent<Customer> {

  //#region serice injections
  private readonly customerService = inject(CustomerService);
  private readonly dialog = inject(MatDialog);
  //#endregion

  //#region properties
  public customersListSig = this.customerService.customersByCitySig;
  override pageEvent: WritableSignal<PageEvent> = this.customerService.pageEvent;
  override displayedColumns: WritableSignal<{ key: string, label: string }[]> = signal([
    { key: 'count', label: 'Count' },
    { key: 'city', label: 'City' },
  ]);
  override filterSig = this.customerService.filterSig;
  override title = signal<string>('Customers By City Count');
  override hideAddButton: WritableSignal<boolean> = signal(true);

  override sourceSig = computed(() => {
    const customers = this.customerService.customersByCitySig();
    return structuredClone(customers);
  });
  //#endregion
  /**
   * Method to fetch the count of customers by city from the customer service and update the corresponding signal.
   * @returns void
   */


  //#region lifecycle hooks
  //#endregion

  //#region event handlers
  /**
   * Method to handle page events from the paginator. This method updates the page event signal
   *  in the customer service with the new page event data.
   * @param e The PageEvent emitted by the paginator when the page changes.
   * @return void
   */
  override handlePageEvent(e: PageEvent): void {
    this.customerService.pageEvent.set(e);
  }
  /**
   * Method to delete a customer. This is a placeholder method and should be implemented to call the appropriate service method to delete the customer.
   * @param customer - The customer to be deleted.
   * @returns void
   */
  override onDelete(customer: Customer): void {
    this.dialog
      .open(ConfirmDialogComponent, {
        data: {
          title: `Delete Customer`,
          text: `Are you sure you want to delete this customer?`,
          cancelBtn: false,
        },
      })
      .afterClosed()
      .subscribe((result) => {
        if (result?.success) {
          this.customerService.deleteCustomer(customer.id!)

        }
      });
  }
  //#endregion

}
