import { useEffect, useState } from "react";
import api from "../src/services/api";

// 1. Definisci l'interfaccia fuori dal componente
interface Post {
  id: number;
  titolo: string;
}

function App() {
  const [data, setData] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 2. Crea una funzione async interna
    const fetchData = async () => {
      try {
        // 3. Specifica il tipo <Post> nella chiamata axios
        const response = await api.get<Post>("/1");

        // Con axios, i dati sono dentro l'oggetto .data
        setData(response.data);
      } catch (error) {
        console.error("Errore durante il caricamento:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []); // [] significa che viene eseguito solo al montaggio del componente

  if (loading) return <p>Caricamento in corso...</p>;

  return (
    <div>
      <h1>{data?.titolo}</h1>
    </div>
  );
}

export default App;
