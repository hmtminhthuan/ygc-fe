import { BrowserRouter } from "react-router-dom";
import Routers from "./routers/Routers";
function App() {
  return (
    <>
      <BrowserRouter>
        <Routers />
      </BrowserRouter>
    </>
  );
}

export default App;
