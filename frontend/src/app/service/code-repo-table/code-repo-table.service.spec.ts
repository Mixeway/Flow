import {TestBed} from '@angular/core/testing';
import {CodeRepoTableService} from './code-repo-table.service';
import {DashboardService} from '../DashboardService';
import {of, throwError} from 'rxjs';
import {CodeRepo} from '../../model/CodeRepo';

describe('CodeRepoTableService', () => {
  let service: CodeRepoTableService;
  let dashboardServiceSpy: jasmine.SpyObj<DashboardService>;

  const mockCodeRepos: CodeRepo[] = [
    {
      id: 1,
      target: 'repo1',
      team: 'TeamA',
      exploitability: 'HIGH',
      sast: 'SUCCESS',
      sca: 'WARNING',
      iac: 'SUCCESS',
      secrets: 'SUCCESS',
      dast: 'NOT_PERFORMED',
      gitlab: 'SUCCESS'
    } as CodeRepo,
    {
      id: 2,
      target: 'repo2',
      team: 'TeamB',
      exploitability: 'LOW',
      sast: 'DANGER',
      sca: 'SUCCESS',
      iac: 'SUCCESS',
      secrets: 'SUCCESS',
      dast: 'SUCCESS',
      gitlab: 'SUCCESS'
    } as CodeRepo,
    {
      id: 3,
      target: 'repo3',
      team: 'TeamA',
      exploitability: 'MEDIUM',
      sast: 'SUCCESS',
      sca: 'SUCCESS',
      iac: 'WARNING',
      secrets: 'SUCCESS',
      dast: 'SUCCESS',
      gitlab: 'SUCCESS'
    } as CodeRepo
  ];

  beforeEach(() => {
    const dashboardSpy = jasmine.createSpyObj('DashboardService', ['getRepos']);

    TestBed.configureTestingModule({
      providers: [
        CodeRepoTableService,
        { provide: DashboardService, useValue: dashboardSpy }
      ]
    });

    service = TestBed.inject(CodeRepoTableService);
    dashboardServiceSpy = TestBed.inject(DashboardService) as jasmine.SpyObj<DashboardService>;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('Initial State', () => {
    it('should initialize with empty code repos', () => {
      expect(service.codeRepos()).toEqual([]);
    });

    it('should initialize with empty selected repos', () => {
      expect(service.selectedRepos()).toEqual([]);
    });

    it('should initialize with empty filters', () => {
      expect(service.filteredCodeRepos()).toEqual([]);
    });
  });

  describe('setCodeRepos', () => {
    it('should set code repos correctly', () => {
      service.setCodeRepos(mockCodeRepos);
      expect(service.codeRepos()).toEqual(mockCodeRepos);
    });

    it('should update filteredCodeRepos when repos are set', () => {
      service.setCodeRepos(mockCodeRepos);
      expect(service.filteredCodeRepos().length).toBe(3);
    });

    it('should handle empty array', () => {
      service.setCodeRepos([]);
      expect(service.codeRepos()).toEqual([]);
      expect(service.filteredCodeRepos()).toEqual([]);
    });

    it('should replace existing repos', () => {
      service.setCodeRepos(mockCodeRepos);
      const newRepos = [mockCodeRepos[0]];
      service.setCodeRepos(newRepos);
      expect(service.codeRepos()).toEqual(newRepos);
    });
  });

  describe('setSelectedRepos', () => {
    it('should set selected repos correctly', () => {
      const selectedRepos = [mockCodeRepos[0], mockCodeRepos[1]];
      service.setSelectedRepos(selectedRepos);
      expect(service.selectedRepos()).toEqual(selectedRepos);
    });

    it('should handle empty selection', () => {
      service.setSelectedRepos([]);
      expect(service.selectedRepos()).toEqual([]);
    });

    it('should handle single selection', () => {
      service.setSelectedRepos([mockCodeRepos[0]]);
      expect(service.selectedRepos().length).toBe(1);
      expect(service.selectedRepos()[0]).toEqual(mockCodeRepos[0]);
    });

    it('should replace existing selection', () => {
      service.setSelectedRepos([mockCodeRepos[0]]);
      service.setSelectedRepos([mockCodeRepos[1], mockCodeRepos[2]]);
      expect(service.selectedRepos().length).toBe(2);
      expect(service.selectedRepos()).toEqual([mockCodeRepos[1], mockCodeRepos[2]]);
    });
  });

  describe('clearSelection', () => {
    it('should clear selected repos', () => {
      service.setSelectedRepos([mockCodeRepos[0], mockCodeRepos[1]]);
      service.clearSelection();
      expect(service.selectedRepos()).toEqual([]);
    });

    it('should handle clearing empty selection', () => {
      service.clearSelection();
      expect(service.selectedRepos()).toEqual([]);
    });

    it('should not affect code repos when clearing selection', () => {
      service.setCodeRepos(mockCodeRepos);
      service.setSelectedRepos([mockCodeRepos[0]]);
      service.clearSelection();
      expect(service.codeRepos()).toEqual(mockCodeRepos);
    });
  });

  describe('updateFilters', () => {
    beforeEach(() => {
      service.setCodeRepos(mockCodeRepos);
    });

    it('should filter by exploitability status', () => {
      service.updateFilters({ exploitabilityStatus: 'HIGH' });
      const filtered = service.filteredCodeRepos();
      expect(filtered.length).toBe(1);
      expect(filtered[0].exploitability).toBe('HIGH');
    });

    it('should return all repos when no filter is applied', () => {
      service.updateFilters({});
      expect(service.filteredCodeRepos().length).toBe(3);
    });

    it('should handle filter with no matching repos', () => {
      service.updateFilters({ exploitabilityStatus: 'CRITICAL' });
      expect(service.filteredCodeRepos().length).toBe(0);
    });

    it('should update filters when called multiple times', () => {
      service.updateFilters({ exploitabilityStatus: 'HIGH' });
      expect(service.filteredCodeRepos().length).toBe(1);

      service.updateFilters({ exploitabilityStatus: 'LOW' });
      expect(service.filteredCodeRepos().length).toBe(1);
      expect(service.filteredCodeRepos()[0].exploitability).toBe('LOW');
    });

    it('should clear previous filters when updating', () => {
      service.updateFilters({ exploitabilityStatus: 'HIGH' });
      expect(service.filteredCodeRepos().length).toBe(1);

      service.updateFilters({});
      expect(service.filteredCodeRepos().length).toBe(3);
    });

    it('should filter multiple repos with same exploitability', () => {
      const reposWithSameExploitability = [
        { ...mockCodeRepos[0], exploitability: 'HIGH' },
        { ...mockCodeRepos[1], exploitability: 'HIGH' },
        { ...mockCodeRepos[2], exploitability: 'LOW' }
      ] as CodeRepo[];

      service.setCodeRepos(reposWithSameExploitability);
      service.updateFilters({ exploitabilityStatus: 'HIGH' });
      expect(service.filteredCodeRepos().length).toBe(2);
    });
  });

  describe('filteredCodeRepos computed signal', () => {
    it('should react to changes in code repos', () => {
      service.setCodeRepos(mockCodeRepos);
      expect(service.filteredCodeRepos().length).toBe(3);

      service.setCodeRepos([mockCodeRepos[0]]);
      expect(service.filteredCodeRepos().length).toBe(1);
    });

    it('should react to changes in filters', () => {
      service.setCodeRepos(mockCodeRepos);
      expect(service.filteredCodeRepos().length).toBe(3);

      service.updateFilters({ exploitabilityStatus: 'HIGH' });
      expect(service.filteredCodeRepos().length).toBe(1);
    });

    it('should combine repos and filters correctly', () => {
      service.setCodeRepos(mockCodeRepos);
      service.updateFilters({ exploitabilityStatus: 'MEDIUM' });
      const filtered = service.filteredCodeRepos();

      expect(filtered.length).toBe(1);
      expect(filtered[0].id).toBe(3);
      expect(filtered[0].exploitability).toBe('MEDIUM');
    });
  });

  describe('loadCodeRepos', () => {
    it('should load code repos successfully', () => {
      dashboardServiceSpy.getRepos.and.returnValue(of(mockCodeRepos));

      service.loadCodeRepos();

      expect(dashboardServiceSpy.getRepos).toHaveBeenCalled();
      expect(service.codeRepos()).toEqual(mockCodeRepos);
    });

    it('should handle error when loading repos fails', () => {
      const consoleErrorSpy = spyOn(console, 'error');
      const error = new Error('Failed to load repos');
      dashboardServiceSpy.getRepos.and.returnValue(throwError(() => error));

      service.loadCodeRepos();

      expect(dashboardServiceSpy.getRepos).toHaveBeenCalled();
      expect(consoleErrorSpy).toHaveBeenCalledWith('Error loading code repos:', error);
    });

    it('should not modify selected repos when loading new repos', () => {
      dashboardServiceSpy.getRepos.and.returnValue(of(mockCodeRepos));
      service.setSelectedRepos([mockCodeRepos[0]]);

      service.loadCodeRepos();

      expect(service.selectedRepos().length).toBe(1);
    });

    it('should update filtered repos after loading', () => {
      dashboardServiceSpy.getRepos.and.returnValue(of(mockCodeRepos));
      service.updateFilters({ exploitabilityStatus: 'HIGH' });

      service.loadCodeRepos();

      expect(service.filteredCodeRepos().length).toBe(1);
      expect(service.filteredCodeRepos()[0].exploitability).toBe('HIGH');
    });

    it('should handle empty response from service', () => {
      dashboardServiceSpy.getRepos.and.returnValue(of([]));

      service.loadCodeRepos();

      expect(service.codeRepos()).toEqual([]);
      expect(service.filteredCodeRepos()).toEqual([]);
    });
  });

  describe('Integration scenarios', () => {
    it('should handle complete workflow: load, filter, select, clear', () => {
      dashboardServiceSpy.getRepos.and.returnValue(of(mockCodeRepos));

      // Load repos
      service.loadCodeRepos();
      expect(service.codeRepos().length).toBe(3);

      // Apply filter
      service.updateFilters({ exploitabilityStatus: 'HIGH' });
      expect(service.filteredCodeRepos().length).toBe(1);

      // Select repo
      service.setSelectedRepos([service.filteredCodeRepos()[0]]);
      expect(service.selectedRepos().length).toBe(1);

      // Clear selection
      service.clearSelection();
      expect(service.selectedRepos().length).toBe(0);

      // Repos and filter should remain
      expect(service.codeRepos().length).toBe(3);
      expect(service.filteredCodeRepos().length).toBe(1);
    });

    it('should handle selecting repos that are then filtered out', () => {
      service.setCodeRepos(mockCodeRepos);
      service.setSelectedRepos([mockCodeRepos[0], mockCodeRepos[1]]);

      // Filter should not affect selection
      service.updateFilters({ exploitabilityStatus: 'HIGH' });
      expect(service.selectedRepos().length).toBe(2);
      expect(service.filteredCodeRepos().length).toBe(1);
    });

    it('should maintain state after multiple operations', () => {
      service.setCodeRepos(mockCodeRepos);
      service.updateFilters({ exploitabilityStatus: 'HIGH' });
      service.setSelectedRepos([mockCodeRepos[0]]);

      // Change filter
      service.updateFilters({ exploitabilityStatus: 'LOW' });
      expect(service.filteredCodeRepos().length).toBe(1);

      // Selection should remain
      expect(service.selectedRepos().length).toBe(1);

      // Original repos should remain
      expect(service.codeRepos().length).toBe(3);
    });
  });

  describe('Edge cases', () => {
    it('should handle undefined exploitability in filter', () => {
      const reposWithUndefined = [
        { ...mockCodeRepos[0], exploitability: undefined } as any,
        mockCodeRepos[1]
      ];

      service.setCodeRepos(reposWithUndefined);
      service.updateFilters({ exploitabilityStatus: 'HIGH' });

      expect(service.filteredCodeRepos().length).toBe(0);
    });

    it('should handle null values in repos array', () => {
      service.setCodeRepos([mockCodeRepos[0], null as any, mockCodeRepos[2]]);
      expect(() => service.filteredCodeRepos()).not.toThrow();
    });

    it('should handle concurrent filter updates', () => {
      service.setCodeRepos(mockCodeRepos);

      service.updateFilters({ exploitabilityStatus: 'HIGH' });
      service.updateFilters({ exploitabilityStatus: 'LOW' });
      service.updateFilters({ exploitabilityStatus: 'MEDIUM' });

      const filtered = service.filteredCodeRepos();
      expect(filtered.length).toBe(1);
      expect(filtered[0].exploitability).toBe('MEDIUM');
    });
  });
});