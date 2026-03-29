import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import WorkflowSelector from '../components/WorkflowSelector';

describe('WorkflowSelector', () => {
  const mockCreate = jest.fn();
  const mockSwitch = jest.fn();

  beforeEach(() => {
    mockCreate.mockClear();
    mockSwitch.mockClear();
  });

  test('renders input and button', () => {
    render(
      <WorkflowSelector
        workflows={{}}
        activeWorkflow={null}
        onCreateWorkflow={mockCreate}
        onSwitchWorkflow={mockSwitch}
      />
    );
    expect(screen.getByPlaceholderText(/workflow name/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /new workflow/i })).toBeInTheDocument();
  });

  test('calls onCreateWorkflow with input value', async () => {
    const user = userEvent.setup();
    render(
      <WorkflowSelector
        workflows={{}}
        activeWorkflow={null}
        onCreateWorkflow={mockCreate}
        onSwitchWorkflow={mockSwitch}
      />
    );
    await user.type(screen.getByPlaceholderText(/workflow name/i), 'Cameron - Takeoff');
    await user.click(screen.getByRole('button', { name: /new workflow/i }));
    expect(mockCreate).toHaveBeenCalledWith('Cameron - Takeoff');
  });

  test('clears input after creating workflow', async () => {
    const user = userEvent.setup();
    render(
      <WorkflowSelector
        workflows={{}}
        activeWorkflow={null}
        onCreateWorkflow={mockCreate}
        onSwitchWorkflow={mockSwitch}
      />
    );
    const input = screen.getByPlaceholderText(/workflow name/i);
    await user.type(input, 'Test');
    await user.click(screen.getByRole('button', { name: /new workflow/i }));
    expect(input.value).toBe('');
  });

  test('renders dropdown with existing workflows', () => {
    render(
      <WorkflowSelector
        workflows={{ 'WF1': [], 'WF2': [] }}
        activeWorkflow="WF1"
        onCreateWorkflow={mockCreate}
        onSwitchWorkflow={mockSwitch}
      />
    );
    expect(screen.getByRole('combobox')).toBeInTheDocument();
    expect(screen.getByText('WF1')).toBeInTheDocument();
    expect(screen.getByText('WF2')).toBeInTheDocument();
  });

  test('calls onSwitchWorkflow when dropdown changes', async () => {
    const user = userEvent.setup();
    render(
      <WorkflowSelector
        workflows={{ 'WF1': [], 'WF2': [] }}
        activeWorkflow="WF1"
        onCreateWorkflow={mockCreate}
        onSwitchWorkflow={mockSwitch}
      />
    );
    await user.selectOptions(screen.getByRole('combobox'), 'WF2');
    expect(mockSwitch).toHaveBeenCalledWith('WF2');
  });
});
