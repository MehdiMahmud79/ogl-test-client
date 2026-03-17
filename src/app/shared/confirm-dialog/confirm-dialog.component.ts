import {
  Component,
  HostListener,
  Inject,
  ElementRef,
  ChangeDetectionStrategy,
} from '@angular/core';


import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-confirm-dialog',
  templateUrl: './confirm-dialog.component.html',
  styleUrls: ['./confirm-dialog.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatDialogModule, MatButtonModule],
})
export class ConfirmDialogComponent {
  //#region properties
  private selectedNoButton: boolean;
  //#endregion
  //#region constructor
  public constructor(
    public dialogRef: MatDialogRef<ConfirmDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private readonly element: ElementRef,
  ) {
    this.selectedNoButton = true;
  }
  //#endregion
  ngOnInit(): void {}
  //#region GUI handlers
  public onNoClick(): void {
    this.dialogRef.close({
      success: false,
      data: this.data.data,
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
      data: this.data.data,
    });
  }
  //#endregion

  @HostListener('document:keydown.arrowright')
  @HostListener('document:keydown.arrowleft')
  public switchSelectedButton(): void {
    const buttons = this.element.nativeElement.querySelectorAll('button');
    for (let button of buttons) {
      if (button != document.activeElement) {
        button.focus();
        break;
      }
    }
  }
}
