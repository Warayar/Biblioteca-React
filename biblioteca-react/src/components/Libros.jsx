import { useState, useEffect } from 'react';
import { FaBook, FaPlus, FaSave, FaTimes, FaEdit, FaTrash } from 'react-icons/fa';

function Libros() {
    const [libros, setLibros] = useState([]);
    const [mostrarFormulario, setMostrarFormulario] = useState(false);
    const [editandoId, setEditandoId] = useState(null);

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
        fetch('http://localhost:8080/api/libros')
            .then(response => response.json())
            .then(data => setLibros(data))
            .catch(error => console.error("Error al cargar:", error));
    };

    const manejarEnvio = (e) => {
        e.preventDefault();

        const url = editandoId
            ? `http://localhost:8080/api/libros/${editandoId}`
            : 'http://localhost:8080/api/libros';

        const metodo = editandoId ? 'PUT' : 'POST';

        fetch(url, {
            method: metodo,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(nuevoLibro)
        })
            .then(() => {
                cargarLibros();
                cancelarEdicion();
            })
            .catch(error => console.error("Error al guardar:", error));
    };

    const iniciarEdicion = (libro) => {
        // 2. Cargamos el año cuando se le da clic a Editar
        setNuevoLibro({
            titulo: libro.titulo,
            autor: libro.autor,
            anio: libro.anioPublicacion || '', // Por si algún libro viejo no tiene año
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
        if (window.confirm("¿Estás seguro de que deseas eliminar este libro?")) {
            fetch(`http://localhost:8080/api/libros/${id}`, {
                method: 'DELETE'
            })
                .then(() => cargarLibros())
                .catch(error => console.error("Error al eliminar:", error));
        }
    };

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
                                    <button type="submit" className={`btn w-100 ${editandoId ? 'btn-warning' : 'btn-success'}`}>
                                        <FaSave style={{ marginRight: '5px' }} /> {editandoId ? 'Actualizar' : 'Guardar'}
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <div className="table-responsive">
                <table className="table table-hover table-striped shadow-sm">
                    <thead className="table-dark">
                        <tr>
                            <th>ID</th>
                            <th>Título</th>
                            <th>Autor</th>
                            <th>Año</th>
                            <th>Estado</th>
                            <th className="text-center">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {libros.map(libro => (
                            <tr key={libro.id}>
                                <td>{libro.id}</td>
                                <td><strong>{libro.titulo}</strong></td>
                                <td>{libro.autor}</td>
                                <td>{libro.anioPublicacion}</td> {/* <-- Aquí */}
                                <td>
                                    <span className={`badge ${libro.disponible ? 'bg-success' : 'bg-danger'}`}>
                                        {libro.disponible ? '✅ Disponible' : '❌ Prestado'}
                                    </span>
                                </td>
                                <td className="text-center">
                                    <button onClick={() => iniciarEdicion(libro)} className="btn btn-sm btn-outline-primary me-2" title="Editar">
                                        <FaEdit />
                                    </button>
                                    <button onClick={() => eliminarLibro(libro.id)} className="btn btn-sm btn-outline-danger" title="Eliminar">
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

export default Libros;