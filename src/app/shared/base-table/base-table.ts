import { ScrollingModule } from "@angular/cdk/scrolling";
import { Component, computed, effect, inject, signal, ViewChild } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatDialog } from "@angular/material/dialog";
import { MatIconModule } from "@angular/material/icon";
import { MatPaginatorModule, MatPaginator, PageEvent } from "@angular/material/paginator";
import { MatSortModule, MatSort, Sort } from "@angular/material/sort";
import { MatTableModule, MatTableDataSource } from "@angular/material/table";
import { FormDialogData } from "../models";
import { GenericFormDialog } from "../manager/generic-form-dialog";
import { take } from "rxjs";
import { LiveAnnouncer } from "@angular/cdk/a11y";
import { CommonModule } from "@angular/common";
import { SearchBarComponent } from "../search-bar/search-bar";

@Component({
  selector: 'app-base-table',
  imports: [MatTableModule, CommonModule, SearchBarComponent, MatSortModule, MatButtonModule, MatIconModule, ScrollingModule, MatPaginatorModule],
  templateUrl: './base-table.html',
  styleUrls: ['./base-table.css'],
})
export abstract class BaseTableComponent<T> {

  private _liveAnnouncer = inject(LiveAnnouncer);
  public sourceSig: any;
  protected abstract fetch(): void;
  public dataSource = new MatTableDataSource<T>();
  title = '';
  displayedColumns = signal<{ key: string, label: string }[]>([]);
  pageEvent = signal<PageEvent | null>(null);
  pageSizeOptions = [20, 50, 100];
  defaultPageSize = 20;
  filterSig = signal<string>('');
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  public recordNumber = signal(0);

  public data = computed(() => {
    const sourceData = this.sourceSig();

    this.dataSource.data = sourceData ?? [];
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    return sourceData;
  });
  private _ = effect(() => {
    this.dataSource.data = this.sourceSig() || [];
    if (this.sort) {
      this.dataSource.sort = this.sort;
    }
  });


  ngOnInit() {
    this.fetch();
  }
  handlePageEvent(e: PageEvent) {
  }
  protected openDialog<T>(
    dialog: MatDialog,
    config: FormDialogData<T>
  ) {
    return dialog
      .open(GenericFormDialog<T>, {
        data: config,
        disableClose: true,
      })
      .afterClosed()
      .pipe(take(1));
  }
  public announceSortChange(sortState: Sort): void {
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
      this.dataSource.sort = this.sort;

    } else {
      this._liveAnnouncer.announce('Sorting cleared');
      this.dataSource.sort = this.sort;
    }
  }
  public onDelete?(element: T) {
  }
  public onEdit?(element: T) {

  }
  public onAdd?() {
  }
  public find(query: string) {
    this.filterSig.set(query);
    this.dataSource.filter = query.trim().toLowerCase();
    this.recordNumber.set(this.dataSource.filteredData.length);
  }

}
