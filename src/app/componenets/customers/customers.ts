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
export class Customers extends BaseTableComponent<Customer> {

  //#region serice injections
  private readonly customerService = inject(CustomerService);
  private readonly dialog = inject(MatDialog);
  //#endregion
  public customersListSig = this.customerService.customersSig;
  override pageEvent: WritableSignal<PageEvent> = this.customerService.pageEvent;
  override displayedColumns: WritableSignal<{ key: string, label: string }[]> = signal([
    { key: 'id', label: 'ID' },
    { key: 'name', label: 'Name' },
    { key: 'street', label: 'Street' },
    { key: 'city', label: 'City' },
    { key: 'country', label: 'Country' },
    { key: 'postcode', label: 'Postcode' },
    { key: 'actions', label: 'Actions' }
  ]);
  override filterSig = this.customerService.filterSig;
  override title = signal<string>('Customers');
  override sourceSig = computed(() => {
    const customers = this.customerService.customersSig();
    return structuredClone(customers);
  });

  /**
   *
   */


  //#region lifecycle hooks

  /**
   * Method to open a dialog for adding a new customer.
   *  It uses the GenericFormDialog component and passes the necessary data for creating a new customer.
   *  After the dialog is closed, it checks if a new customer was created and adds it to the customer service.
   * @returns void
   */
  override onAdd(): void {
    const dialogRef = this.dialog.open(GenericFormDialog<Customer>, {
      data: {
        model: { id: null, name: '', street: '', city: '', country: '', postcode: '' } as Customer,
        mode: ActionMode.CREATE,
        formSchema: {}, // Replace with actual schema
        fields: [
          { key: 'name', label: 'Customer Name', type: 'text', placeholder: 'Enter name' },
          { key: 'street', label: 'Street', type: 'text', placeholder: 'Enter street' },
          { key: 'city', label: 'City', type: 'text', placeholder: 'Enter city' },
          { key: 'country', label: 'Country', type: 'text', placeholder: 'Enter country' },
          { key: 'postcode', label: 'Postcode', type: 'text', placeholder: 'Enter postcode' }
        ]
      } as FormDialogData<Customer>,
      width: '900px',
      height: '600px',
      disableClose: true,
    },

    );
    dialogRef.afterClosed().pipe(take(1)).subscribe((result) => {
      const newCustomer = result?.data;
      if (newCustomer) {
        this.customerService.addCustomer(newCustomer);
      }

    });
  }
  /**
   * Method to open a dialog for editing an existing customer.
   * It uses the GenericFormDialog component and passes the necessary data for editing the selected customer.
   * After the dialog is closed, it checks if the customer was updated and updates it in the customer service.
   */
  override onEdit(customer: Customer): void {
    const dialogRef = this.dialog.open(GenericFormDialog<Customer>, {
      data: {
        model: { ...customer },
        mode: ActionMode.EDIT,
        formSchema: {}, // Replace with actual schema
        fields: [
          { key: 'name', label: 'Customer Name', type: 'text', placeholder: 'Enter name' },
          { key: 'street', label: 'Street', type: 'text', placeholder: 'Enter street' },
          { key: 'city', label: 'City', type: 'text', placeholder: 'Enter city' },
          { key: 'country', label: 'Country', type: 'text', placeholder: 'Enter country' },
          { key: 'postcode', label: 'Postcode', type: 'text', placeholder: 'Enter postcode' }
        ]
      } as FormDialogData<Customer>,
      width: '900px',
      height: '600px',
      disableClose: true,
    });
    dialogRef.afterClosed().pipe(take(1)).subscribe((result) => {
      const updatedCustomer = result?.data;
      console.log(updatedCustomer);
      if (updatedCustomer) {
        this.customerService.editCustomer(updatedCustomer);
      }
    });
  }
  override handlePageEvent(e: PageEvent) {
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

}
