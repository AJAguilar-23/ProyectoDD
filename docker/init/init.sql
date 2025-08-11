-- Crear tabla de usuarios
CREATE TABLE users (
    id BINARY(16) PRIMARY KEY, 
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    phone VARCHAR(20),
    password_hash VARCHAR(255) NOT NULL,
    must_change_password BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Crear tabla de publicaciones
CREATE TABLE publicaciones (
    id BINARY(16) PRIMARY KEY, 
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,      
    author_id BINARY(16) NOT NULL, 
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, 
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, 
    FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE CASCADE 
);

-- Crear tabla de comentarios
CREATE TABLE comentarios (
    id BINARY(16) PRIMARY KEY, 
    content TEXT NOT NULL, 
    publicacion_id BINARY(16) NOT NULL, 
    user_id BINARY(16) NOT NULL, 
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, 
    FOREIGN KEY (publicacion_id) REFERENCES publicaciones(id) ON DELETE CASCADE, 
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE 
);

-- Insertar usuario de ejemplo
INSERT INTO users (id, name, email, phone, password_hash, must_change_password)
VALUES (
    UUID_TO_BIN('410eda32-99f1-43f7-b0bc-40a7937b2ee0'),
    'Axel Aguilar',
    'ajaguilarp@unah.hn',
    '+50499999999',
    '$2b$10$8XGbDoBTzLyD1//HptVOeueIsu9FgwgSbrmGHSNpb.YlB2SXRlLDi', -- blog1234
    true
);