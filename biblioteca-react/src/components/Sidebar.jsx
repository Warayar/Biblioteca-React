import { Link } from 'react-router-dom';
import { FaUniversity, FaBook, FaUsers, FaHandshake } from 'react-icons/fa';

function Sidebar() {
    return (
        <div className="sidebar">
            <h2 style={{ borderBottom: '1px solid #383854', paddingBottom: '15px', marginBottom: '20px', display: 'flex', alignItems: 'center', fontSize: '22px' }}>
                <FaUniversity style={{ marginRight: '10px' }} />
                U San Marcos
            </h2>

            <ul style={{ listStyleType: 'none', padding: 0 }}>
                <li style={{ margin: '15px 0' }}>
                    <Link to="/libros" style={{ color: '#e0e0e0', textDecoration: 'none', fontSize: '16px', display: 'flex', alignItems: 'center' }}>
                        <FaBook style={{ marginRight: '12px' }} />
                        Gestión de Libros
                    </Link>
                </li>
                <li style={{ margin: '15px 0' }}>
                    <Link to="/usuarios" style={{ color: '#e0e0e0', textDecoration: 'none', fontSize: '16px', display: 'flex', alignItems: 'center' }}>
                        <FaUsers style={{ marginRight: '12px' }} />
                        Gestión de Lectores
                    </Link>
                </li>
                <li style={{ margin: '15px 0' }}>
                    <Link to="/transacciones" style={{ color: '#e0e0e0', textDecoration: 'none', fontSize: '16px', display: 'flex', alignItems: 'center' }}>
                        <FaHandshake style={{ marginRight: '12px' }} />
                        Préstamos y Devoluciones
                    </Link>
                </li>
            </ul>
        </div>
    );
}

export default Sidebar;