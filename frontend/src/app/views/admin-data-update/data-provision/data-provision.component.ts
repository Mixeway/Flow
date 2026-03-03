import {Component, EventEmitter, Output, ViewChild} from '@angular/core';
import {FileUploadComponent} from "../../../shared/file-upload/file-upload.component";
import {ButtonDirective, ColComponent, RowComponent} from "@coreui/angular";
import {IconDirective} from "@coreui/icons-angular";

@Component({
  selector: 'app-data-provision',
  standalone: true,
  imports: [
    FileUploadComponent,
    ButtonDirective,
    IconDirective,
    ColComponent,
    RowComponent
  ],
  templateUrl: './data-provision.component.html',
  styleUrl: './data-provision.component.scss'
})
export class DataProvisionComponent {

  @ViewChild(FileUploadComponent) fileUploadComponent!: FileUploadComponent;
  protected canUpload = false;
  private data: any = {};

  @Output() dataUploaded = new EventEmitter<any>();

  protected onFileUploaded(file: File) {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const jsonData = JSON.parse(content);

        const validationError = this.validateJsonContent(jsonData);
        if (validationError) {
          this.fileUploadComponent.setError(validationError);
          return;
        }

        this.fileUploadComponent.clearError();
        this.canUpload = true;
        this.data = jsonData;

      } catch (error) {
        this.fileUploadComponent.setError('Error processing file content');
        this.canUpload = false;
      }
    };
    reader.onerror = () => {
      this.fileUploadComponent.setError('Error reading file');
      this.canUpload = false;
    };
    reader.readAsText(file);
  }

  private validateJsonContent(data: any): string | null {
    if (typeof data !== 'object' || data === null || Array.isArray(data)) {
      return 'JSON must be an object with CVE IDs as keys';
    }

    const requiredFields = [
      'attack_complexity',
      'attack_vector',
      'availability_impact',
      'base_score',
      'base_severity',
      'confidentiality_impact',
      'constraints',
      'description',
      'epss',
      'epss_percentile',
      'exploit_exists',
      'exploitability_score',
      'id',
      'impact_score',
      'inserted_date',
      'integrity_impact',
      'metric_version',
      'name',
      'nist_last_modified_date',
      'packages',
      'privileges_required',
      'published_date',
      'recommendation',
      'ref',
      'scope',
      'severity',
      'updated_date',
      'user_interaction',
      'vector',
      'weaknesses'
    ];

    const cveIds = Object.keys(data);

    if (cveIds.length === 0) {
      return 'JSON object must contain at least one CVE entry';
    }

    for (const cveId of cveIds) {
      const cveData = data[cveId];

      if (typeof cveData !== 'object' || cveData === null) {
        return `CVE entry "${cveId}" must be an object`;
      }

      for (const field of requiredFields) {
        if (!(field in cveData)) {
          return `CVE entry "${cveId}" is missing required field: "${field}"`;
        }
      }

      // Validate specific field types
      if (cveData.constraints !== null && !Array.isArray(cveData.constraints)) {
        return `CVE entry "${cveId}": field "constraints" must be an array or null`;
      }

      if (cveData.packages !== null && !Array.isArray(cveData.packages)) {
        return `CVE entry "${cveId}": field "packages" must be an array or null`;
      }

      if (cveData.base_score !== null && typeof cveData.base_score !== 'number') {
        return `CVE entry "${cveId}": field "base_score" must be a number or null`;
      }

      if (cveData.epss !== null && typeof cveData.epss !== 'number') {
        return `CVE entry "${cveId}": field "epss" must be a number or null`;
      }

      if (cveData.epss_percentile !== null && typeof cveData.epss_percentile !== 'number') {
        return `CVE entry "${cveId}": field "epss_percentile" must be a number or null`;
      }

      if (cveData.exploit_exists !== null && typeof cveData.exploit_exists !== 'boolean') {
        return `CVE entry "${cveId}": field "exploit_exists" must be a boolean or null`;
      }

      if (cveData.exploitability_score !== null && typeof cveData.exploitability_score !== 'number') {
        return `CVE entry "${cveId}": field "exploitability_score" must be a number or null`;
      }

      if (cveData.impact_score !== null && typeof cveData.impact_score !== 'number') {
        return `CVE entry "${cveId}": field "impact_score" must be a number or null`;
      }
    }

    return null;
  }

  protected uploadFile() {
    if (this.canUpload) {
      this.dataUploaded.emit(this.data);
    }
  }
}
