import { Injectable } from "@angular/core";
import { environment } from "../../../../environments/environment";

declare global {
  interface Window {
    google: typeof google;
  }
}

@Injectable({ providedIn: 'root' })
export class GoogleMapsLoader {
  private loadingPromise?: Promise<void>;

  public async load(): Promise<void> {
    // Already loaded
    if (window.google?.maps) {
      return Promise.resolve();
    }

    // Already loading
    if (this.loadingPromise) {
      return this.loadingPromise;
    }

    this.loadingPromise = new Promise<void>((resolve, reject) => {
      const script = document.createElement('script');

      script.src =
        `https://maps.googleapis.com/maps/api/js?key=${environment.googleMapsApiKey}&libraries=places`;

      script.async = true;
      script.defer = true;

      script.onload = () => resolve();
      script.onerror = reject;

      document.head.appendChild(script);
    });

    return this.loadingPromise;
  }

}
