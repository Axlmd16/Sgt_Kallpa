import "./App.css";
import AppRouter from "./app/router/AppRouter";
import AuthProvider from "./app/providers/AuthProvider";
import { Toaster } from "sonner";

function App() {
  return (
    <AuthProvider>
      <AppRouter />
      <Toaster
        position="bottom-left"
        expand={false}
        richColors
        closeButton
        duration={4000}
        toastOptions={{
          style: {
            fontFamily: "inherit",
          },
        }}
      />
    </AuthProvider>
  );
}

export default App;
