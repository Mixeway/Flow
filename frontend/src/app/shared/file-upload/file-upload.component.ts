import {Component, EventEmitter, Output} from '@angular/core';
import {CommonModule} from '@angular/common';

@Component({
  selector: 'app-file-upload',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.scss']
})
export class FileUploadComponent {
  @Output() fileSelected = new EventEmitter<File>();

  isDragging = false;
  selectedFile: File | null = null;
  errorMessage: string | null = null;

  setError(message: string): void {
    this.errorMessage = message;
    this.selectedFile = null;
  }

  clearError(): void {
    this.errorMessage = null;
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = true;
  }

  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = false;
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = false;

    const files = event.dataTransfer?.files;
    if (files && files.length > 0) {
      this.handleFile(files[0]);
    }
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.handleFile(input.files[0]);
    }
  }

  private handleFile(file: File): void {
    this.errorMessage = null;

    if (!file.name.toLowerCase().endsWith('.json')) {
      this.errorMessage = 'Please select a JSON file (.json)';
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        JSON.parse(content);
        this.selectedFile = file;
        this.fileSelected.emit(file);
      } catch (error) {
        this.errorMessage = 'Invalid JSON format. Please check your file and try again.';
        this.selectedFile = null;
      }
    };
    reader.onerror = () => {
      this.errorMessage = 'Error reading file. Please try again.';
      this.selectedFile = null;
    };
    reader.readAsText(file);
  }

  clearFile(): void {
    this.selectedFile = null;
    this.errorMessage = null;
  }
}
