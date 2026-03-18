import { computed, inject, Injectable, signal } from '@angular/core';
import { ApiService } from '../../../services/api/api.service';
import { Customer } from '../../../shared/models';
import { PageEvent } from '@angular/material/paginator';

@Injectable({
  providedIn: 'root',
})
export class CustomerService {

  //#region service injections
  private readonly apiService = inject(ApiService);

  //#endregion
  //#region properties
  public customersSig = signal<Customer[]>([]);
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
   * Method to add a new customer
   * @param customer Customer to be added
   * @returns void
   */
  public addCustomer(customer: Customer): void {
    // Call the API service to add the customer
    this.apiService.addCustomer(customer).subscribe((newCustomer) => {
      // Update the customers signal with the new customer
      this.customersSig.update((customers) => [...customers, newCustomer as Customer]);
    });
  }
  /**
   * Method to edit an existing customer
   * @param customer Customer to be edited
   * @returns void
   */
  public editCustomer(customer: Customer): void {
    this.apiService.editCustomer(customer).subscribe((updatedCustomer) => {
      // Update the customers signal with the updated customer
      this.customersSig.update((customers) =>
        customers.map((c) => (c.id === updatedCustomer.id ? (updatedCustomer as Customer) : c))
      );
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
