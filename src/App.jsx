import useWorkflows from './hooks/useWorkflows';
import WorkflowSelector from './components/WorkflowSelector';
import ObservationTable from './components/ObservationTable';
import { downloadCSV } from './utils/csvExport';

export default function App() {
  const {
    workflows,
    activeWorkflow,
    createWorkflow,
    setActiveWorkflow,
    addRow,
    updateRow,
    deleteRow,
  } = useWorkflows();

  const activeRows = activeWorkflow ? (workflows[activeWorkflow] || []) : [];

  function handleDownload() {
    if (!activeWorkflow) return;
    downloadCSV(activeRows, activeWorkflow);
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <h1 className="text-xl font-bold text-gray-900">Audit Observation Form</h1>
        </div>
      </header>

      <main className="max-w-7xl mx-auto mt-4 bg-white rounded-lg shadow">
        <WorkflowSelector
          workflows={workflows}
          activeWorkflow={activeWorkflow}
          onCreateWorkflow={createWorkflow}
          onSwitchWorkflow={setActiveWorkflow}
        />

        {activeWorkflow ? (
          <ObservationTable
            rows={activeRows}
            onAddRow={addRow}
            onUpdateRow={updateRow}
            onDeleteRow={deleteRow}
            onDownload={handleDownload}
            workflowName={activeWorkflow}
          />
        ) : (
          <div className="p-8 text-center text-gray-400">
            <p>Create or select a workflow to begin capturing observations.</p>
          </div>
        )}
      </main>
    </div>
  );
}
