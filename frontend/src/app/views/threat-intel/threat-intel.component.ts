import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {ButtonDirective, ColComponent, RowComponent, SpinnerComponent} from "@coreui/angular";
import {ThreatScoreComponent} from "./threat-score/threat-score.component";
import {InfosComponent} from "./infos/infos.component";
import {ThreatListComponent} from "./threat-list/threat-list.component";
import {ReviewsComponent} from "./reviews/reviews.component";
import {WaiversComponent} from "./waivers/waivers.component";
import {IconSetService} from "@coreui/icons-angular";
import {RepoService} from "../../service/RepoService";
import {AuthService} from "../../service/AuthService";
import {ActivatedRoute, Router} from "@angular/router";
import {DatePipe, JsonPipe, NgIf} from "@angular/common";
import {brandSet, freeSet} from "@coreui/icons";
import {ThreatIntelService} from "../../service/ThreatIntelService";

@Component({
  selector: 'app-threat-intel',
  standalone: true,
    imports: [
        ColComponent,
        RowComponent,
        ThreatScoreComponent,
        InfosComponent,
        ThreatListComponent,
        ReviewsComponent,
        WaiversComponent,
        NgIf,
        ButtonDirective,
        SpinnerComponent,
        JsonPipe
    ],
  templateUrl: './threat-intel.component.html',
  styleUrl: './threat-intel.component.scss'
})
export class ThreatIntelComponent implements OnInit{
    findings: any;
    teams: number = 0;
    allProjects: number = 0;
    affectedProjects: number = 0 ;
    openedVulns: number = 0 ;
    threatScore: string = '';

    constructor(public iconSet: IconSetService, private threatIntelService: ThreatIntelService,
                private authService: AuthService, private router: Router, private route: ActivatedRoute,
                private cdr: ChangeDetectorRef) {
        iconSet.icons = { ...freeSet, ...iconSet, ...brandSet }

    }

    ngOnInit(): void {
        // @ts-ignore
        this.userRole = localStorage.getItem('userRole');
        this.cdr.detectChanges();

        this.authService.hc().subscribe({
            next: () => {
                // Health check passed, proceed with loading the dashboard
            },
            error: () => {
                // Health check failed, redirect to login
                this.router.navigate(['/login']);
            }
        });
        this.loadFindings();
    }

    private loadFindings() {
        this.threatIntelService.getThreats().subscribe({
            next: (response) => {
                this.findings = response.items;
                this.teams = response.numberOfTeams;
                this.allProjects = response.numberOfAllProjects;
                this.affectedProjects = response.numberOfUniqueProjects;
                this.openedVulns = response.openedVulnerabilities;
                this.calculatePercentage()
            }
        });
        this.cdr.detectChanges();

    }
    calculatePercentage() {

        const allProjects = this.allProjects ?? 0;
        const affectedProjects = this.affectedProjects ?? 0;

        if (allProjects > 0) {
            this.threatScore = ((affectedProjects / allProjects) * 100).toFixed(0);
        } else {
            this.threatScore = '0';
        }
        this.cdr.detectChanges();

    }
}
