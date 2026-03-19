import { inject, Injectable, signal } from "@angular/core";
import { environment } from "../../../../environments/environment";
import { Customer } from "../../../shared/models";

declare global {
  interface Window {
    google: typeof google;
  }
}

type Marker = {
  position: google.maps.LatLngLiteral;
  label?: string;
};

function toAddress(c: Customer): string {
  return `${c.street}, ${c.city}, ${c.postcode}, ${c.country}`;
}

@Injectable({ providedIn: 'root' })
export class GoogleMapsLoader {
  private geocoder?: google.maps.Geocoder;
  private loadingPromise?: Promise<void>;
  private cache: Map<string, google.maps.LatLngLiteral> = new Map();
  readonly markers = signal<Marker[]>([]);

  public async load(): Promise<void> {
    if (window.google?.maps) {
      return Promise.resolve();
    }

    if (this.loadingPromise) {
      return this.loadingPromise;
    }

    this.loadingPromise = new Promise<void>((resolve, reject) => {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${environment.googleMapsApiKey}&libraries=places`;
      script.async = true;
      script.defer = true;

      script.onload = () => resolve();
      script.onerror = reject;

      document.head.appendChild(script);
    });

    return this.loadingPromise;
  }

  private async getGeocoder(): Promise<google.maps.Geocoder> {
    if (this.geocoder) return this.geocoder;

    await this.load(); // guarantees google exists
    this.geocoder = new google.maps.Geocoder();
    return this.geocoder;
  }

  async geocode(address: string): Promise<google.maps.LatLngLiteral> {
    // Check if the address is in cache
    if (this.cache.has(address)) {
      return this.cache.get(address)!;
    }

    const geocoder = await this.getGeocoder();

    return new Promise((resolve, reject) => {
      geocoder.geocode({ address }, (results, status) => {
        if (status === 'OK' && results?.length) {
          const loc = results[0].geometry.location;
          const latLng: google.maps.LatLngLiteral = { lat: loc.lat(), lng: loc.lng() };

          // Cache the result for future use
          this.cache.set(address, latLng);

          resolve(latLng);
        } else {
          reject(status);
        }
      });
    });
  }

  async loadCustomers(customers: Customer[], selectedFilter: 'City' | 'Postcode', filterValue: string) {
    let filteredCustomers: Customer[] = [];
    if (selectedFilter === 'City') {
      filteredCustomers = customers.filter((c: Customer) => c.city.includes(filterValue));
    } else if (selectedFilter === 'Postcode') {
      filteredCustomers = customers.filter((c: Customer) => c.postcode.includes(filterValue));
    }

    const results = await Promise.allSettled(
      filteredCustomers.map(c => this.geocode(typeof c === 'string' ? c : toAddress(c)))
    );

    const markers = results
      .map((res, i) => {
        if (res.status !== 'fulfilled') return null;

        return {
          position: res.value,
          label: typeof filteredCustomers[i] === 'string' ? filteredCustomers[i] : (filteredCustomers[i] as Customer).name,
        };
      })
      .filter(Boolean) as Marker[];

    this.markers.set(markers);
  }
}
