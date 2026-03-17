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

  readonly dialogRef = inject(MatDialogRef<GenericFormDialog<T>>);
  private notificationService = inject(NotificationService);

  public modelSig!: ReturnType<typeof signal<T>>;
  public formInstance: any;

  constructor(@Inject(MAT_DIALOG_DATA) public data: FormDialogData<T>) {
    this.modelSig = signal<T>({ ...data.model });
    this.formInstance = form(this.modelSig, data.formSchema);
  }

  public onSubmit(): void {
    if (this.formInstance().valid()) {
      this.dialogRef.close({
        data: this.formInstance().value()
      });
    } else {
      this.notificationService.showError('Form is invalid!', 'Please correct the errors and try again.');
    }
  }

  public closeForm(): void {
    this.dialogRef.close({ data: null });
  }
}
