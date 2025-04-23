import { ToastContainer } from "react-toastify";
import MainContent from "./components/main-content/main-content";
import { ArtworkNavigationProvider } from "./context/artwork-navigation-context";
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';

function App() {
  return (
    <>
    <div className="app-wrapper">
      <ArtworkNavigationProvider>
        <MainContent />
      </ArtworkNavigationProvider>
    </div>

    <ToastContainer 
      position="top-right" 
      autoClose={5000} 
      hideProgressBar={false} 
      newestOnTop={false} 
      closeOnClick 
      rtl={false} 
      pauseOnFocusLoss 
      draggable 
      pauseOnHover 
    />
  </>
  );
} 

export default App;
