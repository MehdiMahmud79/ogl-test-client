import { inject, Injectable } from "@angular/core";
import { GoogleMapsLoader } from "./google-map.service";

@Injectable({ providedIn: 'root' })
export class GeocodingService {
  private loader: GoogleMapsLoader = inject(GoogleMapsLoader);
  private geocoder?: google.maps.Geocoder;


  /**
   * Method to get the Google Maps Geocoder instance, loading the API if necessary
   * @returns A promise that resolves to the Google Maps Geocoder instance
   */
  private async getGeocoder(): Promise<google.maps.Geocoder> {
    if (this.geocoder) return this.geocoder;

    await this.loader.load(); // ✅ guarantees google exists

    this.geocoder = new google.maps.Geocoder();
    return this.geocoder;
  }

  /**
   * Method to geocode an address into latitude and longitude
   * @param address The address to be geocoded
   * @returns A promise that resolves to the latitude and longitude of the address
   */
  async geocode(address: string): Promise<google.maps.LatLngLiteral> {
    const geocoder = await this.getGeocoder();

    return new Promise((resolve, reject) => {
      geocoder.geocode({ address }, (results, status) => {
        if (status === 'OK' && results?.length) {
          const loc = results[0].geometry.location;
          resolve({ lat: loc.lat(), lng: loc.lng() });
        } else {
          reject(status);
        }
      });
    });
  }
}
