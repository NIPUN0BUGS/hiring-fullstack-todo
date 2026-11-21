import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { todosApi } from '../api.js';

export const TODOS_QUERY_KEY = ['todos'];

/**
 * Keeps server state (the TODO list) out of UI components.
 * TanStack Query handles loading, caching, refetching and mutation state.
 */
export function useTodos() {
  const queryClient = useQueryClient();

  const todosQuery = useQuery({
    queryKey: TODOS_QUERY_KEY,
    queryFn: todosApi.getAll,
  });

  const createMutation = useMutation({
    mutationFn: todosApi.create,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: TODOS_QUERY_KEY }),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, changes }) => todosApi.update(id, changes),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: TODOS_QUERY_KEY }),
  });

  const toggleMutation = useMutation({
    mutationFn: ({ id, done }) => todosApi.setDone(id, done),
    onMutate: async ({ id, done }) => {
      await queryClient.cancelQueries({ queryKey: TODOS_QUERY_KEY });
      const previousTodos = queryClient.getQueryData(TODOS_QUERY_KEY);

      queryClient.setQueryData(TODOS_QUERY_KEY, (current = []) =>
        current.map((todo) => (todo._id === id ? { ...todo, done } : todo)),
      );

      return { previousTodos };
    },
    onError: (_error, _variables, context) => {
      if (context?.previousTodos) {
        queryClient.setQueryData(TODOS_QUERY_KEY, context.previousTodos);
      }
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: TODOS_QUERY_KEY }),
  });

  const deleteMutation = useMutation({
    mutationFn: todosApi.remove,
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: TODOS_QUERY_KEY });
      const previousTodos = queryClient.getQueryData(TODOS_QUERY_KEY);

      queryClient.setQueryData(TODOS_QUERY_KEY, (current = []) =>
        current.filter((todo) => todo._id !== id),
      );

      return { previousTodos };
    },
    onError: (_error, _id, context) => {
      if (context?.previousTodos) {
        queryClient.setQueryData(TODOS_QUERY_KEY, context.previousTodos);
      }
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: TODOS_QUERY_KEY }),
  });

  const isTodoBusy = (id) => (
    (updateMutation.isPending && updateMutation.variables?.id === id)
    || (toggleMutation.isPending && toggleMutation.variables?.id === id)
    || (deleteMutation.isPending && deleteMutation.variables === id)
  );

  return {
    todos: todosQuery.data ?? [],
    isLoading: todosQuery.isLoading,
    isError: todosQuery.isError,
    error: todosQuery.error,
    refetch: todosQuery.refetch,
    createTodo: createMutation.mutateAsync,
    updateTodo: updateMutation.mutateAsync,
    setTodoDone: toggleMutation.mutateAsync,
    deleteTodo: deleteMutation.mutateAsync,
    isCreating: createMutation.isPending,
    isTodoBusy,
  };
}
