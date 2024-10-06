import { useEffect } from "react";
import Productions from "./components/Productions";
import { useInfiniteQuery } from "@tanstack/react-query";



function App() {

  return (
    <>
      <Productions />
    </>
  );
}

export default App;
