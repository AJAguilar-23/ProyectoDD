CREATE TABLE usuarios (
  usuario_id BINARY(16) PRIMARY KEY,
  nombre VARCHAR(20) NOT NULL UNIQUE,
  correo VARCHAR(254) NOT NULL UNIQUE,
  contrasena_hash VARCHAR(255) NOT NULL,
  creado TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE publicaciones (
  publicacion_id CHAR(36) PRIMARY KEY,
  usuario_id BINARY(16) NOT NULL,
  titulo VARCHAR(60) NOT NULL,
  contenido TEXT NOT NULL,
  fecha_hora TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (usuario_id) REFERENCES usuarios(usuario_id) ON DELETE CASCADE
);

CREATE TABLE comentarios (
  comentario_id CHAR(36) PRIMARY KEY,
  publicacion_id CHAR(36),
  usuario_id BINARY(16),
  contenido TEXT NOT NULL,
  fecha_hora TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (usuario_id) REFERENCES usuarios(usuario_id) ON DELETE CASCADE,
  FOREIGN KEY (publicacion_id) REFERENCES publicaciones(publicacion_id) ON DELETE CASCADE
);