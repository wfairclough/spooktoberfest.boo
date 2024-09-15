import { useState } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query';
import './App.css'

function App() {
  const [query, setQuery] = useState('');
  const { isPending, isError, data, error } = useQuery({
    queryKey: ['movies', query],
    queryFn: async () => {
      const resp = await fetch(`http://localhost:3000/movies?query=${query}&page=1`);
      return resp.json();
    },
  });

  if (isError) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <>
      <label>Search:</label>
      <input type="text" value={query} onChange={(e) => setQuery(e.target.value)} />

      <pre>
        {JSON.stringify(data, null, 2)}
      </pre>
    </>
  )
}

export default App
