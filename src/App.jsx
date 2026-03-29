


import { Header } from "./Components/core/Header";
import { Footer } from "./Components/core/Footer";
import { ProtectedRoute } from "./Components/ProtectedRoute";

import { Home } from "./pages/Home";
import { Modulo } from "./pages/Modulo";
import { Routes, Route } from "react-router-dom";
import { Quiz } from "./pages/Quiz";
import { NotFoundPage } from "./pages/404";
import { Auth } from "./pages/Auth";
import { Panel } from "./pages/Panel";

function App() {
  return (
    <div className="app-shell">
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<Home />}></Route>
          <Route path="/auth" element={<Auth />} />
          <Route
            path="/panel"
            element={
              <ProtectedRoute>
                <Panel />
              </ProtectedRoute>
            }
          />
          <Route path="/modulo/:moduloId" element={<Modulo />} />
          <Route path="/modulo/:moduloId/:topicId" element={<Quiz />} />
          <Route path="/*" element={<NotFoundPage/>}></Route>
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
