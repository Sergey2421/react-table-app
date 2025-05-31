import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
import { screen, waitFor } from '@testing-library/react/dist/pure';
import userEvent from '@testing-library/user-event';
import { UserForm } from '../UserForm';
import type { NewUser } from '../../types/User';

describe('UserForm', () => {
  const mockUser: NewUser = {
    firstName: 'John',
    lastName: 'Doe',
    email: 'john@example.com',
    phone: '+1234567890',
    position: 'Developer',
    department: 'IT',
    salary: 75000,
    hireDate: '2023-01-01',
    status: 'Active'
  };

  const mockOnSubmit = vi.fn();

  const renderForm = () => {
    return render(
      <UserForm onSubmit={mockOnSubmit} isSubmitting={false} />
    );
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('render all form fields', () => {
    renderForm();

    expect(screen.getByLabelText(/first name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/last name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/phone/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/position/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/department/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/salary/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/hire date/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/status/i)).toBeInTheDocument();
  });

  it('submit form with valid data', async () => {
    renderForm();
    const user = userEvent.setup();

    await user.type(screen.getByLabelText(/first name/i), mockUser.firstName);
    await user.type(screen.getByLabelText(/last name/i), mockUser.lastName);
    await user.type(screen.getByLabelText(/email/i), mockUser.email);
    await user.type(screen.getByLabelText(/phone/i), mockUser.phone);
    await user.type(screen.getByLabelText(/position/i), mockUser.position);
    await user.type(screen.getByLabelText(/department/i), mockUser.department);
    await user.clear(screen.getByLabelText(/salary/i));
    await user.type(screen.getByLabelText(/salary/i), mockUser.salary.toString());
    await user.type(screen.getByLabelText(/hire date/i), mockUser.hireDate);
    
    const statusSelect = screen.getByLabelText(/status/i);
    await user.click(statusSelect);
    await user.click(screen.getByText('Active'));
    
    await user.click(screen.getByRole('button', { name: /add user/i }));

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith(mockUser);
    });
  });

  it('show validation errors for invalid data', async () => {
    renderForm();
    const user = userEvent.setup();

    await user.type(screen.getByLabelText(/email/i), 'invalid-email');
    await user.click(screen.getByRole('button', { name: /add user/i }));

    expect(await screen.findByText(/invalid email/i)).toBeInTheDocument();
    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it('show success message after successful submission', async () => {
    renderForm();
    const user = userEvent.setup();

    await user.type(screen.getByLabelText(/first name/i), mockUser.firstName);
    await user.type(screen.getByLabelText(/last name/i), mockUser.lastName);
    await user.type(screen.getByLabelText(/email/i), mockUser.email);
    await user.type(screen.getByLabelText(/phone/i), mockUser.phone);
    await user.type(screen.getByLabelText(/position/i), mockUser.position);
    await user.type(screen.getByLabelText(/department/i), mockUser.department);
    await user.type(screen.getByLabelText(/hire date/i), mockUser.hireDate);

    const statusSelect = screen.getByLabelText(/status/i);
    await user.click(statusSelect);
    await user.click(screen.getByText('Active'));

    mockOnSubmit.mockResolvedValueOnce(undefined);
    await user.click(screen.getByRole('button', { name: /add user/i }));

    expect(await screen.findByText(/user successfully added/i)).toBeInTheDocument();
  });
}); 