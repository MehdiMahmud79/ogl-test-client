import { Component, effect, input, InputSignal, model, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatAutocompleteModule, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { FilterOptionsPipe } from './filter-options.pipe';


export type SelectEvent = {
  value: string | number;
  autocompleteField: string;
  fieldName: string;
};
@Component({
  selector: 'select-option',
  imports: [MatInputModule, MatIconModule,
    MatAutocompleteModule, FormsModule, FilterOptionsPipe],
  templateUrl: './select-option.html',
  styleUrl: './select-option.css',
})
export class SelectOption {
  //#region Inputs and Outputs
  public title = input.required<string>();
  public options = model<(string | number)[]>([]);
  public value = model<string | number>('');
  public useAutoComplete = input(false);
  public onSelect = output<string>();
  //#endregion

  //#region public methods
  /**
   * Method to emit the eventon selecting the text field item
   * @param value value of the input field
   * @returns void
   */
  public onSelectFromInput(value: string): void {
    this.onSelect.emit(value);
  }

  /**
   * Method to emit the event on selecting autocomplete option
   * @param $event autocomplete selected event
   */
  public onAutocompleteSelect($event: MatAutocompleteSelectedEvent): void {
    this.onSelectFromInput($event.option.value);
  }
  //#endregion
}
