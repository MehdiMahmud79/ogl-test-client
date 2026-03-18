import { computed, inject, Injectable, signal } from '@angular/core';
import { ApiService } from '../../../services/api/api.service';
import { CityCount, Customer } from '../../../shared/models';
import { PageEvent } from '@angular/material/paginator';
import { NotificationService } from '../../../services/notification/notifcation-service';

@Injectable({
  providedIn: 'root',
})
export class CustomerService {

  //#region service injections
  private readonly apiService = inject(ApiService);
  private readonly notificationService = inject(NotificationService);
  //#endregion
  //#region properties
  public customersSig = signal<Customer[]>([]);
  public customersByCitySig = signal<CityCount[]>([]);
  public pageEvent = signal<PageEvent>({
    pageIndex: 0,
    pageSize: 20,
    length: 1000,
  });
  public filterSig = signal<string>('');
  public cityListSig = computed(() => {
    const cities = this.customersSig().map(c => c.city);
    return Array.from(new Set(cities));
  });
  public postCodeListSig = computed(() => {
    const postCodes = this.customersSig().map(c => c.postcode);
    return Array.from(new Set(postCodes));
  });

  //#endregion

  //#region public methods
  /**
   * Method to get all customers
   * @returns void
   */
  public getCustomers(): void {
    this.apiService.getCustomers().subscribe((customers) => {
      this.pageEvent.update(pe => (structuredClone({ ...pe, length: customers?.length ?? 0 })));
      this.customersSig.set(customers);
    });
  }

  /**
   * Method to get count of customers by city
   * @returns void
   */
  public getCountByCity(): void {
    this.apiService.getCountByCity().subscribe((counts) => {
      this.customersByCitySig.set(counts);
    });
  }


  /**
   * Method to add a new customer
   * @param customer Customer to be added
   * @returns void
   */
  public addCustomer(customer: Customer): void {
    // Call the API service to add the customer
    this.apiService.addCustomer(customer).subscribe({
      next: (newCustomer) => {
        // Update the customers signal with the new customer
        this.customersSig.update((customers) => [...customers, newCustomer]);
        // Show a success notification
        this.notificationService.showSuccess('Customer added successfully', 'Success');
      },
      error: (err) => {
        // Show an error notification
        this.notificationService.showError('Failed to add customer', err.message);
        console.error('Error adding customer:', err);
      },
    });
  }
  /**
   * Method to edit an existing customer
   * @param customer Customer to be edited
   * @returns void
   */
  public editCustomer(customer: Customer): void {
    this.apiService.editCustomer(customer).subscribe({
      next: (editedCustomer) => {
        this.customersSig.update((customers) => customers.map((c) => (c.id === editedCustomer.id ? editedCustomer : c)));
        this.notificationService.showSuccess('Customer edited successfully', 'Success');
      },
      error: (err) => {
        this.notificationService.showError('Failed to edit customer', err.message);
        console.error('Error editing customer:', err);
      },
    });
  }

  /**
   * Method to delete a customer
   * @param customerId ID of the customer to be deleted
   * @returns void
   */
  public deleteCustomer(customerId: number): void {
    this.apiService.deleteCustomer(customerId).subscribe(() => {
      this.customersSig.update((customers) => customers.filter((c) => c.id !== customerId));
    });
  }

  //#endregion
}
