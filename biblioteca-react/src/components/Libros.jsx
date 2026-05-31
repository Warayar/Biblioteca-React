import { useState, useEffect } from 'react';
import { FaBook, FaPlus, FaSave, FaTimes, FaEdit, FaTrash } from 'react-icons/fa';
import Swal from 'sweetalert2';

function Libros() {
    const [libros, setLibros] = useState([]);
    const [mostrarFormulario, setMostrarFormulario] = useState(false);
    const [editandoId, setEditandoId] = useState(null);
    const [busqueda, setBusqueda] = useState(''); // 👇 1. NUEVO ESTADO PARA EL BUSCADOR

    // 1. Agregamos "anio" al estado inicial
    const [nuevoLibro, setNuevoLibro] = useState({
        titulo: '',
        autor: '',
        anioPublicacion: '',
        disponible: true
    });

    useEffect(() => {
        cargarLibros();
    }, []);

    const cargarLibros = () => {
        fetch("https://biblioteca-backend-gt3f.onrender.com/api/libros")
            .then(response => response.json())
            .then(data => setLibros(data))
            .catch(error => console.error("Error al cargar:", error));
    };

    const manejarEnvio = (e) => {
        e.preventDefault();
        const url = editandoId ? `https://biblioteca-backend-gt3f.onrender.com/api/libros/${editandoId}`
            : 'https://biblioteca-backend-gt3f.onrender.com/api/libros';
        const metodo = editandoId ? 'PUT' : 'POST';

        fetch(url, {
            method: metodo,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(nuevoLibro)
        })
            .then(() => {
                cargarLibros();
                cancelarEdicion();
                // 👇 MAGIA DE SWEETALERT AQUÍ 👇
                Swal.fire({
                    title: '¡Excelente!',
                    text: editandoId ? 'El libro se actualizó con éxito' : 'El libro se registró con éxito',
                    icon: 'success',
                    timer: 2000, // Se cierra solo en 2 segundos
                    showConfirmButton: false
                });
            })
            .catch(error => console.error("Error al guardar:", error));
    };

    const iniciarEdicion = (libro) => {
        // 2. Cargamos el año cuando se le da clic a Editar
        setNuevoLibro({
            titulo: libro.titulo,
            autor: libro.autor,
            anioPublicacion: libro.anioPublicacion || '', // Por si algún libro viejo no tiene año
            disponible: libro.disponible
        });
        setEditandoId(libro.id);
        setMostrarFormulario(true);
    };

    const cancelarEdicion = () => {
        // 3. Limpiamos el año al cancelar
        setNuevoLibro({ titulo: '', autor: '', anioPublicacion: '', disponible: true });
        setEditandoId(null);
        setMostrarFormulario(false);
    };

    const eliminarLibro = (id) => {
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
                fetch(`https://biblioteca-backend-gt3f.onrender.com/api/libros/${id}`, {
                    method: 'DELETE'
                })
                    .then(() => {
                        cargarLibros();
                        Swal.fire('¡Eliminado!', 'El libro ha sido borrado.', 'success');
                    })
                    .catch(error => console.error("Error al eliminar:", error));
            }
        });
    };

    // 👇 2. LÓGICA DEL BUSCADOR EN TIEMPO REAL 👇
    const librosFiltrados = libros.filter(libro => {
        const termino = busqueda.toLowerCase();
        const titulo = (libro.titulo || '').toLowerCase();
        const autor = (libro.autor || '').toLowerCase();
        const anio = (libro.anioPublicacion || '').toString().toLowerCase();

        return titulo.includes(termino) ||
            autor.includes(termino) ||
            anio.includes(termino);
    });
    // 👆 -------------------------------------- 👆

    return (
        <div>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 style={{ color: '#2c3e50', display: 'flex', alignItems: 'center', margin: 0 }}>
                    <FaBook style={{ marginRight: '12px' }} />
                    Gestión de Libros
                </h2>

                <button
                    className={`btn ${mostrarFormulario ? 'btn-secondary' : 'btn-primary'}`}
                    onClick={mostrarFormulario ? cancelarEdicion : () => setMostrarFormulario(true)}
                >
                    {mostrarFormulario ? <><FaTimes /> Cancelar</> : <><FaPlus /> Nuevo Libro</>}
                </button>
            </div>

            {mostrarFormulario && (
                <div className="card shadow-sm mb-4" style={{ borderLeft: `4px solid ${editandoId ? '#ffc107' : '#0d6efd'}` }}>
                    <div className="card-body">
                        <h5 className="card-title mb-3">
                            {editandoId ? '✏️ Editar Libro' : 'Registrar Nuevo Material'}
                        </h5>
                        <form onSubmit={manejarEnvio}>
                            <div className="row">
                                <div className="col-md-3 mb-3">
                                    <label className="form-label">Título</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        required
                                        value={nuevoLibro.titulo}
                                        onChange={(e) => setNuevoLibro({ ...nuevoLibro, titulo: e.target.value })}
                                    />
                                </div>
                                <div className="col-md-3 mb-3">
                                    <label className="form-label">Autor</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        required
                                        value={nuevoLibro.autor}
                                        onChange={(e) => setNuevoLibro({ ...nuevoLibro, autor: e.target.value })}
                                    />
                                </div>
                                {/* 4. Nuevo campo para el Año */}
                                <div className="col-md-2 mb-3">
                                    <label className="form-label">Año</label>
                                    <input
                                        type="number"
                                        className="form-control"
                                        required
                                        value={nuevoLibro.anioPublicacion} // <-- Aquí
                                        onChange={(e) => setNuevoLibro({ ...nuevoLibro, anioPublicacion: e.target.value })} // <-- Y aquí
                                    />
                                </div>
                                <div className="col-md-2 mb-3">
                                    <label className="form-label">Estado</label>
                                    <select
                                        className="form-select"
                                        value={nuevoLibro.disponible}
                                        onChange={(e) => setNuevoLibro({ ...nuevoLibro, disponible: e.target.value === 'true' })}
                                    >
                                        <option value="true">Disponible</option>
                                        <option value="false">Prestado</option>
                                    </select>
                                </div>
                                <div className="col-md-2 mb-3 d-flex align-items-end">
                                    <button type="submit" className={`btn w-100 fw-bold shadow-sm ${editandoId ? 'btn-warning' : 'btn-success'}`}>
                                        <FaSave style={{ marginRight: '5px' }} /> {editandoId ? 'Actualizar' : 'Guardar'}
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* 👇 3. BARRA DE BÚSQUEDA VISUAL 👇 */}
            <div className="row mb-3 mt-2">
                <div className="col-md-6">
                    <input
                        type="text"
                        className="form-control border-primary shadow-sm"
                        placeholder="🔍 Buscar por título, autor o año..."
                        value={busqueda}
                        onChange={(e) => setBusqueda(e.target.value)}
                    />
                </div>
            </div>
            {/* 👆 ------------------------------ 👆 */}

            {/* TABLA DE RESULTADOS LIBROS */}
            <div className="table-responsive">
                <table className="table table-hover table-striped shadow-sm border align-middle">
                    <thead className="table-dark">
                        <tr>
                            {/* Ocultamos ID y Año en celular */}
                            <th className="text-nowrap d-none d-md-table-cell">ID</th>
                            <th className="text-nowrap">Título</th>
                            <th className="text-nowrap">Autor</th>
                            <th className="text-nowrap d-none d-md-table-cell">Año</th>
                            <th className="text-nowrap">Estado</th>
                            <th className="text-center text-nowrap">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {/* 👇 4. USAMOS LA LISTA FILTRADA 👇 */}
                        {librosFiltrados.map(libro => (
                            <tr key={libro.id}>
                                <td className="d-none d-md-table-cell">{libro.id}</td>
                                <td className="text-nowrap"><strong>{libro.titulo}</strong></td>
                                <td className="text-nowrap">{libro.autor}</td>
                                <td className="text-nowrap d-none d-md-table-cell">{libro.anioPublicacion}</td>
                                <td>
                                    <span className={`badge ${libro.disponible ? 'bg-success' : 'bg-danger'}`}>
                                        {libro.disponible ? '✅ Disponible' : '❌ Prestado'}
                                    </span>
                                </td>
                                <td>
                                    {/* Botones alineados y protegidos con Flexbox */}
                                    <div className="d-flex justify-content-center flex-nowrap gap-2">
                                        <button onClick={() => iniciarEdicion(libro)} className="btn btn-sm btn-outline-primary" title="Editar">
                                            <FaEdit />
                                        </button>
                                        <button onClick={() => eliminarLibro(libro.id)} className="btn btn-sm btn-outline-danger" title="Eliminar">
                                            <FaTrash />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {/* Mensaje si no hay resultados */}
                {librosFiltrados.length === 0 && (
                    <div className="text-center p-4 text-muted">
                        No se encontraron libros que coincidan con tu búsqueda.
                    </div>
                )}
            </div>
        </div>
    );
}

export default Libros;