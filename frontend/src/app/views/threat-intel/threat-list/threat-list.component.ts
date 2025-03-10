import { AfterViewInit, Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import {
    AlertComponent,
    BadgeComponent,
    ButtonDirective,
    CardBodyComponent,
    CardComponent,
    CardHeaderComponent,
    ListGroupDirective,
    ListGroupItemDirective,
    ModalBodyComponent,
    ModalComponent,
    ModalFooterComponent,
    ModalHeaderComponent,
    ModalTitleDirective,
    SpinnerComponent,
    TooltipDirective
} from "@coreui/angular";
import { IconDirective, IconSetService } from "@coreui/icons-angular";
import { NgForOf, NgIf, NgClass } from "@angular/common";
import {
    cilInfo,
    cilWarning,
    cilBell,
    cilCheckCircle,
    cilShieldAlt,
    cilBug,
    cilApps,
    cilExternalLink,
    cilCode,
    cilSpeedometer,
    cilUser,
    cilFolder,
    cilCheckAlt,
    cilTask,
    cilBan
} from '@coreui/icons';

interface Item {
    name: string;
    urgency: string;
    count: number;
    epss: number;
    pii: boolean;
    exploitAvailable: boolean;
    projects: Project[];
}

interface Project {
    name: string;
    href: string;
}

@Component({
    selector: 'app-threat-list',
    standalone: true,
    imports: [
        CardComponent,
        CardBodyComponent,
        BadgeComponent,
        ListGroupDirective,
        ListGroupItemDirective,
        CardHeaderComponent,
        IconDirective,
        ButtonDirective,
        NgIf,
        NgForOf,
        NgClass,
        ModalComponent,
        ModalHeaderComponent,
        ModalBodyComponent,
        ModalFooterComponent,
        ModalTitleDirective,
        SpinnerComponent,
        AlertComponent,
        TooltipDirective
    ],
    templateUrl: './threat-list.component.html',
    styleUrls: ['./threat-list.component.scss']
})
export class ThreatListComponent implements AfterViewInit, OnChanges, OnInit {
    @Input()
    items: Item[] = [];

    // Theme detection - integrate with your theme service if you have one
    @Input() theme: 'light' | 'dark' = 'dark';

    selectedItem: Item | null = null;
    modalVisible: boolean = false;

    constructor(private iconService: IconSetService) {
        // Register icons for use in the component
        this.iconService.icons = {
            cilInfo,
            cilWarning,
            cilBell,
            cilCheckCircle,
            cilShieldAlt,
            cilBug,
            cilApps,
            cilExternalLink,
            cilCode,
            cilSpeedometer,
            cilUser,
            cilFolder,
            cilCheckAlt,
            cilTask,
            cilBan
        };
    }

    ngOnInit(): void {
        this.detectTheme();
    }

    openModal(item: Item) {
        this.selectedItem = item;
        this.modalVisible = true;
    }

    closeModal() {
        this.modalVisible = false;
        this.selectedItem = null;
    }

    acknowledgeIssue() {
        // This would be implemented to handle issue acknowledgment
        // For now, we'll just close the modal
        this.closeModal();
    }

    getThreatDescription(threatName: string | undefined): string {
        if (!threatName) return '';

        // You can expand this with more specific descriptions for different threats
        if (threatName.includes('API Key')) {
            return 'This vulnerability exposes an API key in your code or configuration, potentially allowing unauthorized access to various services and sensitive operations.';
        }

        if (threatName.includes('SQL Injection')) {
            return 'SQL injection vulnerability detected that could allow attackers to execute arbitrary SQL commands on your database.';
        }

        if (threatName.includes('XSS')) {
            return 'Cross-site scripting vulnerability detected that could allow attackers to inject malicious scripts into web pages viewed by users.';
        }

        // Default fallback description
        return `Security vulnerability detected: ${threatName}. This issue requires your attention to mitigate potential security risks.`;
    }

    hasNoProjects(): boolean {
        if (!this.selectedItem) return true;
        if (!this.selectedItem.projects) return true;
        return this.selectedItem.projects.length === 0;
    }

    getEpssStatus(): string {
        if (this.selectedItem?.epss !== undefined && this.selectedItem.epss !== null) {
            return this.selectedItem.epss > 0.5 ? '✅' : '❌';
        }
        return '❌';
    }

    getExploitStatus(): string {
        if (this.selectedItem?.exploitAvailable !== undefined && this.selectedItem.exploitAvailable !== null) {
            return this.selectedItem.exploitAvailable ? '✅' : '❌';
        }
        return '❌';
    }

    ngAfterViewInit(): void {
        if (this.items) {
            this.sortItems();
        }
    }

    sortItems() {
        this.items.sort((a: Item, b: Item) => {
            const urgencyOrder: { [key: string]: number } = { 'urgent': 1, 'notable': 2 };

            // Get the urgency ranking; default to 3 if not 'urgent' or 'notable'
            const urgencyA = urgencyOrder[a.urgency] || 3;
            const urgencyB = urgencyOrder[b.urgency] || 3;

            // Compare urgency
            if (urgencyA !== urgencyB) {
                return urgencyA - urgencyB; // Lower urgency value comes first
            }

            // If urgency is the same, compare count (descending order)
            return b.count - a.count;
        });
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['items']) {
            const currentItems = changes['items'].currentValue;
            if (currentItems && currentItems.length > 0) {
                this.sortItems();
            }
        }

        // Update theme if changed
        if (changes['theme']) {
            this.updateThemeClass();
        }
    }

    /**
     * Detect current theme from CoreUI if possible,
     * otherwise use system preference
     */
    private detectTheme(): void {
        // You can integrate with your existing theme service here
        // This is a basic implementation that checks for dark mode preference

        // Check if CoreUI has a theme class on the body or html element
        const hasLightThemeClass = document.documentElement.classList.contains('light-theme') ||
            document.body.classList.contains('light-theme') ||
            document.documentElement.getAttribute('data-coreui-theme') === 'light';

        const hasDarkThemeClass = document.documentElement.classList.contains('dark-theme') ||
            document.body.classList.contains('dark-theme') ||
            document.documentElement.getAttribute('data-coreui-theme') === 'dark';

        if (hasLightThemeClass) {
            this.theme = 'light';
        } else if (hasDarkThemeClass) {
            this.theme = 'dark';
        } else {
            // Use system preference as fallback
            const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
            this.theme = prefersDarkMode ? 'dark' : 'light';
        }

        this.updateThemeClass();
    }

    /**
     * Apply the appropriate theme class to the root element
     */
    private updateThemeClass(): void {
        if (this.theme === 'light') {
            document.documentElement.classList.add('light-theme');
        } else {
            document.documentElement.classList.remove('light-theme');
        }
    }
}