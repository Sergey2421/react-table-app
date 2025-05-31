import type { User, NewUser } from '../types/User';

const API_URL = 'http://localhost:3000';

export const fetchUsers = async (page: number = 1, limit: number = 10): Promise<{ users: User[], total: number }> => {
  const start = (page - 1) * limit;
  const response = await fetch(`${API_URL}/users?_start=${start}&_limit=${limit}&_sort=id&_order=asc`);
  const users = await response.json();
  
  const countResponse = await fetch(`${API_URL}/users`);
  const allUsers = await countResponse.json();
  const total = allUsers.length;
  
  return { users, total };
};

export const createUser = async (user: NewUser): Promise<User> => {
  const response = await fetch(`${API_URL}/users`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(user),
  });
  return response.json();
}; 