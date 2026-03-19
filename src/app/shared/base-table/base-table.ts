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
  //#region service injections
  private _liveAnnouncer = inject(LiveAnnouncer);
  //#endregion

  //#region properties
  public sourceSig: any;
  public dataSource = new MatTableDataSource<T>();
  public title = signal<string>('Base Table');
  public displayedColumns = signal<{ key: string, label: string }[]>([]);
  public pageEvent = signal<PageEvent | null>(null);
  public pageSizeOptions = [20, 50, 100];
  public defaultPageSize = 20;
  public filterSig = signal<string>('');
  public hideAddButton = signal<boolean>(false);
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  public recordNumber = signal(0);
  //#endregion
  //#region computed signals
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
  //#endregion

  //#region lifecycle hooks

  //#endregion

  //#region GUI handlers
  /**
   * Method to handle page events from the paginator.
   *  This method can be overridden by subclasses to implement specific pagination logic.
   * @param e The PageEvent emitted by the paginator when the page changes.
   */
  public handlePageEvent(e: PageEvent): void { }
  //#endregion

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

  /**
   * Method to announce sort changes for accessibility.
   *  This method uses the LiveAnnouncer service to announce the current sort state to assistive technologies.
   *  It also updates the data source's sort property to ensure that the sorting is applied to the table.
   * @param sortState
   */
  public announceSortChange(sortState: Sort): void {
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
      this.dataSource.sort = this.sort;

    } else {
      this._liveAnnouncer.announce('Sorting cleared');
      this.dataSource.sort = this.sort;
    }
  }

  /**
   * Method to handle deletion of an element. This method can be overridden by subclasses to implement specific deletion logic.
   * @param element The element to be deleted.
   */
  public onDelete?(element: T): void { }
  /**
   * Method to handle editing of an element. This method can be overridden by subclasses to implement specific editing logic.
   * @param element The element to be edited.
   */
  public onEdit?(element: T): void { }
  /**
   * Method to handle adding a new element. This method can be overridden by subclasses to implement specific adding logic.
   */
  public onAdd?(): void { }

  /**
   * Method to handle search queries. This method updates the filter signal and applies the filter to the data source.
   * @param query The search query entered by the user. This query is used to filter the data in the
   *  table based on the specified criteria.
   */
  public find(query: string): void {
    this.filterSig.set(query);
    this.dataSource.filter = query.trim().toLowerCase();
    this.recordNumber.set(this.dataSource.filteredData.length);
  }
  //#endregion

}
