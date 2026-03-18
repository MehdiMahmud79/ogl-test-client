import { Component, inject, signal } from '@angular/core';
import { GoogleMapsModule } from '@angular/google-maps';
import { GoogleMapsLoader } from './services/google-map.service';
import { GeocodingService } from './services/geocoding.service';
import { Customer } from '../../shared/models';

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
  templateUrl: './map.html',
  styleUrl: './map.css',
})
export class MapTracker {
  //#region service injections
  private readonly googleMapsLoader = inject(GoogleMapsLoader);
  private readonly geo = inject(GeocodingService);
  //#endregion
  public ready = signal(false);

  readonly center = signal<google.maps.LatLngLiteral>({ lat: 52.4862, lng: -1.8904 });
  readonly zoom = signal(14);
  readonly markers = signal<Marker[]>([]);

  async ngOnInit() {
    await this.googleMapsLoader.load();
    this.ready.set(true);
    this.loadCustomers([
      {
        "id": 1,
        "name": "David Brown",
        "street": "134 Victoria Street",
        "city": "Birmingham",
        "country": "UK",
        "postcode": "J7 6YD"
      }
    ]);
  }


  async loadCustomers(customers: Customer[]) {
    const results = await Promise.allSettled(
      customers.map(c => this.geo.geocode(toAddress(c)))
    );

    const markers = results
      .map((res, i) => {
        if (res.status !== 'fulfilled') return null;

        return {
          position: res.value,
          label: customers[i].name,
        };
      })
      .filter(Boolean) as Marker[];

    this.markers.set(markers);
  }
}
