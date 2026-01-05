import { BrowserRouter } from "react-router-dom";
import "./index.css";
import Routes from "./routes";
import { UserProvider } from "./context/UserContext";
import { ReactQueryProvider } from "./context/QueryProvider";
import { SocketProvider } from "./context/SocketContext";

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <ReactQueryProvider>
        <UserProvider>
          <SocketProvider>
            <Routes />
          </SocketProvider>
        </UserProvider>
      </ReactQueryProvider>
    </BrowserRouter>
  );
};

export default App;
