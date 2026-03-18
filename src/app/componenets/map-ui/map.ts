import { Component, signal } from '@angular/core';
import { GoogleMapsModule } from '@angular/google-maps';

@Component({
  selector: 'app-map',
  standalone: true,
  imports: [GoogleMapsModule],
  templateUrl: './map.html',
  styleUrl: './map.css',
})
export class MapTracker {
  readonly apiKey = 'YOUR_GOOGLE_MAPS_API_KEY';
  readonly center = signal({ lat: 35.6844, lng: 139.753 });
  readonly zoom = signal(14);
}
