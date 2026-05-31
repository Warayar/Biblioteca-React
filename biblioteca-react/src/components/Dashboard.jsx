import { useState, useEffect } from 'react';
import { FaBook, FaUsers, FaHandshake, FaExclamationTriangle } from 'react-icons/fa';

function Dashboard() {
    const [stats, setStats] = useState({
        totalLibros: 0,
        librosPrestados: 0,
        lectoresActivos: 0,
        prestamosActivos: 0,
        prestamosVencidos: 0
    });

    useEffect(() => {
        // Ejecutamos las 3 peticiones al mismo tiempo para que cargue súper rápido
        Promise.all([
            fetch('https://biblioteca-backend-gt3f.onrender.com/api/libros').then(res => res.json()),
            fetch('https://biblioteca-backend-gt3f.onrender.com/api/usuarios').then(res => res.json()),
            fetch('https://biblioteca-backend-gt3f.onrender.com/api/transacciones').then(res => res.json())
        ]).then(([libros, usuarios, transacciones]) => {

            // Calculamos las estadísticas
            setStats({
                totalLibros: libros.length,
                librosPrestados: libros.filter(l => !l.disponible).length,
                lectoresActivos: usuarios.filter(u => u.estado === true).length,
                prestamosActivos: transacciones.filter(t => t.estado === 'ACTIVO').length,
                prestamosVencidos: transacciones.filter(t => t.estado === 'VENCIDO').length
            });

        }).catch(err => console.error("Error cargando estadísticas del dashboard:", err));
    }, []);

    return (
        <div>
            <h2 style={{ color: '#2c3e50', marginBottom: '30px', fontWeight: 'bold' }}>
                Panel de Control
            </h2>

            <div className="row">
                {/* Tarjeta 1: Total de Libros */}
                <div className="col-md-3 mb-4">
                    <div className="card shadow-sm border-0" style={{ borderBottom: '5px solid #0d6efd' }}>
                        <div className="card-body d-flex align-items-center">
                            <div className="bg-primary text-white p-3 rounded-circle me-3 d-flex justify-content-center align-items-center" style={{ width: '60px', height: '60px' }}>
                                <FaBook size={24} />
                            </div>
                            <div>
                                <h6 className="text-muted mb-1">Total de Libros</h6>
                                <h3 className="mb-0 fw-bold">{stats.totalLibros}</h3>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Tarjeta 2: Lectores Activos */}
                <div className="col-md-3 mb-4">
                    <div className="card shadow-sm border-0" style={{ borderBottom: '5px solid #198754' }}>
                        <div className="card-body d-flex align-items-center">
                            <div className="bg-success text-white p-3 rounded-circle me-3 d-flex justify-content-center align-items-center" style={{ width: '60px', height: '60px' }}>
                                <FaUsers size={24} />
                            </div>
                            <div>
                                <h6 className="text-muted mb-1">Lectores Activos</h6>
                                <h3 className="mb-0 fw-bold">{stats.lectoresActivos}</h3>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Tarjeta 3: Préstamos Activos */}
                <div className="col-md-3 mb-4">
                    <div className="card shadow-sm border-0" style={{ borderBottom: '5px solid #ffc107' }}>
                        <div className="card-body d-flex align-items-center">
                            <div className="bg-warning text-dark p-3 rounded-circle me-3 d-flex justify-content-center align-items-center" style={{ width: '60px', height: '60px' }}>
                                <FaHandshake size={24} />
                            </div>
                            <div>
                                <h6 className="text-muted mb-1">Préstamos en Curso</h6>
                                <h3 className="mb-0 fw-bold">{stats.prestamosActivos}</h3>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Tarjeta 4: Alertas / Vencidos */}
                <div className="col-md-3 mb-4">
                    <div className="card shadow-sm border-0" style={{ borderBottom: '5px solid #dc3545' }}>
                        <div className="card-body d-flex align-items-center">
                            <div className="bg-danger text-white p-3 rounded-circle me-3 d-flex justify-content-center align-items-center" style={{ width: '60px', height: '60px' }}>
                                <FaExclamationTriangle size={24} />
                            </div>
                            <div>
                                <h6 className="text-muted mb-1">Libros Vencidos</h6>
                                <h3 className="mb-0 fw-bold">{stats.prestamosVencidos}</h3>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Un pequeño mensaje de bienvenida */}
            <div className="card shadow-sm border-0 mt-2 bg-light">
                <div className="card-body p-4 text-center">
                    <h4 className="text-primary mb-3">¡Bienvenido al Sistema de Biblioteca de la U San Marcos!</h4>
                    <p className="text-muted mb-0">
                        Actualmente tienes <strong>{stats.librosPrestados}</strong> libros fuera de la biblioteca. Utiliza el menú lateral para gestionar el inventario, administrar a los lectores o registrar nuevos movimientos.
                    </p>
                </div>
            </div>
        </div>
    );
}

export default Dashboard;