const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host:     process.env.DB_HOST     || 'localhost',
  user:     process.env.DB_USER     || 'root',
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port:     process.env.DB_PORT     || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

async function runSafeMigration(description, fn) {
  try {
    await fn();
    console.log('Migración:', description);
  } catch (err) {
    console.warn(`Migración omitida (${description}):`, err.message);
  }
}

async function runMigrations() {
  await runSafeMigration('Tabla usuarios', () =>
    pool.execute(`
      CREATE TABLE IF NOT EXISTS usuarios (
        id         INT AUTO_INCREMENT PRIMARY KEY,
        nombre     VARCHAR(100) NOT NULL,
        email      VARCHAR(100) NOT NULL UNIQUE,
        password   VARCHAR(255) NOT NULL,
        rol        ENUM('admin', 'suscriptor') DEFAULT 'suscriptor',
        activo     BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `)
  );

  await runSafeMigration('Tabla suscripciones', () =>
    pool.execute(`
      CREATE TABLE IF NOT EXISTS suscripciones (
        id           INT AUTO_INCREMENT PRIMARY KEY,
        usuario_id   INT NOT NULL,
        estado       ENUM('activa', 'cancelada', 'expirada') DEFAULT 'activa',
        fecha_inicio DATE NOT NULL,
        fecha_fin    DATE NOT NULL,
        created_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
        INDEX idx_suscripciones_usuario (usuario_id),
        INDEX idx_suscripciones_estado (estado)
      )
    `)
  );

  await runSafeMigration('Columna telefono en usuarios', async () => {
    const [[{ cnt }]] = await pool.execute(
      `SELECT COUNT(*) as cnt FROM INFORMATION_SCHEMA.COLUMNS
       WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'usuarios' AND COLUMN_NAME = 'telefono'`
    );
    if (cnt === 0) {
      await pool.execute(`ALTER TABLE usuarios ADD COLUMN telefono VARCHAR(20) NULL AFTER email`);
    }
  });

  await runSafeMigration('Columna apellidos en usuarios', async () => {
    const [[{ cnt }]] = await pool.execute(
      `SELECT COUNT(*) as cnt FROM INFORMATION_SCHEMA.COLUMNS
       WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'usuarios' AND COLUMN_NAME = 'apellidos'`
    );
    if (cnt === 0) {
      await pool.execute(`ALTER TABLE usuarios ADD COLUMN apellidos VARCHAR(100) NULL AFTER nombre`);
    }
  });

  await runSafeMigration('Columna importe en suscripciones', async () => {
    const [[{ cnt }]] = await pool.execute(
      `SELECT COUNT(*) as cnt FROM INFORMATION_SCHEMA.COLUMNS
       WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'suscripciones' AND COLUMN_NAME = 'importe'`
    );
    if (cnt === 0) {
      await pool.execute(`ALTER TABLE suscripciones ADD COLUMN importe DECIMAL(8,2) NOT NULL DEFAULT 17.00 AFTER estado`);
    }
  });

  await runSafeMigration('Tabla direcciones', () =>
    pool.execute(`
      CREATE TABLE IF NOT EXISTS direcciones (
        id            INT AUTO_INCREMENT PRIMARY KEY,
        usuario_id    INT NOT NULL UNIQUE,
        nombre        VARCHAR(100) NULL,
        apellidos     VARCHAR(100) NULL,
        nif           VARCHAR(20)  NULL,
        calle         VARCHAR(200) NULL,
        ciudad        VARCHAR(100) NULL,
        provincia     VARCHAR(100) NULL,
        cp            VARCHAR(10)  NULL,
        pais          VARCHAR(80)  NULL DEFAULT 'España',
        created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
      )
    `)
  );

  await runSafeMigration('Columna nif en direcciones', async () => {
    const [[{ cnt }]] = await pool.execute(
      `SELECT COUNT(*) as cnt FROM INFORMATION_SCHEMA.COLUMNS
       WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'direcciones' AND COLUMN_NAME = 'nif'`
    );
    if (cnt === 0) {
      await pool.execute(`ALTER TABLE direcciones ADD COLUMN nif VARCHAR(20) NULL AFTER apellidos`);
    }
  });

  await runSafeMigration('Tabla metodos_pago', () =>
    pool.execute(`
      CREATE TABLE IF NOT EXISTS metodos_pago (
        id             INT AUTO_INCREMENT PRIMARY KEY,
        usuario_id     INT NOT NULL,
        tipo           VARCHAR(20) NOT NULL DEFAULT 'visa',
        ultimos_cuatro CHAR(4) NOT NULL,
        mes_expiry     TINYINT NOT NULL,
        anio_expiry    SMALLINT NOT NULL,
        predeterminado BOOLEAN DEFAULT FALSE,
        created_at     TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
        INDEX idx_metodos_usuario (usuario_id)
      )
    `)
  );

  await runSafeMigration('Tabla password_resets', () =>
    pool.execute(`
      CREATE TABLE IF NOT EXISTS password_resets (
        id         INT AUTO_INCREMENT PRIMARY KEY,
        email      VARCHAR(100) NOT NULL,
        token      VARCHAR(255) NOT NULL,
        expires_at DATETIME NOT NULL,
        used       BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_password_resets_email (email),
        INDEX idx_password_resets_token (token)
      )
    `)
  );

  await runSafeMigration('Tabla email_verifications', () =>
    pool.execute(`
      CREATE TABLE IF NOT EXISTS email_verifications (
        id              INT AUTO_INCREMENT PRIMARY KEY,
        token           VARCHAR(255) NOT NULL,
        email           VARCHAR(100) NOT NULL,
        nombre          VARCHAR(100) NOT NULL,
        telefono        VARCHAR(20)  NULL,
        hashed_password VARCHAR(255) NOT NULL,
        expires_at      DATETIME     NOT NULL,
        used            BOOLEAN      DEFAULT FALSE,
        created_at      TIMESTAMP    DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_ev_token (token),
        INDEX idx_ev_email (email)
      )
    `)
  );

  await runSafeMigration('Usuario admin por defecto', async () => {
    const [rows] = await pool.execute("SELECT id FROM usuarios WHERE rol = 'admin' LIMIT 1");
    if (rows.length === 0) {
      const bcrypt = require('bcryptjs');
      const hashed = await bcrypt.hash(process.env.ADMIN_PASSWORD || 'Admin1234.', 12);
      await pool.execute(
        `INSERT INTO usuarios (nombre, email, password, rol) VALUES (?, ?, ?, 'admin')`,
        ['Admin', process.env.ADMIN_EMAIL || 'admin@yogatierraviva.es', hashed]
      );
      console.log('  -> Admin creado:', process.env.ADMIN_EMAIL || 'admin@yogatierraviva.es');
    }
  });
}

async function testConnection() {
  try {
    const conn = await pool.getConnection();
    console.log('Conexión a MySQL establecida');
    conn.release();
    await runMigrations();
  } catch (err) {
    console.error('Error conectando a MySQL:', err.message);
  }
}

async function executeQuery(sql, params = []) {
  try {
    const [rows] = await pool.execute(sql, params);
    return { success: true, data: rows };
  } catch (err) {
    console.error('Error en query:', err.message);
    return { success: false, error: err.message };
  }
}

async function executeTransaction(queries) {
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();
    const results = [];
    for (const q of queries) {
      const [result] = await conn.execute(q.query, q.params);
      results.push(result);
    }
    await conn.commit();
    return { success: true, data: results };
  } catch (err) {
    await conn.rollback();
    console.error('Error en transacción:', err.message);
    return { success: false, error: err.message };
  } finally {
    conn.release();
  }
}

module.exports = { pool, testConnection, executeQuery, executeTransaction };
