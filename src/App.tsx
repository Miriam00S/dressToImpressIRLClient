import { useEffect, useState } from "react";
import NavBar from "./components/NavBar";
import ShowsList from "./components/ShowsList";
import { Show } from "./services/types";
import { fetchGET } from "./services/api";
import ShowsListByTopic from "./components/ShowsListByTopic";


function App() {
  const [shows, setShows] = useState<Show[]>([]);
  const [showsByTopic, setShowsByTopic] = useState<Show[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchShows = async () => {
      try {
        if (searchQuery.trim() === '') {
          const data = await fetchGET('/shows');
          setShows(data);
        } else if (searchQuery.includes(',')) {
          const topics = searchQuery.split(',').map(t => t.trim()).filter(Boolean);
          const resultsArray = await Promise.all(
            topics.map(topic =>
              fetchGET(`/shows/by-topic?topic=${encodeURIComponent(topic)}`)
            )
          );
          // Łączymy wyniki z poszczególnych zapytań
          setShowsByTopic(resultsArray.flat());
        } else {
          const data = await fetchGET(`/shows/by-topic?topic=${encodeURIComponent(searchQuery)}`);
          setShowsByTopic(data);
        }
      } catch (error) {
        console.error('Error downloading shows:', error);
      } finally {
        setLoading(false);
      }
    };
  
    fetchShows();
  }, [searchQuery]);
  

  const autocompleteOptions = Array.from(new Set(shows.map(show => show.topic)))

  return (
    <div className="overflow-x-hidden flex flex-col items-start min-h-screen">
      <NavBar onSearch={setSearchQuery} autocompleteOptions={autocompleteOptions}/>
      <div className="mt-16">
        {searchQuery.trim() === '' ? (
          <ShowsList />
        ) : (
          <ShowsListByTopic showsByTopic={showsByTopic} loading={loading} />
        )}
      </div>
    </div>
  );
}

export default App;


