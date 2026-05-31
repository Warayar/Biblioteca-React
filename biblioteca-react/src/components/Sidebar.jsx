import { Link, useLocation } from 'react-router-dom';
import { FaUniversity, FaBook, FaUsers, FaHandshake } from 'react-icons/fa';

function Sidebar() {
    // 1. Obtenemos la ruta actual (ej: "/libros" o "/usuarios")
    const location = useLocation();

    // 2. Función auxiliar para aplicar el diseño inteligente
    const obtenerEstiloLink = (ruta) => {
        const activo = location.pathname === ruta;
        return {
            color: activo ? '#ffffff' : '#e0e0e0', // Texto más blanco si está activo
            textDecoration: 'none',
            fontSize: '16px',
            display: 'flex',
            alignItems: 'center',
            padding: '12px 15px', // Espacio interno para que parezca un botón
            borderRadius: '8px', // Bordes redondeados
            backgroundColor: activo ? 'rgba(255, 255, 255, 0.15)' : 'transparent', // Fondo gris translúcido si está activo
            fontWeight: activo ? 'bold' : 'normal',
            transition: 'all 0.3s ease' // Animación suave al cambiar
        };
    };

    return (
        <div className="sidebar">
            <h2 style={{ borderBottom: '1px solid #383854', paddingBottom: '15px', marginBottom: '20px', display: 'flex', alignItems: 'center', fontSize: '22px' }}>
                <FaUniversity style={{ marginRight: '10px' }} />
                U San Marcos
            </h2>

            <ul style={{ listStyleType: 'none', padding: 0 }}>
                {/* Reducimos el margin a 5px porque ahora los links tienen su propio padding */}
                <li style={{ margin: '5px 0' }}>
                    <Link to="/libros" style={obtenerEstiloLink('/libros')}>
                        <FaBook style={{ marginRight: '12px' }} />
                        Gestión de Libros
                    </Link>
                </li>
                <li style={{ margin: '5px 0' }}>
                    <Link to="/usuarios" style={obtenerEstiloLink('/usuarios')}>
                        <FaUsers style={{ marginRight: '12px' }} />
                        Gestión de Lectores
                    </Link>
                </li>
                <li style={{ margin: '5px 0' }}>
                    <Link to="/transacciones" style={obtenerEstiloLink('/transacciones')}>
                        <FaHandshake style={{ marginRight: '12px' }} />
                        Préstamos y Devoluciones
                    </Link>
                </li>
            </ul>
        </div>
    );
}

export default Sidebar;