import {Component, OnInit} from '@angular/core';
import {AlertComponent, CardBodyComponent, CardComponent, CardHeaderComponent, ColComponent} from "@coreui/angular";
import {DatePipe, NgForOf, NgIf} from "@angular/common";
import {IconSetService} from "@coreui/icons-angular";
import {ThreatIntelService} from "../../../service/ThreatIntelService";
import {brandSet, freeSet} from "@coreui/icons";

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
        AlertComponent
    ],
  templateUrl: './reviews.component.html',
  styleUrl: './reviews.component.scss'
})
export class ReviewsComponent implements OnInit{
    removedVulnerabilities: Vulnerability[] = [];
    reviewedVulnerabilities: Vulnerability[] = [];

    constructor(public iconSet: IconSetService, private threatIntelService: ThreatIntelService) {
        iconSet.icons = { ...freeSet, ...iconSet, ...brandSet }

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

    ngOnInit(): void {
        this.loadRemoved();
        this.loadSupressed();
    }


    private loadRemoved() {
        this.threatIntelService.getTopRemoved().subscribe({
            next: (response) => {
                this.removedVulnerabilities = response;
            }
        });

    }

    private loadSupressed() {
        this.threatIntelService.getTopReviewed().subscribe({
            next: (response) => {
                this.reviewedVulnerabilities = response;
            }
        });
    }

}
