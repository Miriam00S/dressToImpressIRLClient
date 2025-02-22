import NavBar from "./components/NavBar";
import ShowsList from "./components/ShowsList";


function App() {

  return (
    <div className="overflow-x-hidden">
      <NavBar />
      <div className="py-20">
        <ShowsList />
      </div>
    </div>
  );
}

export default App;
