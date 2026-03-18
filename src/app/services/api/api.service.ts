import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { CityCount, Customer, Product } from '../../shared/models';

@Injectable({
  providedIn: 'root',
})
export class ApiService {

  //# region service injections
  protected httpClient: HttpClient = inject(HttpClient);
  //# endregion

  //#region properties
  /** Base URL for the API, can be configured in the environment file */
  private readonly apiUrl = environment.apiUrl;
  //#endregion

  //#region public methods
  /**
   * Method to get all products
   * @returns An observable of an array of products
   */
  public getProducts(): Observable<Product[]> {
    const url = `${this.apiUrl}/product`;
    return this.httpClient.get<Product[]>(url, { responseType: 'json' });
  }

  /**
   * Method to add a new product
   * @param product The product to be added
   * @returns An observable of the added product
   */
  public addProduct(product: Product): Observable<Product> {
    const url = `${this.apiUrl}/product`;
    return this.httpClient.post<Product>(url, product, { responseType: 'json' });
  }


  /**
   * Method to get all customers
   * @param filter Optional filter string to filter customers by name, city, or country
   * @returns An observable of an array of customers
   */
  public getCustomers(): Observable<Customer[]> {
    const url = `${this.apiUrl}/customer`;
    return this.httpClient.get<Customer[]>(url, { responseType: 'json' });
  }


  /**
   * Method to add a new customer
   * @param customer The customer to be added
   * @returns An observable of the added customer
   */

  public addCustomer(customer: Customer): Observable<Customer> {
    const url = `${this.apiUrl}/customer`;
    return this.httpClient.post<Customer>(url, customer, { responseType: 'json' });
  }

  /**
   * Method to edit an existing customer
   * @param customer The customer to be edited
   * @returns An observable of the edited customer
   */
  public editCustomer(customer: Customer): Observable<Customer> {
    const url = `${this.apiUrl}/customer/${customer.id}`;
    return this.httpClient.put<Customer>(url, customer, { responseType: 'json' });
  }
  /**
   * Method to delete a customer
   * @param customerId The ID of the customer to be deleted
   * @returns An observable of void
   */
  public deleteCustomer(customerId: number): Observable<void> {
    const url = `${this.apiUrl}/customer/${customerId}`;
    return this.httpClient.delete<void>(url, { responseType: 'json' });
  }

  /**
   * Method to get count by city
   * @returns An observable of an object where keys are city names and values are counts of customers in those cities
   */
  public getCountByCity(): Observable<CityCount[]> {
    const url = `${this.apiUrl}/customer/count-by-city`;
    return this.httpClient.get<CityCount[]>(url, { responseType: 'json' });
  }

  //#endregion
}
