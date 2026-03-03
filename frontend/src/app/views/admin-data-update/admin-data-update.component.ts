import {Component, inject, OnInit} from '@angular/core';
import {ColComponent, RowComponent} from "@coreui/angular";
import {SharedModule} from "../../shared/shared.module";
import {DataUpdateLogTableComponent} from "./data-update-log-table/data-update-log-table.component";
import {DataUpdateService} from "../../service/data-update/data-update.service";
import {DataProvisionComponent} from "./data-provision/data-provision.component";
import {ToastService} from "../../shared/toast/service/toast.service";
import {ToastStatus} from "../../shared/toast/toast-status";
import {ToastApplicationComponent} from "../../shared/toast/toast-application.component";
import {LastDataUploadComponent} from "./last-data-upload/last-data-upload.component";

@Component({
  selector: 'app-admin-data-update',
  templateUrl: './admin-data-update.component.html',
  styleUrl: './admin-data-update.component.scss',
  standalone: true,
    imports: [
        ColComponent,
        RowComponent,
        SharedModule,
        DataUpdateLogTableComponent,
        DataProvisionComponent,
        ToastApplicationComponent,
        LastDataUploadComponent
    ]
})
export class AdminDataUpdateComponent implements OnInit {

  readonly dataUpdateService = inject(DataUpdateService);
  logs = this.dataUpdateService.logs;

  readonly toastService = inject(ToastService);

  ngOnInit(): void {
    this.dataUpdateService.loadDataLogs();
  }

  protected onDataUploaded($event: any) {
    this.dataUpdateService.uploadData($event).subscribe(
        () => {
          this.toastService.show('Data uploaded successfully', ToastStatus.Success);
          this.dataUpdateService.loadDataLogs();
        },
        (error) => {
          this.toastService.show('Failed to upload data', ToastStatus.Danger);
          this.dataUpdateService.loadDataLogs();
        }
    )
  }

  protected onDownloadFile($event: string) {
    this.dataUpdateService.downloadFile($event).subscribe(
        (content) => {
          const url = window.URL.createObjectURL(content);

          const a = document.createElement('a');
          a.href = url;
          a.download = `${$event}.json`;
          a.click();

          window.URL.revokeObjectURL(url);
        },
        (error) => {
          console.error('Error downloading file:', error);
        }
    )
  }
}
