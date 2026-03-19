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
  public cache: Map<string, google.maps.LatLngLiteral> = new Map();

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

    await this.load();
    this.geocoder = new google.maps.Geocoder();
    return this.geocoder;
  }
  /**
   * Method to geocode an address using the Google Maps Geocoding API. It first checks if the address is already cached, and if not, it performs geocoding and caches the result for future use. Additionally, it dynamically stores the city name and its corresponding coordinates in the cache for quick access.
   * @param address The address to be geocoded, which can be a full address or a city name.
   * @returns A promise that resolves to the latitude and longitude of the geocoded address as a google.maps.LatLngLiteral object.
   */
  async geocode(address: string): Promise<google.maps.LatLngLiteral> {
    // Check if the address is already in the cache
    if (this.cache.has(address)) {
      return this.cache.get(address)!;
    }

    const geocoder = await this.getGeocoder();

    return new Promise((resolve, reject) => {
      geocoder.geocode({ address }, (results, status) => {
        if (status === 'OK' && results?.length) {
          const loc = results[0].geometry.location;
          const latLng: google.maps.LatLngLiteral = { lat: loc.lat(), lng: loc.lng() };

          // Cache the geocoded address for future use
          this.cache.set(address, latLng);

          // Dynamically store the city name and coordinates in the cache
          const cityName = address.split(',')[0].trim(); // Assuming city is the first part of the address
          if (!this.cache.has(cityName)) {
            this.cache.set(cityName, latLng);  // Cache city name if it's not already cached
          }

          resolve(latLng);
        } else {
          reject(status);
        }
      });
    });
  }

  /**
   * Method to load customers and update the map based on the selected filter (city or postcode) and the corresponding value. It filters the customers based on the selected criteria, geocodes their addresses, and updates the markers on the map accordingly.
   * @param customers An array of Customer objects to be loaded and displayed on the map.
   * @param selectedFilter The filter criteria, which can be either 'City' or 'Postcode', used to determine how to filter the customers.
   * @param filterValue The value corresponding to the selected filter (e.g., a specific city name or postcode) used to filter the customers before geocoding and displaying them on the map.
   */
  async loadCustomers(customers: Customer[], selectedFilter: 'City' | 'Postcode', filterValue: string): Promise<void> {
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
