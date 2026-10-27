import { describe, expect, test } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App, { updateCompleted } from './App.jsx';

describe('Frontend verification tests', () => {

  test('FT-01: selecting another course updates course objectives', async () => {
    const user = userEvent.setup();
    render(<App />);
    expect(screen.getByText('Inspect file permissions')).toBeInTheDocument();
    await user.selectOptions(screen.getByLabelText('Select course'), 'cyber');
    expect(screen.getByRole('heading', { name: 'Cybersecurity Fundamentals' })).toBeInTheDocument();
    expect(screen.getByText('Identify security risks')).toBeInTheDocument();
    expect(screen.queryByText('Inspect file permissions')).not.toBeInTheDocument();
  });

  test('FT-02: completion event checks only objective 2', async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.click(screen.getByRole('button', { name: 'Simulate completion of objective 2' }));
    expect(screen.getByRole('checkbox', { name: 'Modify file permissions' })).toBeChecked();
    expect(screen.getByRole('checkbox', { name: 'Inspect file permissions' })).not.toBeChecked();
    expect(screen.getByRole('checkbox', { name: 'Check current directory' })).not.toBeChecked();
  });

  test('FT-03: unknown objective event is ignored (edge case)', () => {
    const original = { 'obj-1': true };
    const result = updateCompleted(original, { type: 'objective_completed', objectiveId: 'unknown' }, ['obj-1', 'obj-2']);
    expect(result).toEqual(original);
  });

  test('FT-04: chat drawer opens and displays mock AI response', async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.click(screen.getByRole('button', { name: 'Toggle AI Chat Drawer' }));
    await user.type(screen.getByLabelText('Ask a question'), 'How do I check permissions?');
    await user.click(screen.getByRole('button', { name: 'Send' }));
    expect(screen.getByText('You: How do I check permissions?')).toBeInTheDocument();
    expect(screen.getByText(/Mock AI response/)).toBeInTheDocument();
  });

  test('FT-05: terminal displays simulated command output', async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.type(screen.getByLabelText('Terminal command'), 'pwd');
    await user.click(screen.getByRole('button', { name: 'Run mock command' }));
    expect(screen.getByText('$ pwd')).toBeInTheDocument();
    expect(screen.getByText('/home/student')).toBeInTheDocument();
  });

});


describe('Final demo enhancements', () => {

  test('FT-06: terminal command completes matching learning objective', async () => {
    const user = userEvent.setup(); render(<App />);
    await user.type(screen.getByLabelText('Terminal command'), 'ls -l');
    await user.click(screen.getByRole('button', { name: 'Run mock command' }));
    expect(screen.getByRole('checkbox', { name: 'Inspect file permissions' })).toBeChecked();
    expect(screen.getByRole('checkbox', { name: 'Modify file permissions' })).not.toBeChecked();
  });

  test('FT-07: mock hints are revealed progressively', async () => {
    const user = userEvent.setup(); render(<App />);
    await user.click(screen.getByRole('button', { name: 'Toggle AI Chat Drawer' }));
    await user.type(screen.getByLabelText('Ask a question'), 'How do I change permissions?');
    await user.click(screen.getByRole('button', { name: 'Send' }));
    expect(screen.queryByText(/Hint 1:/)).not.toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Reveal next hint' }));
    expect(screen.getByText(/Hint 1:/)).toBeInTheDocument();
    expect(screen.queryByText(/Hint 2:/)).not.toBeInTheDocument();
  });
  
  test('FT-08: switching courses resets simulated progress', async () => {
    const user = userEvent.setup(); render(<App />);
    await user.click(screen.getByRole('button', { name: 'Simulate completion of objective 2' }));
    await user.selectOptions(screen.getByLabelText('Select course'), 'cyber');
    expect(screen.getByRole('checkbox', { name: 'Explain access control' })).not.toBeChecked();
    expect(screen.getByText('0 / 2')).toBeInTheDocument();
  });

});
