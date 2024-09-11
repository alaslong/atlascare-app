import { QueryClient } from 'react-query';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1, // Number of retry attempts if a query fails
      refetchOnWindowFocus: false, // Disable refetching on window focus
    },
  },
});

export default queryClient;
