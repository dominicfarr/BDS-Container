import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ObservationTable from '../components/ObservationTable';

const mockRows = [
  { id: 'r1', step: 1, action: 'Review', inputSource: 'Doc', tool: 'Excel', output: 'Report', notes: '' },
  { id: 'r2', step: 2, action: 'Verify', inputSource: 'System', tool: 'Manual', output: 'Confirmed', notes: 'All good' },
];

describe('ObservationTable', () => {
  const mockAdd = jest.fn();
  const mockUpdate = jest.fn();
  const mockDelete = jest.fn();
  const mockDownload = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders column headers', () => {
    render(<ObservationTable rows={[]} onAddRow={mockAdd} onUpdateRow={mockUpdate} onDeleteRow={mockDelete} onDownload={mockDownload} workflowName="Test" />);
    expect(screen.getByText('Step')).toBeInTheDocument();
    expect(screen.getByText('Action')).toBeInTheDocument();
    expect(screen.getByText('Input/Source')).toBeInTheDocument();
    expect(screen.getByText('Tool')).toBeInTheDocument();
    expect(screen.getByText('Output')).toBeInTheDocument();
    expect(screen.getByText('Notes')).toBeInTheDocument();
  });

  test('renders Add Row button', () => {
    render(<ObservationTable rows={[]} onAddRow={mockAdd} onUpdateRow={mockUpdate} onDeleteRow={mockDelete} onDownload={mockDownload} workflowName="Test" />);
    expect(screen.getByRole('button', { name: /add row/i })).toBeInTheDocument();
  });

  test('calls onAddRow when Add Row clicked', async () => {
    const user = userEvent.setup();
    render(<ObservationTable rows={[]} onAddRow={mockAdd} onUpdateRow={mockUpdate} onDeleteRow={mockDelete} onDownload={mockDownload} workflowName="Test" />);
    await user.click(screen.getByRole('button', { name: /add row/i }));
    expect(mockAdd).toHaveBeenCalled();
  });

  test('renders existing rows', () => {
    render(<ObservationTable rows={mockRows} onAddRow={mockAdd} onUpdateRow={mockUpdate} onDeleteRow={mockDelete} onDownload={mockDownload} workflowName="Test" />);
    expect(screen.getByDisplayValue('Review')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Verify')).toBeInTheDocument();
  });

  test('step column is read-only', () => {
    render(<ObservationTable rows={mockRows} onAddRow={mockAdd} onUpdateRow={mockUpdate} onDeleteRow={mockDelete} onDownload={mockDownload} workflowName="Test" />);
    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
  });

  test('calls onUpdateRow when action field changes', async () => {
    const user = userEvent.setup();
    render(<ObservationTable rows={mockRows} onAddRow={mockAdd} onUpdateRow={mockUpdate} onDeleteRow={mockDelete} onDownload={mockDownload} workflowName="Test" />);
    const actionInput = screen.getByDisplayValue('Review');
    await user.clear(actionInput);
    await user.type(actionInput, 'New Action');
    expect(mockUpdate).toHaveBeenCalledWith('r1', 'action', expect.any(String));
  });

  test('shows character count for notes textarea', () => {
    render(<ObservationTable rows={mockRows} onAddRow={mockAdd} onUpdateRow={mockUpdate} onDeleteRow={mockDelete} onDownload={mockDownload} workflowName="Test" />);
    expect(screen.getByText('8 / 500 chars')).toBeInTheDocument();
  });

  test('calls onDeleteRow when delete clicked', async () => {
    const user = userEvent.setup();
    render(<ObservationTable rows={mockRows} onAddRow={mockAdd} onUpdateRow={mockUpdate} onDeleteRow={mockDelete} onDownload={mockDownload} workflowName="Test" />);
    const deleteButtons = screen.getAllByRole('button', { name: /delete/i });
    await user.click(deleteButtons[0]);
    expect(mockDelete).toHaveBeenCalledWith('r1');
  });

  test('renders Download CSV button', () => {
    render(<ObservationTable rows={mockRows} onAddRow={mockAdd} onUpdateRow={mockUpdate} onDeleteRow={mockDelete} onDownload={mockDownload} workflowName="Test" />);
    expect(screen.getByRole('button', { name: /download csv/i })).toBeInTheDocument();
  });

  test('calls onDownload when Download CSV clicked', async () => {
    const user = userEvent.setup();
    render(<ObservationTable rows={mockRows} onAddRow={mockAdd} onUpdateRow={mockUpdate} onDeleteRow={mockDelete} onDownload={mockDownload} workflowName="Test" />);
    await user.click(screen.getByRole('button', { name: /download csv/i }));
    expect(mockDownload).toHaveBeenCalled();
  });
});
