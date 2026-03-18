import { Component, ChangeDetectionStrategy, output, ViewChild, ElementRef, AfterContentChecked, model } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInput, MatInputModule } from '@angular/material/input';
import { debounceTime, distinctUntilChanged } from 'rxjs';

@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.html',
  styleUrls: ['./search-bar.css'],
  imports: [MatInput, MatButtonModule, MatIconModule, MatInputModule, MatButtonModule, ReactiveFormsModule, FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchBarComponent implements AfterContentChecked {
  public searchQuery = model<string>('');
  public find = output<string>();
  public icon = 'search';
  @ViewChild('input', { static: false }) input!: ElementRef<HTMLInputElement>;
  ngAfterContentChecked(): void {
    this.input?.nativeElement?.focus();
  }
  private queryChange$ = toObservable(this.searchQuery).pipe(
    debounceTime(500),
    distinctUntilChanged()
  );

  ngOnInit() {
    this.queryChange$.subscribe(value => {
      this.find.emit(value);
    });
  }
}
