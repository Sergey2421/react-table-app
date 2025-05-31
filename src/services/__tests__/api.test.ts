import { describe, it, expect, beforeEach, afterEach, vi, type Mock } from 'vitest';
import { fetchUsers, createUser } from '../api';
import type { NewUser } from '../../types/User';

describe('API functions', () => {
  const mockUsers = [
    {
      id: 1,
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      phone: '+1234567890',
      position: 'Developer',
      department: 'IT',
      salary: 75000,
      hireDate: '2023-01-01',
      status: 'Active'
    }
  ];

  const mockNewUser: NewUser = {
    firstName: 'Jane',
    lastName: 'Smith',
    email: 'jane@example.com',
    phone: '+0987654321',
    position: 'Manager',
    department: 'HR',
    salary: 85000,
    hireDate: '2023-02-01',
    status: 'Active'
  };

  beforeEach(() => {
    vi.clearAllMocks();
    global.fetch = vi.fn();
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  describe('fetchUsers', () => {
    it('fetch users with correct pagination parameters', async () => {
      const mockResponse = {
        json: () => Promise.resolve(mockUsers),
        headers: new Headers({
          'X-Total-Count': '1'
        })
      };

      (global.fetch as Mock)
        .mockResolvedValueOnce(mockResponse)
        .mockResolvedValueOnce(mockResponse);

      const result = await fetchUsers(1, 10);

      expect(global.fetch).toHaveBeenCalledWith(
        'http://localhost:3000/users?_start=0&_limit=10&_sort=id&_order=asc'
      );
      expect(result).toEqual({
        users: mockUsers,
        total: mockUsers.length
      });
    });

    it('handle fetch errors gracefully', async () => {
      (global.fetch as Mock).mockRejectedValueOnce(new Error('Network error'));

      await expect(fetchUsers(1, 10)).rejects.toThrow('Network error');
    });
  });

  describe('createUser', () => {
    it('create a new user with correct data', async () => {
      const mockCreatedUser = { ...mockNewUser, id: 2 };
      const mockResponse = {
        json: () => Promise.resolve(mockCreatedUser)
      };

      (global.fetch as Mock).mockResolvedValueOnce(mockResponse);

      const result = await createUser(mockNewUser);

      expect(global.fetch).toHaveBeenCalledWith(
        'http://localhost:3000/users',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(mockNewUser),
        }
      );
      expect(result).toEqual(mockCreatedUser);
    });

    it('handle creation errors gracefully', async () => {
      (global.fetch as Mock).mockRejectedValueOnce(new Error('Failed to create user'));

      await expect(createUser(mockNewUser)).rejects.toThrow('Failed to create user');
    });
  });
}); 