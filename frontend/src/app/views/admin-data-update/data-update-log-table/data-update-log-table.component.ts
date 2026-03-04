import {Component, EventEmitter, Input, Output, Signal} from '@angular/core';
import {NgxDatatableModule, TableColumn} from "@swimlane/ngx-datatable";
import {DataUpdateLog} from "../../../model/data-update-log";
import {DatePipe} from "@angular/common";
import {IconDirective} from "@coreui/icons-angular";

@Component({
  selector: 'app-data-update-log-table',
  templateUrl: './data-update-log-table.component.html',
  styleUrl: './data-update-log-table.component.scss',
  standalone: true,
    imports: [
        NgxDatatableModule,
        DatePipe,
        IconDirective
    ]
})
export class DataUpdateLogTableComponent {

  @Input() logs!: Signal<DataUpdateLog[]>;
  @Output() downloadFileEvent = new EventEmitter<string>();

  protected columns: TableColumn[] = [
    {prop: 'createdDate', name: 'Import Date'},
    {prop: 'status', name: 'Status'},
    {prop: 'processed', name: 'Successfully processed'},
    {prop: 'error', name: 'Not processed'},
  ];

  protected downloadFile(id: string) {
    this.downloadFileEvent.emit(id);
  }
}