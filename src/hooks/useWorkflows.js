import { useState, useEffect } from 'react';

const STORAGE_KEY = 'audit_workflows';

function loadFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    // ignore
  }
  return { workflows: {}, activeWorkflow: null };
}

function saveToStorage(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    // ignore
  }
}

export default function useWorkflows() {
  const [state, setState] = useState(loadFromStorage);

  useEffect(() => {
    saveToStorage(state);
  }, [state]);

  function createWorkflow(name) {
    const trimmed = name.trim();
    if (!trimmed) return;
    setState(prev => {
      if (prev.workflows[trimmed] !== undefined) return prev;
      return {
        workflows: { ...prev.workflows, [trimmed]: [] },
        activeWorkflow: trimmed,
      };
    });
  }

  function setActiveWorkflow(name) {
    setState(prev => ({ ...prev, activeWorkflow: name }));
  }

  function addRow() {
    setState(prev => {
      const { activeWorkflow, workflows } = prev;
      if (!activeWorkflow) return prev;
      const rows = workflows[activeWorkflow] || [];
      const step = rows.length + 1;
      const newRow = {
        id: `${Date.now()}-${Math.random()}`,
        step,
        action: '',
        inputSource: '',
        tool: '',
        output: '',
        notes: '',
      };
      return {
        ...prev,
        workflows: {
          ...workflows,
          [activeWorkflow]: [...rows, newRow],
        },
      };
    });
  }

  function updateRow(id, field, value) {
    setState(prev => {
      const { activeWorkflow, workflows } = prev;
      if (!activeWorkflow) return prev;
      const rows = workflows[activeWorkflow].map(r =>
        r.id === id ? { ...r, [field]: value } : r
      );
      return {
        ...prev,
        workflows: { ...workflows, [activeWorkflow]: rows },
      };
    });
  }

  function deleteRow(id) {
    setState(prev => {
      const { activeWorkflow, workflows } = prev;
      if (!activeWorkflow) return prev;
      const rows = workflows[activeWorkflow]
        .filter(r => r.id !== id)
        .map((r, i) => ({ ...r, step: i + 1 }));
      return {
        ...prev,
        workflows: { ...workflows, [activeWorkflow]: rows },
      };
    });
  }

  return {
    workflows: state.workflows,
    activeWorkflow: state.activeWorkflow,
    createWorkflow,
    setActiveWorkflow,
    addRow,
    updateRow,
    deleteRow,
  };
}
