import { ScrollingModule } from "@angular/cdk/scrolling";
import { Component, computed, effect, ViewChild } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatPaginatorModule, MatPaginator } from "@angular/material/paginator";
import { MatSortModule, MatSort } from "@angular/material/sort";
import { MatTableModule, MatTableDataSource } from "@angular/material/table";

@Component({
  selector: 'app-base-table',
  imports: [MatTableModule, MatSortModule, MatButtonModule, MatIconModule, ScrollingModule, MatPaginatorModule],
  templateUrl: './base-table.html',
  styleUrl: './base-table.css',
})
export abstract class BaseTableComponent<T> {
  protected abstract sourceSig: () => T[] | null;
  protected abstract fetch(): void;

  public dataSource = new MatTableDataSource<T>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  public data = computed<T[]>(() => {
    const data = this.sourceSig() ?? [];

    this.dataSource.data = data;

    if (this.sort) this.dataSource.sort = this.sort;
    if (this.paginator) this.dataSource.paginator = this.paginator;

    return data;
  });

  private _ = effect(() => {
    if (this.sort) {
      this.dataSource.sort = this.sort;
    }
  });

  ngOnInit() {
    this.fetch();
  }
}
