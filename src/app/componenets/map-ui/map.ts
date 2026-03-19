import { Component, effect, inject, signal } from '@angular/core';
import { GoogleMapsModule } from '@angular/google-maps';
import { GoogleMapsLoader } from './services/google-map.service';
import { Customer } from '../../shared/models';
import { CustomerService } from '../customers/services/customer.service';
import { SelectOption } from '../../shared/select/select-option';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';


@Component({
  selector: 'app-map',
  standalone: true,
  imports: [GoogleMapsModule, SelectOption, MatProgressSpinnerModule],
  providers: [],
  templateUrl: './map.html',
  styleUrl: './map.css',
})
export class MapTracker {
  //#region service injections
  private readonly googleMapsLoader = inject(GoogleMapsLoader);
  private readonly customerService = inject(CustomerService);
  //#endregion
  public markers = this.googleMapsLoader.markers;
  public selectedFilter = signal<'City' | 'Postcode'>('City');
  public filterValue = signal('');
  public ready = signal(false);
  public cityList = this.customerService.cityListSig;
  public postCodeList = this.customerService.postCodeListSig;
  readonly center = signal<google.maps.LatLngLiteral>({ lat: 52.4862, lng: -1.8904 });
  readonly zoom = signal(14);
  private _ = effect(() => {
    this.loadCustomers(this.customerService.customersSig());
  });
  private _selectedFilter = effect(() => {
    this.loadCustomers(this.selectedFilter() === 'City' ?
      this.customerService.customersSig().filter(c => c.city.includes(this.filterValue()))
      : this.customerService.customersSig().filter(c => c.postcode.includes(this.filterValue())));
  });
  async ngOnInit() {
    this.customerService.getCustomers();
    await this.googleMapsLoader.load();
    this.ready.set(true);
  }


  private async loadCustomers(customers: Customer[]) {
    await this.googleMapsLoader.loadCustomers(customers, this.selectedFilter(), this.filterValue());
  }
}
