import {computed, inject, Injectable, signal} from '@angular/core';
import {CodeRepo} from "../../model/CodeRepo";
import {DashboardService} from "../DashboardService";

export interface CodeRepoTableFilters {
  exploitabilityStatus?: string;
}

@Injectable({
  providedIn: 'root'
})
export class CodeRepoTableService {

  private _codeRepos = signal<CodeRepo[]>([]);
  private _filters = signal<CodeRepoTableFilters>({});
  private _selectedRepos = signal<CodeRepo[]>([]);

  readonly codeRepos = this._codeRepos.asReadonly();
  readonly selectedRepos = this._selectedRepos.asReadonly();

  readonly filteredCodeRepos = computed(() => {
    const allCodeRepos = this._codeRepos();
    const filters = this._filters();

    return allCodeRepos.filter(repo => {
      if (filters.exploitabilityStatus) {
        if (repo.exploitability !== filters.exploitabilityStatus) {
          return false;
        }
      }
      return true;
    });
  })

  setCodeRepos(codeRepos: CodeRepo[]): void {
    this._codeRepos.set(codeRepos);
  }

  setSelectedRepos(repos: CodeRepo[]): void {
    this._selectedRepos.set(repos);
  }

  clearSelection(): void {
    this._selectedRepos.set([]);
  }

  updateFilters(filters: Partial<CodeRepoTableFilters>): void {
    this._filters.set({});
    this._filters.update(current => ({ ...current, ...filters }));
  }

  readonly dashboardService = inject(DashboardService);
  loadCodeRepos(): void {
    this.dashboardService.getRepos().subscribe({
      next: (response) => {
        this.setCodeRepos(response);
      },
      error: (error) => {
        // Handle error
        console.error('Error loading code repos:', error);
      }
    });
  }
}
