import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import '@testing-library/jest-dom';
import SignUp from '../components/Forms/SignUp';

jest.mock('../services/firebaseAuth', () => ({
  createUserWithEmailAndPassword: jest.fn(),
  auth: {
    currentUser: null
  }
}));

const user = userEvent.setup();

describe('SignUp component', () => {
  it('renders SignUp component correctly', () => {
    render(
      <MemoryRouter>
        <SignUp />
      </MemoryRouter>
    );
    expect(screen.getByRole('button', { name: 'Sign Up' })).toBeInTheDocument();
  });

  test('displays validation error for invalid email', async () => {
    render(
      <MemoryRouter>
        <SignUp />
      </MemoryRouter>
    );

    const emailInput = screen.getByLabelText('Email');

    await user.type(emailInput, 'invalid-email');

    const errorElement = screen.getByText(
      'Incorrect email! (e.g. example@gmail.com)'
    );

    expect(errorElement).toBeInTheDocument();
  });

  test('displays validation errors when need 1 uppercase letter', async () => {
    render(
      <MemoryRouter>
        <SignUp />
      </MemoryRouter>
    );

    const passwordInput = screen.getByLabelText('Password');

    await userEvent.type(passwordInput, 'short');
    expect(
      screen.getByText('Must contain at least one uppercase letter!')
    ).toBeInTheDocument();
  });

  test('displays validation errors when need 1 special character', async () => {
    render(
      <MemoryRouter>
        <SignUp />
      </MemoryRouter>
    );

    const passwordInput = screen.getByLabelText('Password');
    await user.type(passwordInput, '1Qwertys');

    expect(
      screen.getByText('Must contain at least 1 special character!')
    ).toBeInTheDocument();
  });

  test('displays validation error for mismatched passwords', async () => {
    render(
      <MemoryRouter>
        <SignUp />
      </MemoryRouter>
    );

    const passwordInput = screen.getByLabelText('Password');
    const confirmPasswordInput = screen.getByLabelText('Confirm password');

    await user.type(passwordInput, 'password123');
    await user.type(confirmPasswordInput, 'differentpassword');

    const errorElement = screen.getByText('Passwords must match');
    expect(errorElement).toBeInTheDocument();
  });

  test('displays validation errors when need 1 digit in the password', async () => {
    render(
      <MemoryRouter>
        <SignUp />
      </MemoryRouter>
    );

    const passwordInput = screen.getByLabelText('Password');
    await user.type(passwordInput, 'NoDigits');

    expect(
      screen.getByText('Must contain at least one digit!')
    ).toBeInTheDocument();
  });

  test('displays no validation errors for a valid input', async () => {
    render(
      <MemoryRouter>
        <SignUp />
      </MemoryRouter>
    );

    const emailInput = screen.getByLabelText('Email');
    const passwordInput = screen.getByLabelText('Password');
    const confirmPasswordInput = screen.getByLabelText('Confirm password');

    await user.type(emailInput, 'validemail@example.com');
    await user.type(passwordInput, 'StrongPass1!');
    await user.type(confirmPasswordInput, 'StrongPass1!');

    expect(
      screen.queryByText('Incorrect email! (e.g. example@gmail.com)')
    ).toBeNull();
    expect(
      screen.queryByText('Must contain at least one uppercase letter!')
    ).toBeNull();
    expect(screen.queryByText('Must contain at least one digit!')).toBeNull();
    expect(
      screen.queryByText('Must be at least 8 characters long!')
    ).toBeNull();
    expect(
      screen.queryByText('Must contain at least 1 special character!')
    ).toBeNull();
    expect(screen.queryByText('Passwords must match')).toBeNull();
  });
});
