import {
  Component,
  Inject,
  ChangeDetectionStrategy,
} from '@angular/core';


import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
export interface ConfirmDialogData {
  title: string;
  text: string;
  cancelBtn: boolean;
  confirmText?: string;
  cancelText?: string;
}
@Component({
  selector: 'app-confirm-dialog',
  templateUrl: './confirm-dialog.component.html',
  styleUrls: ['./confirm-dialog.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatDialogModule, MatButtonModule],
})
export class ConfirmDialogComponent {

  //#region constructor
  public constructor(
    public dialogRef: MatDialogRef<ConfirmDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ConfirmDialogData,
  ) {
  }
  //#endregion
  ngOnInit(): void {
    console.log('ConfirmDialogComponent initialized with data:', this.data);
  }
  //#region GUI handlers
  public onNoClick(): void {
    this.dialogRef.close({
      success: false,
      data: this.data,
    });
  }
  public onCancelClick(): void {
    this.dialogRef.close({
      success: false,
      data: { cancel: true },
    });
  }
  public onYesClick(): void {
    this.dialogRef.close({
      success: true,
      data: this.data,
    });
  }
  //#endregion

}
