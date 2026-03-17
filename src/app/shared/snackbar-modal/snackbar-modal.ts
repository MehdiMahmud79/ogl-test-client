import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBarLabel, MatSnackBarActions, MatSnackBarAction, MatSnackBarRef } from '@angular/material/snack-bar';
import { MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar';

@Component({
  selector: 'app-snackbar-modal',
  standalone: true,
  imports: [MatButtonModule, MatSnackBarLabel, MatSnackBarActions, MatSnackBarAction],
  templateUrl: './snackbar-modal.html',
  styleUrl: './snackbar-modal.css',
})

export class SnackbarModal {
  snackBarRef = inject(MatSnackBarRef);
  data = inject(MAT_SNACK_BAR_DATA);


}
