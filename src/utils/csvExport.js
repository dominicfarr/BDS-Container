function escapeField(value) {
  const str = String(value);
  if (str.includes(',') || str.includes('"') || str.includes('\n')) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

export function generateCSV(rows) {
  const headers = ['Step', 'Action', 'Input/Source', 'Tool', 'Output', 'Notes'];
  const lines = [headers.join(',')];
  for (const row of rows) {
    const fields = [
      escapeField(row.step),
      escapeField(row.action),
      escapeField(row.inputSource),
      escapeField(row.tool),
      escapeField(row.output),
      escapeField(row.notes),
    ];
    lines.push(fields.join(','));
  }
  return lines.join('\n');
}

export function downloadCSV(rows, workflowName) {
  const csv = generateCSV(rows);
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${workflowName}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
