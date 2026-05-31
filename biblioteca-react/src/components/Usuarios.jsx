import { useState, useEffect } from 'react';
import { FaUsers, FaPlus, FaSave, FaTimes, FaEdit, FaTrash } from 'react-icons/fa';
import Swal from 'sweetalert2';

function Usuarios() {
    const [usuarios, setUsuarios] = useState([]);
    const [mostrarFormulario, setMostrarFormulario] = useState(false);
    const [editandoId, setEditandoId] = useState(null);

    const [nuevoUsuario, setNuevoUsuario] = useState({
        nombre: '', apellido1: '', apellido2: '', cedula: '', correo: '', telefono: '', estado: true
    });

    useEffect(() => { cargarUsuarios(); }, []);

    const cargarUsuarios = () => {
        fetch('https://biblioteca-backend-gt3f.onrender.com/api/usuarios')
            .then(response => response.json())
            .then(data => setUsuarios(data))
            .catch(error => console.error("Error al cargar:", error));
    };

    // 1. Agregamos la palabra "async" aquí
    const manejarEnvio = async (e) => {
        e.preventDefault();

        // 👇 --- INICIO DE VALIDACIÓN DE NEGOCIO --- 👇
        // Si estamos editando un usuario y lo estamos intentando inactivar (estado === false)
        if (editandoId && nuevoUsuario.estado === false) {
            try {
                // Le pedimos a Render la lista de transacciones rápidamente
                const respuesta = await fetch('https://biblioteca-backend-gt3f.onrender.com/api/transacciones');
                const transacciones = await respuesta.json();

                // Buscamos si existe al menos una (some) donde el usuario sea este y el estado sea ACTIVO
                const tienePendientes = transacciones.some(t =>
                    t.usuario?.idUsuario === editandoId && t.estado === 'ACTIVO'
                );

                if (tienePendientes) {
                    // Si te debe un libro, lanzamos la alerta y abortamos el guardado
                    Swal.fire({
                        title: 'Acción Bloqueada',
                        text: 'No puedes inactivar a un lector que tiene libros pendientes de devolver.',
                        icon: 'warning',
                        confirmButtonColor: '#f39c12'
                    });
                    return; // 🛑 Esta palabra mágica detiene la función aquí mismo y no guarda nada
                }
            } catch (error) {
                console.error("Error al validar transacciones:", error);
            }
        }
        // 👆 --- FIN DE VALIDACIÓN --- 👆

        // Si pasó la validación (o si era un usuario nuevo), continúa el guardado normal
        const url = editandoId ? `https://biblioteca-backend-gt3f.onrender.com/api/usuarios/${editandoId}` : 'https://biblioteca-backend-gt3f.onrender.com/api/usuarios';
        const metodo = editandoId ? 'PUT' : 'POST';

        fetch(url, {
            method: metodo,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(nuevoUsuario)
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error("No se pudo guardar el registro. Verifica que la cédula no esté repetida en el sistema.");
                }
            })
            .then(() => {
                cargarUsuarios();
                cancelarEdicion();
                Swal.fire({
                    title: '¡Excelente!',
                    text: editandoId ? 'El lector se actualizó con éxito' : 'El lector se registró con éxito',
                    icon: 'success',
                    timer: 2000,
                    showConfirmButton: false
                });
            })
            .catch(error => {
                console.error("Error al guardar:", error);
                Swal.fire({
                    title: 'Acción Denegada',
                    text: error.message,
                    icon: 'error',
                    confirmButtonColor: '#0d6efd'
                });
            });
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
        // 👇 CONFIRMACIÓN MODERNA 👇
        Swal.fire({
            title: '¿Estás seguro?',
            text: "Esta acción no se puede deshacer",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#6c757d',
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                fetch(`https://biblioteca-backend-gt3f.onrender.com/api/usuarios/${id}`, { method: 'DELETE' })
                    .then(() => {
                        cargarUsuarios();
                        Swal.fire('¡Eliminado!', 'El lector ha sido borrado exitosamente.', 'success');
                    })
                    .catch(error => console.error("Error al eliminar:", error));
            }
        });
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