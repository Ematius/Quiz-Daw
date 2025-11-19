


import { Header } from "./Components/core/Header";
import { Footer } from "./Components/core/Footer";
import { Home } from "./pages/Home";
import { Modulo } from "./pages/Modulo";
import { Routes, Route } from "react-router-dom";
import { Quiz } from "./pages/Quiz";

function App() {
  return (
    <div className="app-shell">
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<Home />}></Route>
          <Route path="/modulo/:moduloId" element={<Modulo />} />
          <Route path="/modulo/:moduloId/:topicId" element={<Quiz />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
