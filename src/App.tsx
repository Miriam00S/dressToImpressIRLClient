import NavBar from './components/Navbar';
import ShowsList, { Show } from './components/ShowsList';

function App() {
  // Przykładowe dane do pokazów
  const shows: Show[] = [
    {
      id: '1',
      name: 'Show One',
      imageUrl: 'https://via.placeholder.com/400x200.png?text=Show+One',
    },
    {
      id: '2',
      name: 'Show Two',
      imageUrl: 'https://via.placeholder.com/400x200.png?text=Show+Two',
    },
    // dodaj więcej, jeśli potrzebujesz
  ];

  return (
    <div>
      <NavBar />
      {/* Dodajemy odstęp od NavBar */}
      <div >
        <ShowsList />
      </div>
    </div>
  );
}

export default App;
