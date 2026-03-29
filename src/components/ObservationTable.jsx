export default function ObservationTable({ rows, onAddRow, onUpdateRow, onDeleteRow, onDownload, workflowName }) {
  return (
    <div className="flex flex-col gap-4 p-4">
      <div className="flex gap-3 items-center">
        <h2 className="text-lg font-semibold text-gray-800">{workflowName}</h2>
        <button
          onClick={onAddRow}
          className="bg-green-600 text-white px-3 py-1.5 rounded text-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
        >
          Add Row
        </button>
        <button
          onClick={onDownload}
          className="bg-gray-600 text-white px-3 py-1.5 rounded text-sm hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
        >
          Download CSV
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-200 text-sm">
          <thead className="bg-gray-50">
            <tr>
              {['Step', 'Action', 'Input/Source', 'Tool', 'Output', 'Notes', ''].map(h => (
                <th key={h} className="border border-gray-200 px-3 py-2 text-left font-medium text-gray-700">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map(row => (
              <tr key={row.id} className="hover:bg-gray-50">
                <td className="border border-gray-200 px-3 py-1 text-gray-500 w-12 text-center">{row.step}</td>
                {['action', 'inputSource', 'tool', 'output'].map(field => (
                  <td key={field} className="border border-gray-200 px-1 py-1">
                    <input
                      type="text"
                      value={row[field]}
                      onChange={e => onUpdateRow(row.id, field, e.target.value)}
                      maxLength={100}
                      className="w-full px-2 py-1 focus:outline-none focus:ring-1 focus:ring-blue-500 rounded"
                    />
                  </td>
                ))}
                <td className="border border-gray-200 px-1 py-1 min-w-[180px]">
                  <textarea
                    value={row.notes}
                    onChange={e => onUpdateRow(row.id, 'notes', e.target.value)}
                    maxLength={500}
                    rows={2}
                    className="w-full px-2 py-1 focus:outline-none focus:ring-1 focus:ring-blue-500 rounded resize-none"
                  />
                  <div className="text-xs text-gray-400 text-right">{row.notes.length} / 500 chars</div>
                </td>
                <td className="border border-gray-200 px-2 py-1 text-center">
                  <button
                    onClick={() => onDeleteRow(row.id)}
                    className="text-red-500 hover:text-red-700 text-xs focus:outline-none"
                    aria-label="Delete row"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {rows.length === 0 && (
        <p className="text-gray-400 text-sm text-center py-4">
          No observations yet. Click &quot;Add Row&quot; to start.
        </p>
      )}
    </div>
  );
}
