import { Component, OnInit } from '@angular/core';
import {
    AlertComponent,
    CardBodyComponent,
    CardComponent,
    CardHeaderComponent,
    ColComponent,
    TooltipDirective
} from "@coreui/angular";
import { DatePipe, NgForOf, NgIf, NgClass } from "@angular/common";
import { IconDirective, IconSetService } from "@coreui/icons-angular";
import { ThreatIntelService } from "../../../service/ThreatIntelService";
import {
    brandSet,
    freeSet,
    cilTrash,
    cilNotes,
    cilCalendar,
    cilLink,
    cilReload,
    cilCheckAlt
} from "@coreui/icons";
import { RouterLink } from "@angular/router";

interface Vulnerability {
    name: string;
    repoId: number;
    repositoryUrl: string;
    dateDeleted?: Date;
    status?: string; // For reviewed vulnerabilities
}

@Component({
    selector: 'app-reviews',
    standalone: true,
    imports: [
        ColComponent,
        CardComponent,
        CardBodyComponent,
        CardHeaderComponent,
        NgForOf,
        DatePipe,
        NgIf,
        NgClass,
        AlertComponent,
        IconDirective,
        TooltipDirective,
        RouterLink
    ],
    templateUrl: './reviews.component.html',
    styleUrls: ['./reviews.component.scss']
})
export class ReviewsComponent implements OnInit {
    removedVulnerabilities: Vulnerability[] = [];
    reviewedVulnerabilities: Vulnerability[] = [];
    isLoading: boolean = false;

    constructor(
        public iconSet: IconSetService,
        private threatIntelService: ThreatIntelService
    ) {
        iconSet.icons = {
            ...freeSet,
            ...brandSet,
            cilTrash,
            cilNotes,
            cilCalendar,
            cilLink,
            cilReload,
            cilCheckAlt
        };
    }

    getStatusEmoji(status: string | undefined): string {
        switch (status) {
            case 'WONT_FIX':
                return '🚫'; // Prohibited sign
            case 'ACCEPTED':
                return '🔕'; // Bell with slash
            case 'FALSE_POSITIVE':
                return '❎'; // Cross mark button
            default:
                return '';
        }
    }

    getStatusClass(status: string | undefined): string {
        switch (status) {
            case 'WONT_FIX':
                return 'wont-fix';
            case 'ACCEPTED':
                return 'accepted';
            case 'FALSE_POSITIVE':
                return 'false-positive';
            default:
                return '';
        }
    }

    ngOnInit(): void {
        this.loadRemoved();
        this.loadSupressed();
    }

    loadRemoved() {
        this.isLoading = true;
        this.threatIntelService.getTopRemoved().subscribe({
            next: (response) => {
                this.removedVulnerabilities = response;
                this.isLoading = false;
            },
            error: () => {
                this.isLoading = false;
            }
        });
    }

    loadSupressed() {
        this.isLoading = true;
        this.threatIntelService.getTopReviewed().subscribe({
            next: (response) => {
                this.reviewedVulnerabilities = response;
                this.isLoading = false;
            },
            error: () => {
                this.isLoading = false;
            }
        });
    }
}