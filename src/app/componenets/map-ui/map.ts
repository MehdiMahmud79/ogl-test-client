import { Component, effect, inject, signal } from '@angular/core';
import { GoogleMapsModule } from '@angular/google-maps';
import { GoogleMapsLoader } from './services/google-map.service';
import { GeocodingService } from './services/geocoding.service';
import { Customer } from '../../shared/models';
import { CustomerService } from '../customers/services/customer.service';

type Marker = {
  position: google.maps.LatLngLiteral;
  label?: string;
};
function toAddress(c: Customer): string {
  return `${c.street}, ${c.city}, ${c.postcode}, ${c.country}`;
}

@Component({
  selector: 'app-map',
  standalone: true,
  imports: [GoogleMapsModule],
  providers: [],
  templateUrl: './map.html',
  styleUrl: './map.css',
})
export class MapTracker {
  //#region service injections
  private readonly googleMapsLoader = inject(GoogleMapsLoader);
  private readonly geo = inject(GeocodingService);
  private readonly customerService = inject(CustomerService);
  //#endregion
  public ready = signal(false);
  public cityList = this.customerService.cityListSig;
  readonly center = signal<google.maps.LatLngLiteral>({ lat: 52.4862, lng: -1.8904 });
  readonly zoom = signal(14);
  readonly markers = signal<Marker[]>([]);
  private _ = effect(() => {
    this.loadCustomers(this.customerService.customersSig());
  });
  async ngOnInit() {
    this.customerService.getCustomers();
    await this.googleMapsLoader.load();
    this.ready.set(true);
  }


  async loadCustomers(customers: Customer[] | string[]) {
    const results = await Promise.allSettled(
      customers.map(c => this.geo.geocode(typeof c === 'string' ? c : toAddress(c)))
    );

    const markers = results
      .map((res, i) => {
        if (res.status !== 'fulfilled') return null;

        return {
          position: res.value,
          label: typeof customers[i] === 'string' ? customers[i] : customers[i].name,
        };
      })
      .filter(Boolean) as Marker[];

    this.markers.set(markers);
  }
}
