import { Component, computed, effect, inject, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { CustomerService } from './services/customer.service';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { MatSort, MatSortModule, Sort } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { take } from 'rxjs';
import { GenericFormDialog } from '../../shared/manager/generic-form-dialog';
import { ActionMode, Customer, FormDialogData } from '../../shared/models';
import { ConfirmDialogComponent } from '../../shared/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-customers',
  imports: [MatTableModule, MatSortModule, MatButtonModule, MatIconModule],
  templateUrl: './customers.html',
  styleUrl: './customers.css',
})
export class Customers {

  //#region serice injections
  private readonly customerService = inject(CustomerService);
  private _liveAnnouncer = inject(LiveAnnouncer);
  private readonly dialog = inject(MatDialog);
  //#endregion
  public customersListSig = this.customerService.customersSig;
  public displayedColumns: string[] = ['id', 'name', 'actions'];
  public dataSource = computed(() => new MatTableDataSource(this.customersListSig()));
  @ViewChild(MatSort) sort!: MatSort;
  private _ = effect(() => {
    this.dataSource().sort = this.sort;
  });
  //#region lifecycle hooks
  ngOnInit() {
    this.customerService.getCustomers();
  }

  /**
   * Method to open a dialog for adding a new customer.
   *  It uses the GenericFormDialog component and passes the necessary data for creating a new customer.
   *  After the dialog is closed, it checks if a new customer was created and adds it to the customer service.
   * @returns void
   */
  public addCustomer(): void {
    const dialogRef = this.dialog.open(GenericFormDialog<Customer>, {
      data: {
        model: { id: null, name: '' } as Customer,
        mode: ActionMode.CREATE,
        formSchema: {}, // Replace with actual schema
        fields: [
          { key: 'name', label: 'Customer Name', type: 'text', placeholder: 'Enter name' }
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
  public editCustomer(customer: Customer): void {
    const dialogRef = this.dialog.open(GenericFormDialog<Customer>, {
      data: {
        model: { ...customer },
        mode: ActionMode.EDIT,
        formSchema: {}, // Replace with actual schema
        fields: [
          { key: 'name', label: 'Customer Name', type: 'text', placeholder: 'Enter name' }
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
  /**
   * Method to delete a customer. This is a placeholder method and should be implemented to call the appropriate service method to delete the customer.
   * @param customer - The customer to be deleted.
   * @returns void
   */
  public deleteCustomer(customer: Customer): void {
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
  /**
   * Method to announce the change in sort state for assistive technology.
   * @param sortState - The current state of sorting, which includes the active sort and the direction
   * (ascending, descending, or none). This method uses the LiveAnnouncer service to announce the sorting
   * state to assistive technologies, such as screen readers.
   * If there is an active sort direction, it announces whether the sorting is ascending or descending. If there is no active sort,
   *  it announces that sorting has been cleared.
   * @returns void
   */
  public announceSortChange(sortState: Sort): void {
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
  }
}
