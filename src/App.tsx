import "./App.css";
import Graph from "./components/Graph";

function App() {
  const objects = [
    {
      id: "A",
      name: "Object A",
      links: ["B", "C"],
      history: ["v1", "v2", "v3"],
    },
    {
      id: "B",
      name: "Object B",
      links: ["D"],
      history: ["v1", "v2", "v3"],
    },
    { id: "C", name: "Object C", links: ["D"], history: ["v1", "v2", "v3"] },
    { id: "D", name: "Object D", links: [], history: ["v1", "v2", "v3"] },
  ];
  return (
    <>
      <Graph objects={objects}></Graph>
    </>
  );
}

export default App;
