import { renderHook, act } from '@testing-library/react';
import useWorkflows from '../hooks/useWorkflows';

const STORAGE_KEY = 'audit_workflows';

beforeEach(() => {
  localStorage.clear();
  jest.clearAllMocks();
});

describe('useWorkflows hook', () => {
  test('initialises with empty workflows', () => {
    const { result } = renderHook(() => useWorkflows());
    expect(result.current.workflows).toEqual({});
    expect(result.current.activeWorkflow).toBeNull();
  });

  test('creates a new workflow', () => {
    const { result } = renderHook(() => useWorkflows());
    act(() => {
      result.current.createWorkflow('Cameron - Takeoff');
    });
    expect(result.current.workflows['Cameron - Takeoff']).toEqual([]);
    expect(result.current.activeWorkflow).toBe('Cameron - Takeoff');
  });

  test('does not create duplicate workflow', () => {
    const { result } = renderHook(() => useWorkflows());
    act(() => {
      result.current.createWorkflow('Test');
      result.current.createWorkflow('Test');
    });
    expect(Object.keys(result.current.workflows)).toHaveLength(1);
  });

  test('switches active workflow', () => {
    const { result } = renderHook(() => useWorkflows());
    act(() => {
      result.current.createWorkflow('WF1');
      result.current.createWorkflow('WF2');
      result.current.setActiveWorkflow('WF1');
    });
    expect(result.current.activeWorkflow).toBe('WF1');
  });

  test('adds a row with auto-incremented step', () => {
    const { result } = renderHook(() => useWorkflows());
    act(() => {
      result.current.createWorkflow('Test');
      result.current.addRow();
    });
    const rows = result.current.workflows['Test'];
    expect(rows).toHaveLength(1);
    expect(rows[0].step).toBe(1);
    expect(rows[0].action).toBe('');
    expect(rows[0].inputSource).toBe('');
    expect(rows[0].tool).toBe('');
    expect(rows[0].output).toBe('');
    expect(rows[0].notes).toBe('');
  });

  test('step increments for each new row', () => {
    const { result } = renderHook(() => useWorkflows());
    act(() => {
      result.current.createWorkflow('Test');
      result.current.addRow();
      result.current.addRow();
    });
    const rows = result.current.workflows['Test'];
    expect(rows[0].step).toBe(1);
    expect(rows[1].step).toBe(2);
  });

  test('updates a row field', () => {
    const { result } = renderHook(() => useWorkflows());
    act(() => {
      result.current.createWorkflow('Test');
      result.current.addRow();
    });
    const rowId = result.current.workflows['Test'][0].id;
    act(() => {
      result.current.updateRow(rowId, 'action', 'Review document');
    });
    expect(result.current.workflows['Test'][0].action).toBe('Review document');
  });

  test('deletes a row', () => {
    const { result } = renderHook(() => useWorkflows());
    act(() => {
      result.current.createWorkflow('Test');
      result.current.addRow();
      result.current.addRow();
    });
    const rowId = result.current.workflows['Test'][0].id;
    act(() => {
      result.current.deleteRow(rowId);
    });
    expect(result.current.workflows['Test']).toHaveLength(1);
  });

  test('persists to localStorage on change', () => {
    const { result } = renderHook(() => useWorkflows());
    act(() => {
      result.current.createWorkflow('Test');
    });
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY));
    expect(stored.workflows).toHaveProperty('Test');
  });

  test('loads from localStorage on init', () => {
    const saved = {
      workflows: { 'Existing': [{ id: '1', step: 1, action: 'A', inputSource: '', tool: '', output: '', notes: '' }] },
      activeWorkflow: 'Existing',
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(saved));
    const { result } = renderHook(() => useWorkflows());
    expect(result.current.workflows['Existing']).toHaveLength(1);
    expect(result.current.activeWorkflow).toBe('Existing');
  });
});
