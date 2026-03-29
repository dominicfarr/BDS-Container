import { useState } from 'react';

export default function WorkflowSelector({ workflows, activeWorkflow, onCreateWorkflow, onSwitchWorkflow }) {
  const [name, setName] = useState('');
  const workflowNames = Object.keys(workflows);

  function handleCreate() {
    if (!name.trim()) return;
    onCreateWorkflow(name.trim());
    setName('');
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter') handleCreate();
  }

  return (
    <div className="flex flex-wrap gap-3 items-center p-4 bg-white border-b border-gray-200">
      <div className="flex gap-2 items-center">
        <input
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Workflow name"
          className="border border-gray-300 rounded px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={handleCreate}
          className="bg-blue-600 text-white px-3 py-1.5 rounded text-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          New Workflow
        </button>
      </div>

      {workflowNames.length > 0 && (
        <div className="flex gap-2 items-center">
          <label className="text-sm text-gray-600">Switch to:</label>
          <select
            value={activeWorkflow || ''}
            onChange={e => onSwitchWorkflow(e.target.value)}
            className="border border-gray-300 rounded px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {workflowNames.map(wf => (
              <option key={wf} value={wf}>{wf}</option>
            ))}
          </select>
        </div>
      )}
    </div>
  );
}
