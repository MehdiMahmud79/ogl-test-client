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

  //#region properties
  public markers = this.googleMapsLoader.markers;
  public filterBy = signal<'City' | 'Postcode'>('City');
  public cityOrPostcode = signal('');
  public ready = signal(false);

  public cityList = this.customerService.cityListSig;
  public postCodeList = this.customerService.postCodeListSig;

  readonly center = signal<google.maps.LatLngLiteral>({ lat: 52.4862, lng: -1.8904 });  // Default to Nottingham
  readonly zoom = signal(14);
  //#endregion

  //#region constructor and lifecycle

  constructor() {
    // Effect to load filtered customers and update the map based on city/postcode selection
    effect(() => {
      this.loadCustomers(
        this.filterBy() === 'City'
          ? this.customerService.customersSig().filter(c => c.city.includes(this.cityOrPostcode()))
          : this.customerService.customersSig().filter(c => c.postcode.includes(this.cityOrPostcode()))
      );
    });
  }

  async ngOnInit() {
    this.customerService.getCustomers();
    await this.googleMapsLoader.load();
    this.ready.set(true);
  }
  //#endregion

  //#region methods
  /**
   * Method to load customers and update the map based on the selected filter (city or postcode) and the corresponding value.
   * It filters the customers based on the selected criteria, geocodes their addresses, and updates the markers on the map accordingly.
   * @param customers An array of Customer objects to be loaded and displayed on the map.
   */
  private async loadCustomers(customers: Customer[]): Promise<void> {
    await this.googleMapsLoader.loadCustomers(customers, this.filterBy(), this.cityOrPostcode());
    await this.updateMapCenterAndZoom();

  }

  /**
   * Method to geocode an address using the Google Maps Geocoding API.
   * It first checks if the geocoded result for the given address is already cached to avoid unnecessary API calls.
   * If the result is not cached, it uses the geocoder to get the latitude and longitude of the address,
   * caches the result for future use, and also caches the city name with its coordinates for quick access when filtering by city.
   * This method ensures efficient geocoding by leveraging caching and dynamically storing city coordinates,
   * which enhances the performance of the map updates when users filter by city or postcode.
   * @param address The address to be geocoded, which can be a full address or a city name.
   * @returns A promise that resolves to the latitude and longitude of the geocoded address as a google.maps.LatLngLiteral object.
   */
  private async updateMapCenterAndZoom() {
    const filterValue = this.cityOrPostcode();
    console.log('Filter Value:', filterValue); // Log the filter value to confirm

    // If filter is empty, do nothing (return early)
    if (!filterValue) {
      console.log('Filter is empty, no map changes.');
      return;
    }

    // If filter is set to 'City'
    if (this.filterBy() === 'City') {
      const cityCoordinates = this.googleMapsLoader.cache.get(filterValue);
      if (cityCoordinates) {
        this.center.set(cityCoordinates);
        this.zoom.set(12);
      } else {
        try {
          const geocodeResult = await this.googleMapsLoader.geocode(filterValue);
          console.log('City Geocode Result:', geocodeResult);
          this.center.set(geocodeResult);
          this.zoom.set(12);
        } catch (error) {
          console.error('City geocoding failed:', error);
        }
      }
    } else if (this.filterBy() === 'Postcode') {
      try {
        this.zoom.set(14);  // Set zoom for postcode

        const postcodeCoordinates = await this.googleMapsLoader.geocode(filterValue);
        console.log('Postcode Geocode Result:', postcodeCoordinates);

        if (postcodeCoordinates) {
          this.center.set(postcodeCoordinates);  // Set the center if valid coordinates are found
        } else {
          console.warn('Postcode geocoding failed, falling back to city...');
          // Fallback: try a known city (e.g., Nottingham or another nearby city)
          const fallbackCoordinates = await this.googleMapsLoader.geocode('Nottingham, United Kingdom');
          console.log('Fallback Geocode Result:', fallbackCoordinates);
          if (fallbackCoordinates) {
            this.center.set(fallbackCoordinates);
            this.zoom.set(12);  // Zoom out to city level
          }
        }
      } catch (error) {
        console.error('Postcode geocoding failed:', error);
      }
    }
  }
  //#endregion
}
