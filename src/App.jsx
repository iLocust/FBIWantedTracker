import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import WantedList from './WantedList';
import WantedDetail from './WantedDetail';
import NotFound from './NotFound';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          <Route path="/" element={<WantedList />} />
          <Route path="/page/:page" element={<WantedList />} />
          <Route path="/details/:uid" element={<WantedDetail />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
