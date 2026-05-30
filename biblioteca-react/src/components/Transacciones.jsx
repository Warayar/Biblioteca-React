import { useState, useEffect } from 'react';
import { FaHandshake, FaPlus, FaSave, FaTimes, FaEdit, FaTrash } from 'react-icons/fa';

function Transacciones() {
    const [transacciones, setTransacciones] = useState([]);
    const [libros, setLibros] = useState([]);
    const [usuarios, setUsuarios] = useState([]);
    const [mostrarFormulario, setMostrarFormulario] = useState(false);
    const [editandoId, setEditandoId] = useState(null);

    // 1. FUNCIÓN PARA FECHAS AUTOMÁTICAS
    const obtenerFechasPorDefecto = () => {
        const hoy = new Date();
        const devolucion = new Date();
        devolucion.setDate(hoy.getDate() + 7);

        return {
            prestamo: hoy.toISOString().split('T')[0],
            devolucion: devolucion.toISOString().split('T')[0]
        };
    };

    const fechasIniciales = obtenerFechasPorDefecto();

    // 2. ESTADO INICIAL DEL FORMULARIO
    const [nuevoPrestamo, setNuevoPrestamo] = useState({
        idLibro: '',
        idUsuario: '',
        fechaPrestamo: fechasIniciales.prestamo,
        fechaDevolucionEsperada: fechasIniciales.devolucion,
        estado: 'ACTIVO'
    });

    useEffect(() => {
        cargarDatos();
    }, []);

    const cargarDatos = () => {
        fetch('https://biblioteca-backend-gt3f.onrender.com/api/transacciones')
            .then(res => res.json())
            .then(data => setTransacciones(data))
            .catch(err => console.error("Error transacciones:", err));

        fetch('https://biblioteca-backend-gt3f.onrender.com/api/libros')
            .then(res => res.json())
            .then(data => setLibros(data))
            .catch(err => console.error("Error libros:", err));

        fetch('https://biblioteca-backend-gt3f.onrender.com/api/usuarios')
            .then(res => res.json())
            .then(data => setUsuarios(data))
            .catch(err => console.error("Error usuarios:", err));
    };

    const manejarEnvio = (e) => {
        e.preventDefault();

        const payload = {
            libro: { id: parseInt(nuevoPrestamo.idLibro) },
            usuario: { idUsuario: parseInt(nuevoPrestamo.idUsuario) },
            fechaPrestamo: nuevoPrestamo.fechaPrestamo,
            fechaDevolucionEsperada: nuevoPrestamo.fechaDevolucionEsperada,
            estado: nuevoPrestamo.estado
        };

        const url = editandoId
            ? `https://biblioteca-backend-gt3f.onrender.com/api/transacciones/${editandoId}`
            : 'https://biblioteca-backend-gt3f.onrender.com/api/transacciones';

        const metodo = editandoId ? 'PUT' : 'POST';

        fetch(url, {
            method: metodo,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        })
            .then(async response => {
                // VALIDACIÓN DE SEGURIDAD: Atrapamos el error 500 de Java
                if (!response.ok) {
                    throw new Error("El libro seleccionado no está disponible en este momento.");
                }
                return response.json();
            })
            .then(() => {
                cargarDatos();
                cancelarEdicion();
            })
            .catch(error => {
                console.error("Error al guardar préstamo:", error);
                // POP-UP DE ALERTA PARA EL USUARIO
                window.alert("❌ ACCIÓN DENEGADA: \n\n" + error.message);
            });
    };

    const iniciarEdicion = (t) => {
        setNuevoPrestamo({
            idLibro: t.libro?.id || '',
            idUsuario: t.usuario?.idUsuario || '',
            fechaPrestamo: t.fechaPrestamo || '',
            fechaDevolucionEsperada: t.fechaDevolucionEsperada || '',
            estado: t.estado || 'ACTIVO'
        });
        setEditandoId(t.id);
        setMostrarFormulario(true);
    };

    const cancelarEdicion = () => {
        const fechas = obtenerFechasPorDefecto();
        setNuevoPrestamo({
            idLibro: '',
            idUsuario: '',
            fechaPrestamo: fechas.prestamo,
            fechaDevolucionEsperada: fechas.devolucion,
            estado: 'ACTIVO'
        });
        setEditandoId(null);
        setMostrarFormulario(false);
    };

    const eliminarTransaccion = (id) => {
        if (window.confirm("¿Estás seguro de que deseas eliminar este registro?")) {
            fetch(`https://biblioteca-backend-gt3f.onrender.com/api/transacciones/${id}`, { method: 'DELETE' })
                .then(() => cargarDatos())
                .catch(error => console.error("Error al eliminar:", error));
        }
    };

    return (
        <div>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 style={{ color: '#2c3e50', display: 'flex', alignItems: 'center', margin: 0 }}>
                    <FaHandshake style={{ marginRight: '12px' }} /> Historial de Préstamos
                </h2>
                <button
                    className={`btn ${mostrarFormulario ? 'btn-secondary' : 'btn-primary'}`}
                    onClick={mostrarFormulario ? cancelarEdicion : () => setMostrarFormulario(true)}
                >
                    {mostrarFormulario ? <><FaTimes /> Cancelar</> : <><FaPlus /> Nuevo Préstamo</>}
                </button>
            </div>

            {mostrarFormulario && (
                <div className="card shadow-sm mb-4" style={{ borderLeft: `4px solid ${editandoId ? '#ffc107' : '#0d6efd'}` }}>
                    <div className="card-body">
                        <h5 className="card-title mb-4">
                            {editandoId ? '✏️ Editar Préstamo' : 'Registrar Nuevo Préstamo'}
                        </h5>
                        <form onSubmit={manejarEnvio}>
                            {/* FILA 1: Selectores con mucho espacio (col-md-6) para evitar descuadres */}
                            <div className="row mb-3">
                                <div className="col-md-6">
                                    <label className="form-label text-muted fw-bold">Lector</label>
                                    <select
                                        className="form-select border-primary"
                                        required
                                        value={nuevoPrestamo.idUsuario}
                                        onChange={e => setNuevoPrestamo({ ...nuevoPrestamo, idUsuario: e.target.value })}
                                    >
                                        {/* Opción por defecto asegurada */}
                                        <option value="" disabled>-- Seleccione un lector --</option>
                                        {usuarios.map(u => (
                                            <option key={u.idUsuario} value={u.idUsuario}>
                                                {u.cedula} - {u.nombre} {u.apellido1}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="col-md-6">
                                    <label className="form-label text-muted fw-bold">Libro a Prestar</label>
                                    <select
                                        className="form-select border-primary"
                                        required
                                        value={nuevoPrestamo.idLibro}
                                        onChange={e => setNuevoPrestamo({ ...nuevoPrestamo, idLibro: e.target.value })}
                                    >
                                        {/* Opción por defecto asegurada */}
                                        <option value="" disabled>-- Seleccione un libro --</option>
                                        {libros.map(l => (
                                            <option
                                                key={l.id}
                                                value={l.id}
                                                disabled={!l.disponible && nuevoPrestamo.idLibro !== String(l.id)}
                                            >
                                                {l.titulo} ({l.autor}) {!l.disponible ? ' ❌ (YA PRESTADO)' : ''}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            {/* FILA 2: Fechas, Estado y Botón de Guardar bien distribuidos */}
                            <div className="row">
                                <div className="col-md-3 mb-3">
                                    <label className="form-label">Fecha de Préstamo</label>
                                    <input
                                        type="date"
                                        className="form-control bg-light"
                                        required
                                        value={nuevoPrestamo.fechaPrestamo}
                                        onChange={e => setNuevoPrestamo({ ...nuevoPrestamo, fechaPrestamo: e.target.value })}
                                    />
                                </div>
                                <div className="col-md-3 mb-3">
                                    <label className="form-label">Devolución Esperada</label>
                                    <input
                                        type="date"
                                        className="form-control"
                                        required
                                        value={nuevoPrestamo.fechaDevolucionEsperada}
                                        onChange={e => setNuevoPrestamo({ ...nuevoPrestamo, fechaDevolucionEsperada: e.target.value })}
                                    />
                                </div>
                                <div className="col-md-3 mb-3">
                                    <label className="form-label">Estado del Préstamo</label>
                                    <select
                                        className="form-select"
                                        value={nuevoPrestamo.estado}
                                        onChange={e => setNuevoPrestamo({ ...nuevoPrestamo, estado: e.target.value })}
                                    >
                                        <option value="ACTIVO">Activo</option>
                                        <option value="DEVUELTO">Devuelto</option>
                                        <option value="VENCIDO">Vencido</option>
                                    </select>
                                </div>
                                <div className="col-md-3 mb-3 d-flex align-items-end">
                                    <button type="submit" className={`btn w-100 fw-bold shadow-sm ${editandoId ? 'btn-warning' : 'btn-success'}`}>
                                        <FaSave style={{ marginRight: '8px' }} /> {editandoId ? 'Actualizar' : 'Guardar Préstamo'}
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* TABLA DE RESULTADOS */}
            <div className="table-responsive">
                <table className="table table-hover table-striped shadow-sm border">
                    <thead className="table-dark">
                        <tr>
                            <th>ID</th>
                            <th>Lector</th>
                            <th>Libro</th>
                            <th>F. Préstamo</th>
                            <th>Vencimiento</th>
                            <th>Estado</th>
                            <th className="text-center">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {transacciones.map(t => (
                            <tr key={t.id}>
                                <td>{t.id}</td>
                                <td><strong>{t.usuario?.nombre} {t.usuario?.apellido1}</strong></td>
                                <td>{t.libro?.titulo}</td>
                                <td>{t.fechaPrestamo}</td>
                                <td>{t.fechaDevolucionEsperada}</td>
                                <td>
                                    <span className={`badge ${t.estado === 'ACTIVO' ? 'bg-warning text-dark' :
                                        t.estado === 'DEVUELTO' ? 'bg-success' : 'bg-danger'
                                        }`}>
                                        {t.estado}
                                    </span>
                                </td>
                                <td className="text-center">
                                    <button onClick={() => iniciarEdicion(t)} className="btn btn-sm btn-outline-primary me-2" title="Editar">
                                        <FaEdit />
                                    </button>
                                    <button onClick={() => eliminarTransaccion(t.id)} className="btn btn-sm btn-outline-danger" title="Eliminar">
                                        <FaTrash />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default Transacciones;