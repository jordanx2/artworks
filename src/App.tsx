import { ToastContainer } from "react-toastify";
import MainContent from "./components/main-content/main-content";
import { ArtworkNavigationProvider } from "./context/artwork-navigation-context";

function App() {
  return (
    <>
    <ArtworkNavigationProvider>
      <MainContent />
    </ArtworkNavigationProvider>

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
