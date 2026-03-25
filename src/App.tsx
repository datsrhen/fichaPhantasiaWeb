import { FichaProvider } from "./context/FichaContext";
import FichaCJphant from "./components/FichaCJphant";
import AppNavigator from "./components/AppNavigator";

function App() {
  return (
    <FichaProvider>
      <FichaCJphant />
      <AppNavigator />
    </FichaProvider>
  );
}

export default App;

/*export default function App() {
  return (
    <div className="bg-red-500 text-white p-4">
      Tailwind funcionando
    </div>
  )
}*/