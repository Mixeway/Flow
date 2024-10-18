import {AfterViewInit, Component, Input} from '@angular/core';
import {
    BadgeComponent, ButtonDirective,
    CardBodyComponent,
    CardComponent, CardHeaderComponent,
    ListGroupDirective,
    ListGroupItemDirective, ModalBodyComponent, ModalComponent, ModalFooterComponent, ModalHeaderComponent
} from "@coreui/angular";
import {IconComponent} from "@coreui/icons-angular";
import {NgForOf, NgIf} from "@angular/common";

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
        IconComponent,
        ButtonDirective,
        NgIf,
        NgForOf,
        ModalComponent,
        ModalHeaderComponent,
        ModalBodyComponent,
        ModalFooterComponent
    ],
  templateUrl: './threat-list.component.html',
  styleUrl: './threat-list.component.scss'
})
export class ThreatListComponent implements AfterViewInit{
    @Input()
    items: Item[] = [];

    selectedItem: Item | null = null;
    modalVisible: boolean = false;

    openModal(item: Item) {
        this.selectedItem = item;
        this.modalVisible = true;
    }

    closeModal() {
        this.modalVisible = false;
        this.selectedItem = null;
    }
    getEpssStatus(): string {
        if (this.selectedItem?.epss !== undefined && this.selectedItem.epss !== null) {
            return this.selectedItem.epss > 0.5 ? '✅' : '❌';
        }
        return '❌';
    }

    getPiiStatus(): string {
        if (this.selectedItem?.pii !== undefined && this.selectedItem.pii !== null) {
            return this.selectedItem.pii ? '✅' : '❌';
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
        this.sortItems();
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


}
