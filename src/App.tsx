import React from 'react';
import { Container, Typography, Box, Paper } from '@mui/material';
import { QueryClientProvider, useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { UsersTable } from './components/UsersTable';
import { UserForm } from './components/UserForm';
import { fetchUsers, createUser } from './services/api';
import type { NewUser, User } from './types/User';
import { queryClient } from './lib/queryClient';

interface UsersResponse {
  users: User[];
  total: number;
}

function UsersManager() {
  const queryClient = useQueryClient();
  const PAGE_SIZE = 10;

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isLoading,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ['users'],
    queryFn: ({ pageParam = 1 }) => fetchUsers(pageParam, PAGE_SIZE),
    getNextPageParam: (lastPage: UsersResponse, allPages: UsersResponse[]) => {
      const nextPage = allPages.length + 1;
      const totalPages = Math.ceil(lastPage.total / PAGE_SIZE);
      const hasMore = nextPage <= totalPages;

      return hasMore ? nextPage : undefined;
    },
    initialPageParam: 1,
  });

  const createUserMutation = useMutation({
    mutationFn: createUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });

  const users = React.useMemo(() => {
    if (!data?.pages) return [];
    const allUsers = data.pages.flatMap(page => page.users);

    return allUsers;
  }, [data?.pages, hasNextPage]);

  const handleCreateUser = async (userData: NewUser) => {
    await createUserMutation.mutateAsync(userData);
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Users Management
        </Typography>

        <Paper sx={{ p: 3, mb: 4 }}>
          <Typography variant="h6" gutterBottom>
            Add New User
          </Typography>
          <UserForm
            onSubmit={handleCreateUser}
            isSubmitting={createUserMutation.isPending}
          />
        </Paper>

        <UsersTable
          users={users}
          isLoading={isLoading || isFetchingNextPage}
          hasNextPage={!!hasNextPage}
          fetchNextPage={fetchNextPage}
        />
      </Box>
    </Container>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <UsersManager />
    </QueryClientProvider>
  );
}
