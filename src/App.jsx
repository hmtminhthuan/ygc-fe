import { BrowserRouter } from "react-router-dom";
import Routers from "./routers/Routers";
import { AuthContextProvider } from "./constants/AuthContext";
function App() {
  return (
    <>
      <AuthContextProvider>
        <BrowserRouter>
          <Routers />
        </BrowserRouter>
      </AuthContextProvider>
    </>
  );
}

export default App;
