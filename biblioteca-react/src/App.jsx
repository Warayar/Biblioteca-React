import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Libros from './components/Libros';
import Usuarios from './components/Usuarios';
import Transacciones from './components/Transacciones';
import Dashboard from './components/Dashboard';
import './App.css'; // ¡Súper importante importar el CSS aquí!

function App() {
  return (
    <Router>
      <div className="contenedor-principal">
        <Sidebar />

        <div className="contenido-dinamico">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/" element={<Navigate to="/libros" />} />
            <Route path="/libros" element={<Libros />} />
            <Route path="/usuarios" element={<Usuarios />} />
            <Route path="/transacciones" element={<Transacciones />} />
            <Route path="/transacciones" element={<h2>Construyendo el módulo de préstamos... 🚧</h2>} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;