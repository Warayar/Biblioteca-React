import { useState, useEffect } from 'react';
import { FaUsers, FaPlus, FaSave, FaTimes, FaEdit, FaTrash } from 'react-icons/fa';

function Usuarios() {
    const [usuarios, setUsuarios] = useState([]);
    const [mostrarFormulario, setMostrarFormulario] = useState(false);
    const [editandoId, setEditandoId] = useState(null);

    const [nuevoUsuario, setNuevoUsuario] = useState({
        nombre: '', apellido1: '', apellido2: '', cedula: '', correo: '', telefono: '', estado: true
    });

    useEffect(() => { cargarUsuarios(); }, []);

    const cargarUsuarios = () => {
        fetch('http://localhost:8080/api/usuarios')
            .then(response => response.json())
            .then(data => setUsuarios(data))
            .catch(error => console.error("Error al cargar:", error));
    };

    const manejarEnvio = (e) => {
        e.preventDefault();
        const url = editandoId ? `http://localhost:8080/api/usuarios/${editandoId}` : 'http://localhost:8080/api/usuarios';
        const metodo = editandoId ? 'PUT' : 'POST';

        fetch(url, {
            method: metodo,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(nuevoUsuario)
        })
            .then(() => { cargarUsuarios(); cancelarEdicion(); })
            .catch(error => console.error("Error al guardar:", error));
    };

    const iniciarEdicion = (u) => {
        setNuevoUsuario({ nombre: u.nombre, apellido1: u.apellido1, apellido2: u.apellido2, cedula: u.cedula, correo: u.correo, telefono: u.telefono, estado: u.estado });
        setEditandoId(u.idUsuario);
        setMostrarFormulario(true);
    };

    const cancelarEdicion = () => {
        setNuevoUsuario({ nombre: '', apellido1: '', apellido2: '', cedula: '', correo: '', telefono: '', estado: true });
        setEditandoId(null);
        setMostrarFormulario(false);
    };

    const eliminarUsuario = (id) => {
        if (window.confirm("¿Estás seguro de que deseas eliminar este lector?")) {
            fetch(`http://localhost:8080/api/usuarios/${id}`, { method: 'DELETE' })
                .then(() => cargarUsuarios())
                .catch(error => console.error("Error al eliminar:", error));
        }
    };

    return (
        <div>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 style={{ color: '#2c3e50', display: 'flex', alignItems: 'center', margin: 0 }}>
                    <FaUsers style={{ marginRight: '12px' }} /> Gestión de Lectores
                </h2>
                <button className={`btn ${mostrarFormulario ? 'btn-secondary' : 'btn-primary'}`} onClick={mostrarFormulario ? cancelarEdicion : () => setMostrarFormulario(true)}>
                    {mostrarFormulario ? <><FaTimes /> Cancelar</> : <><FaPlus /> Nuevo Lector</>}
                </button>
            </div>

            {mostrarFormulario && (
                <div className="card shadow-sm mb-4" style={{ borderLeft: `4px solid ${editandoId ? '#ffc107' : '#0d6efd'}` }}>
                    <div className="card-body">
                        <h5 className="card-title mb-3">{editandoId ? '✏️ Editar Lector' : 'Registrar Nuevo Lector'}</h5>
                        <form onSubmit={manejarEnvio}>
                            <div className="row">
                                <div className="col-md-3 mb-3"><label className="form-label">Cédula</label><input type="text" className="form-control" required value={nuevoUsuario.cedula} onChange={e => setNuevoUsuario({ ...nuevoUsuario, cedula: e.target.value })} /></div>
                                <div className="col-md-3 mb-3"><label className="form-label">Nombre</label><input type="text" className="form-control" required value={nuevoUsuario.nombre} onChange={e => setNuevoUsuario({ ...nuevoUsuario, nombre: e.target.value })} /></div>
                                <div className="col-md-3 mb-3"><label className="form-label">Primer Apellido</label><input type="text" className="form-control" required value={nuevoUsuario.apellido1} onChange={e => setNuevoUsuario({ ...nuevoUsuario, apellido1: e.target.value })} /></div>
                                <div className="col-md-3 mb-3"><label className="form-label">Segundo Apellido</label><input type="text" className="form-control" required value={nuevoUsuario.apellido2} onChange={e => setNuevoUsuario({ ...nuevoUsuario, apellido2: e.target.value })} /></div>
                                <div className="col-md-4 mb-3"><label className="form-label">Correo</label><input type="email" className="form-control" required value={nuevoUsuario.correo} onChange={e => setNuevoUsuario({ ...nuevoUsuario, correo: e.target.value })} /></div>
                                <div className="col-md-3 mb-3"><label className="form-label">Teléfono</label><input type="text" className="form-control" required value={nuevoUsuario.telefono} onChange={e => setNuevoUsuario({ ...nuevoUsuario, telefono: e.target.value })} /></div>
                                <div className="col-md-3 mb-3">
                                    <label className="form-label">Estado</label>
                                    <select className="form-select" value={nuevoUsuario.estado} onChange={e => setNuevoUsuario({ ...nuevoUsuario, estado: e.target.value === 'true' })}>
                                        <option value="true">Activo</option><option value="false">Inactivo</option>
                                    </select>
                                </div>
                                <div className="col-md-2 mb-3 d-flex align-items-end"><button type="submit" className={`btn w-100 ${editandoId ? 'btn-warning' : 'btn-success'}`}><FaSave /> {editandoId ? 'Actualizar' : 'Guardar'}</button></div>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <div className="table-responsive">
                <table className="table table-hover table-striped shadow-sm">
                    <thead className="table-dark">
                        <tr>
                            <th>Cédula</th><th>Nombre Completo</th><th>Correo</th><th>Teléfono</th><th>Estado</th><th className="text-center">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {usuarios.map(u => (
                            <tr key={u.idUsuario}>
                                <td>{u.cedula}</td><td><strong>{u.nombre} {u.apellido1} {u.apellido2}</strong></td><td>{u.correo}</td><td>{u.telefono}</td>
                                <td><span className={`badge ${u.estado ? 'bg-success' : 'bg-danger'}`}>{u.estado ? '✅ Activo' : '❌ Inactivo'}</span></td>
                                <td className="text-center">
                                    <button onClick={() => iniciarEdicion(u)} className="btn btn-sm btn-outline-primary me-2"><FaEdit /></button>
                                    <button onClick={() => eliminarUsuario(u.idUsuario)} className="btn btn-sm btn-outline-danger"><FaTrash /></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default Usuarios;