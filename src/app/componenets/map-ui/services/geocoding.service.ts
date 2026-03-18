import { Injectable } from "@angular/core";
import { GoogleMapsLoader } from "./google-map.service";

@Injectable({ providedIn: 'root' })
export class GeocodingService {
  private geocoder?: google.maps.Geocoder;

  constructor(private loader: GoogleMapsLoader) { }

  private async getGeocoder(): Promise<google.maps.Geocoder> {
    if (this.geocoder) return this.geocoder;

    await this.loader.load(); // ✅ guarantees google exists

    this.geocoder = new google.maps.Geocoder();
    return this.geocoder;
  }

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
