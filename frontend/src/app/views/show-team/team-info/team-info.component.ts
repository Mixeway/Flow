import { Component, Input, OnInit, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import {
  BadgeComponent,
  ButtonDirective,
  CardComponent,
  CardBodyComponent,
  CardFooterComponent,
  CardHeaderComponent,
  ColComponent,
  ContainerComponent,
  RowComponent,
} from '@coreui/angular';
import { IconDirective } from '@coreui/icons-angular';
import { NgFor, NgIf, NgClass, DatePipe } from '@angular/common';
import { ChartData } from 'chart.js/dist/types';

@Component({
  selector: 'app-team-info',
  standalone: true,
  imports: [
    RowComponent,
    ColComponent,
    CardComponent,
    CardBodyComponent,
    CardFooterComponent,
    CardHeaderComponent,
    ButtonDirective,
    IconDirective,
    NgIf,
    NgFor,
    NgClass,
    ContainerComponent,
    DatePipe,
    BadgeComponent
  ],
  templateUrl: './team-info.component.html',
  styleUrls: ['./team-info.component.scss']
})
export class TeamInfoComponent implements OnInit, AfterViewInit {
  @Input() teamData: any;
  @Input() reposData: any[] = [];
  @Input() cloudSubscriptionsData: any[] = [];
  @Input() chartPieData?: ChartData;

  @ViewChild('chartCanvas') chartCanvas!: ElementRef;

  lastScanDate: Date = new Date();
  totalVulnerabilities: number = 0;
  hoveredSlice: number = -1;

  ngOnInit(): void {
    if (!this.chartPieData) {
      this.renderChart();
    }
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.renderChart();
      this.setupEventListeners();
    }, 100);
  }

  setupEventListeners(): void {
    if (!this.chartCanvas) return;

    const canvas = this.chartCanvas.nativeElement;

    // Mouse move event for hover detection
    canvas.addEventListener('mousemove', (event: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;

      this.checkHover(x, y);
    });

    // Mouse leave event to clear hover state
    canvas.addEventListener('mouseleave', () => {
      if (this.hoveredSlice !== -1) {
        this.hoveredSlice = -1;
        this.renderChart();
      }
    });
  }

  checkHover(x: number, y: number): void {
    if (!this.chartPieData) return;

    const canvas = this.chartCanvas.nativeElement;
    const width = canvas.width;
    const height = canvas.height;
    const centerX = width / 2;
    const centerY = height / 2;

    // Calculate distance from center
    const distanceFromCenter = Math.sqrt(Math.pow(x - centerX, 2) + Math.pow(y - centerY, 2));

    // Radius of donut chart
    const radius = Math.min(width, height) / 2 - 10;
    const innerRadius = radius * 0.5; // Increased inner radius for bigger donut

    // Check if point is within donut radius
    if (distanceFromCenter > innerRadius && distanceFromCenter < radius) {
      // Calculate angle
      const angle = Math.atan2(y - centerY, x - centerX);
      let targetAngle = angle;
      if (targetAngle < 0) targetAngle += 2 * Math.PI; // Convert to 0-2π range

      // Find which slice contains this angle
      const data = this.chartPieData.datasets[0].data as number[];
      const total = data.reduce((sum, value) => sum + value, 0);

      let currentAngle = 0;
      for (let i = 0; i < data.length; i++) {
        const sliceAngle = (data[i] / total) * 2 * Math.PI;

        if (targetAngle >= currentAngle && targetAngle < currentAngle + sliceAngle) {
          if (this.hoveredSlice !== i) {
            this.hoveredSlice = i;
            this.renderChart();
          }
          return;
        }

        currentAngle += sliceAngle;
      }
    } else {
      if (this.hoveredSlice !== -1) {
        this.hoveredSlice = -1;
        this.renderChart();
      }
    }
  }

  renderChart(): void {
    if (!this.chartCanvas || !this.chartPieData) return;

    const canvas = this.chartCanvas.nativeElement;
    const ctx = canvas.getContext('2d');

    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Set chart dimensions
    const width = canvas.width;
    const height = canvas.height;
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(width, height) / 2 - 15;  // Slightly smaller to fit everything
    const innerRadius = radius * 0.5; // Increased inner radius for bigger donut

    // Calculate total for percentages
    const data = this.chartPieData.datasets[0].data as number[];
    const total = data.reduce((sum, value) => sum + value, 0);
    this.totalVulnerabilities = total;

    // Draw pie slices
    let startAngle = 0;
    data.forEach((value, index) => {
      if (value <= 0) return;

      const sliceAngle = (value / total) * 2 * Math.PI;
      const endAngle = startAngle + sliceAngle;

      // Draw slice
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.arc(centerX, centerY, radius, startAngle, endAngle);
      ctx.closePath();

      // Fill slice - handle different types of backgroundColor
      const colors = this.chartPieData?.datasets[0].backgroundColor;
      let color = '#cccccc'; // Default color

      if (colors) {
        if (Array.isArray(colors)) {
          color = colors[index]?.toString() || color;
        } else if (typeof colors === 'string') {
          color = colors;
        }
      }

      // Apply hover effect if this slice is hovered
      if (index === this.hoveredSlice) {
        ctx.fillStyle = this.lightenColor(color, 15);
        // Slightly larger hovered slice
        ctx.save();
        const midAngle = startAngle + (endAngle - startAngle) / 2;
        const offsetX = Math.cos(midAngle) * 5;
        const offsetY = Math.sin(midAngle) * 5;
        ctx.translate(offsetX, offsetY);
      } else {
        ctx.fillStyle = color;
      }

      ctx.fill();

      if (index === this.hoveredSlice) {
        ctx.restore();
      }

      // Draw inner circle for donut hole
      ctx.beginPath();
      ctx.moveTo(centerX + innerRadius * Math.cos(startAngle), centerY + innerRadius * Math.sin(startAngle));
      ctx.arc(centerX, centerY, innerRadius, startAngle, endAngle);
      ctx.lineTo(centerX, centerY);
      ctx.closePath();

      // Make the center transparent by clearing the inner circle
      ctx.globalCompositeOperation = 'destination-out';
      ctx.fill();
      ctx.globalCompositeOperation = 'source-over';

      // Add label to the slice
      // @ts-ignore
      if (this.chartPieData.labels && index < this.chartPieData.labels.length) {
        // Calculate position for the text (middle of the slice)
        const midAngle = startAngle + (endAngle - startAngle) / 2;
        const labelRadius = (radius + innerRadius) / 2;
        const labelX = centerX + labelRadius * Math.cos(midAngle);
        const labelY = centerY + labelRadius * Math.sin(midAngle);

        const label = this.getLabelText(index);
        const percentage = this.getPercentage(value);

        // Adjust font size based on slice size
        const fontSize = Math.max(10, Math.min(16, sliceAngle * radius / 6));

        // Set text properties
        ctx.font = `bold ${fontSize}px Arial`;
        ctx.fillStyle = 'white';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        // Draw the label text
        ctx.fillText(label, labelX, labelY - fontSize/2);
        ctx.font = `${fontSize * 0.9}px Arial`;
        ctx.fillText(percentage, labelX, labelY + fontSize/2);
      }

      // Draw tooltip for hovered slice
      if (index === this.hoveredSlice) {
        this.drawTooltip(ctx, centerX, centerY, index);
      }

      startAngle = endAngle;
    });
  }

  drawTooltip(ctx: CanvasRenderingContext2D, centerX: number, centerY: number, index: number): void {
    if (!this.chartPieData) return;

    const label = this.getLabelText(index);
    const data = this.chartPieData.datasets[0].data as number[];
    const value = data[index];
    const percentage = this.getPercentage(value);

    const tooltipText = `${label}: ${value} (${percentage})`;

    // Tooltip box settings
    const padding = 10;
    const fontSize = 14;
    ctx.font = `${fontSize}px Arial`;
    const textWidth = ctx.measureText(tooltipText).width;
    const boxWidth = textWidth + padding * 2;
    const boxHeight = fontSize + padding * 2;

    // Position the tooltip near the top of the chart
    const tooltipX = centerX - boxWidth / 2;
    const tooltipY = centerY - 100;

    // Draw tooltip background
    ctx.fillStyle = 'rgba(0,0,0,0.8)';
    ctx.beginPath();
    ctx.roundRect(tooltipX, tooltipY, boxWidth, boxHeight, 5);
    ctx.fill();

    // Draw tooltip text
    ctx.fillStyle = 'white';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(tooltipText, centerX, tooltipY + boxHeight / 2);
  }

  lightenColor(color: string, percent: number): string {
    // Convert to RGB
    let r, g, b;
    if (color.startsWith('#')) {
      const hex = color.slice(1);
      r = parseInt(hex.substring(0, 2), 16);
      g = parseInt(hex.substring(2, 4), 16);
      b = parseInt(hex.substring(4, 6), 16);
    } else if (color.startsWith('rgb')) {
      const match = color.match(/(\d+),\s*(\d+),\s*(\d+)/);
      if (!match) return color;
      r = parseInt(match[1]);
      g = parseInt(match[2]);
      b = parseInt(match[3]);
    } else {
      return color;
    }

    // Lighten
    r = Math.min(255, r + percent);
    g = Math.min(255, g + percent);
    b = Math.min(255, b + percent);

    return `rgb(${r}, ${g}, ${b})`;
  }

  getPercentage(value: any): string {
    if (!this.chartPieData || !value) return '0%';

    const data = this.chartPieData.datasets[0].data as number[];
    const total = data.reduce((sum, val) => sum + val, 0);
    if (total === 0) return '0%';

    const numValue = Number(value) || 0;
    return ((numValue / total) * 100).toFixed(0) + '%';
  }

  getBackgroundColor(index: number): string {
    if (!this.chartPieData || !this.chartPieData.datasets[0].backgroundColor) {
      return '#cccccc';
    }

    const colors = this.chartPieData.datasets[0].backgroundColor;
    if (Array.isArray(colors)) {
      return colors[index]?.toString() || '#cccccc';
    } else if (typeof colors === 'string') {
      return colors;
    }

    return '#cccccc';
  }

  getLabelText(index: number): string {
    if (!this.chartPieData || !this.chartPieData.labels) {
      return 'Unknown';
    }

    const labels = this.chartPieData.labels;
    if (Array.isArray(labels)) {
      return labels[index]?.toString() || 'Unknown';
    }

    return 'Unknown';
  }
}