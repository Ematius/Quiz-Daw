


import { Header } from "./Components/core/Header";
import { Footer } from "./Components/core/Footer";
import { Home } from "./pages/Home";
import { Modulo } from "./pages/Modulo";
import { Routes, Route } from "react-router-dom";
import { Quiz } from "./pages/Quiz";
import { NotFoundPage } from "./pages/404"; 

function App() {
  return (
    <div className="app-shell">
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<Home />}></Route>
          <Route path="/modulo/:moduloId" element={<Modulo />} />
          <Route path="/modulo/:moduloId/:topicId" element={<Quiz />} />
          <Route path="/*" element={<NotFoundPage/>}></Route>
        </Routes>
      </main>

    </div>
  );
}

export default App;
