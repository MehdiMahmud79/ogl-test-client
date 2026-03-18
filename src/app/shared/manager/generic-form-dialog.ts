import { Component, inject, signal, Inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { form, FormField } from '@angular/forms/signals';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormDialogData } from '../models';
import { NotificationService } from '../../services/notification/notifcation-service';



@Component({
  selector: 'app-generic-form-dialog',
  imports: [FormField, FormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule, MatDialogModule],

  templateUrl: './generic-form-dialog.html',
  styleUrls: ['./generic-form-dialog.css'],
})
export class GenericFormDialog<T> {
  // #region service injections
  readonly dialogRef = inject(MatDialogRef<GenericFormDialog<T>>);
  private notificationService = inject(NotificationService);
  //#endregion

  // #region properties
  public modelSig!: ReturnType<typeof signal<T>>;
  public formInstance: any;
  //#endregion

  //#region constructor
  constructor(@Inject(MAT_DIALOG_DATA) public data: FormDialogData<T>) {
    this.modelSig = signal<T>({ ...data.model });
    this.formInstance = form(this.modelSig, data.formSchema);
  }
  //#endregion

  //#region public methods

  /**
   * Method to handle form submission. It checks if the form is valid and then closes the dialog,
   *  passing the form data back to the caller. If the form is invalid, it shows an error notification.
   */
  public onSubmit(): void {
    if (this.formInstance().valid()) {
      this.dialogRef.close({
        data: this.formInstance().value()
      });
    } else {
      this.notificationService.showError('Form is invalid!', 'Please correct the errors and try again.');
    }
  }

  /**
   * Method to close the form dialog without submitting. It simply closes the dialog and returns null data.
   */
  public closeForm(): void {
    this.dialogRef.close({ data: null });
  }
  //#endregion
}
