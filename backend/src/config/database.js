const mysql = require('mysql2/promise');

function parseDbConfig() {
  const url = process.env.MYSQL_URL || process.env.DATABASE_URL || process.env.MYSQL_PRIVATE_URL;
  if (url) {
    const u = new URL(url);
    return {
      host:     u.hostname,
      port:     parseInt(u.port) || 3306,
      user:     decodeURIComponent(u.username),
      password: decodeURIComponent(u.password),
      database: u.pathname.replace(/^\//, ''),
    };
  }
  return {
    host:     process.env.DB_HOST || process.env.MYSQLHOST || process.env.MYSQL_HOST || 'localhost',
    user:     process.env.DB_USER || process.env.MYSQLUSER || process.env.MYSQL_USER || 'root',
    password: process.env.DB_PASSWORD || process.env.MYSQLPASSWORD || process.env.MYSQL_PASSWORD,
    database: process.env.DB_NAME    || process.env.MYSQLDATABASE  || process.env.MYSQL_DATABASE,
    port:     parseInt(process.env.DB_PORT || process.env.MYSQLPORT || process.env.MYSQL_PORT) || 3306,
  };
}

const pool = mysql.createPool({
  ...parseDbConfig(),
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

  await runSafeMigration('Tabla series_meditacion', () =>
    pool.execute(`
      CREATE TABLE IF NOT EXISTS series_meditacion (
        id          INT AUTO_INCREMENT PRIMARY KEY,
        titulo      VARCHAR(200) NOT NULL,
        descripcion TEXT,
        slug        VARCHAR(100) NOT NULL UNIQUE,
        orden       INT DEFAULT 0,
        activa      BOOLEAN DEFAULT TRUE,
        created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `)
  );

  await runSafeMigration('Tabla meditaciones', () =>
    pool.execute(`
      CREATE TABLE IF NOT EXISTS meditaciones (
        id          INT AUTO_INCREMENT PRIMARY KEY,
        serie_id    INT NOT NULL,
        titulo      VARCHAR(200) NOT NULL,
        descripcion TEXT,
        duracion    INT NOT NULL DEFAULT 15,
        orden       INT DEFAULT 0,
        src         VARCHAR(500) NULL,
        disponible  BOOLEAN DEFAULT FALSE,
        created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (serie_id) REFERENCES series_meditacion(id) ON DELETE CASCADE,
        INDEX idx_med_serie (serie_id)
      )
    `)
  );

  await runSafeMigration('Tabla feedback_meditacion', () =>
    pool.execute(`
      CREATE TABLE IF NOT EXISTS feedback_meditacion (
        id            INT AUTO_INCREMENT PRIMARY KEY,
        usuario_id    INT NOT NULL,
        meditacion_id INT NOT NULL,
        texto         TEXT NOT NULL,
        visible       BOOLEAN DEFAULT TRUE,
        created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
        FOREIGN KEY (meditacion_id) REFERENCES meditaciones(id) ON DELETE CASCADE,
        UNIQUE KEY uk_feedback_u_m (usuario_id, meditacion_id),
        INDEX idx_fb_meditacion (meditacion_id)
      )
    `)
  );

  await runSafeMigration('Seed serie Volver a ti', async () => {
    const [[{ cnt }]] = await pool.execute(
      `SELECT COUNT(*) as cnt FROM series_meditacion WHERE slug = 'volver-a-ti'`
    );
    if (cnt === 0) {
      const [serie] = await pool.execute(
        `INSERT INTO series_meditacion (titulo, descripcion, slug, orden) VALUES (?, ?, ?, ?)`,
        [
          'Volver a ti',
          '5 meditaciones guiadas que usan la memoria sensorial para relajar cuerpo y mente, regular el sistema nervioso y facilitar un sueño profundo y reparador.',
          'volver-a-ti',
          1,
        ]
      );
      const serieId = serie.insertId;
      const meds = [
        ['Volver al cuerpo', 'El primer paso: notar que tienes un cuerpo que quiere descansar. Una práctica suave para soltar la tensión acumulada.', 15, 1, true],
        ['La respiración que calma', 'Técnicas de pranayama adaptadas para el momento previo al sueño. Sencillas y efectivas.', 12, 2, false],
        ['Soltar el día', 'Una exploración consciente para cerrar el día y dejar ir todo lo que no te pertenece.', 18, 3, false],
        ['El peso que te sostiene', 'Conecta con la tierra bajo tu cuerpo. Una práctica de enraizamiento profundo.', 20, 4, false],
        ['Dormir de un tirón', 'La práctica completa de la serie. Para cuando el cuerpo ya sabe el camino.', 25, 5, false],
      ];
      for (const [titulo, descripcion, duracion, orden, disponible] of meds) {
        await pool.execute(
          `INSERT INTO meditaciones (serie_id, titulo, descripcion, duracion, orden, disponible) VALUES (?, ?, ?, ?, ?, ?)`,
          [serieId, titulo, descripcion, duracion, orden, disponible ? 1 : 0]
        );
      }
    }
  });

  await runSafeMigration('Actualizar descripcion serie Volver a ti', async () => {
    await pool.execute(
      `UPDATE series_meditacion SET descripcion = ? WHERE slug = 'volver-a-ti'`,
      ['5 meditaciones guiadas que usan la memoria sensorial para relajar cuerpo y mente, regular el sistema nervioso y facilitar un sueño profundo y reparador.']
    );
  });

  await runSafeMigration('Audio src meditacion 1 Volver a ti', async () => {
    await pool.execute(
      `UPDATE meditaciones SET src = '/audios/volver-al-cuerpo.mp3', disponible = 1
       WHERE orden = 1
         AND serie_id = (SELECT id FROM series_meditacion WHERE slug = 'volver-a-ti')`,
      []
    );
  });

  await runSafeMigration('Audio src meditacion 3 Volver a ti', async () => {
    await pool.execute(
      `UPDATE meditaciones SET src = '/audios/unanoche.mp3', disponible = 1
       WHERE orden = 3
         AND serie_id = (SELECT id FROM series_meditacion WHERE slug = 'volver-a-ti')`,
      []
    );
  });

  await runSafeMigration('Audio src meditacion 2 Volver a ti', async () => {
    await pool.execute(
      `UPDATE meditaciones SET src = '/audios/meditacion2abrazofrio.mp3', disponible = 1
       WHERE orden = 2
         AND serie_id = (SELECT id FROM series_meditacion WHERE slug = 'volver-a-ti')`,
      []
    );
  });

  await runSafeMigration('Actualizar titulos meditaciones Volver a ti', async () => {
    const titulos = [
      [1, 'El arte de no hacer absolutamente nada'],
      [2, 'El abrazo frío que te inspira y revitaliza'],
      [3, 'Una noche de confidencias bajo las estrellas'],
      [4, 'Caminar sin rumbo para llegar a ti'],
      [5, 'El refugio donde aprendiste a descansar'],
    ];
    for (const [orden, titulo] of titulos) {
      await pool.execute(
        `UPDATE meditaciones SET titulo = ?
         WHERE orden = ? AND serie_id = (SELECT id FROM series_meditacion WHERE slug = 'volver-a-ti')`,
        [titulo, orden]
      );
    }
  });

  await runSafeMigration('Tabla clases', () =>
    pool.execute(`
      CREATE TABLE IF NOT EXISTS clases (
        id          INT AUTO_INCREMENT PRIMARY KEY,
        grupo_id    INT NOT NULL DEFAULT 1,
        titulo      VARCHAR(300) NOT NULL,
        descripcion TEXT,
        duracion    INT NOT NULL DEFAULT 30,
        nivel       TINYINT NOT NULL DEFAULT 1,
        imagen      VARCHAR(300) NULL,
        vimeo_id    VARCHAR(50) NULL,
        orden       INT DEFAULT 0,
        disponible  BOOLEAN DEFAULT FALSE,
        created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_clases_grupo (grupo_id)
      )
    `)
  );

  await runSafeMigration('Seed clases grupo 1 Movilidad Funcional', async () => {
    const [[{ cnt }]] = await pool.execute(
      `SELECT COUNT(*) as cnt FROM clases WHERE grupo_id = 1`
    );
    if (cnt === 0) {
      const clases = [
        ['Despierta tu columna: movimiento desde adentro',       'Activa y moviliza la columna vertebral con movimientos suaves y conscientes que parten del centro hacia fuera.', 25, 1, '/images/yoga3.jpg',   '1204272676', 1, 1],
        ['Caderas libres: el movimiento que cambia todo',         'Abre y libera las caderas para transformar tu forma de moverte en el día a día. La articulación más influyente del cuerpo.',              30, 1, '/images/yoga1.jpg',   null,         2, 0],
        ['Suelta el peso que llevas en los hombros, ¡literalmente!', 'Libera la tensión acumulada en cuello, hombros y zona cervical. Especialmente para quienes pasan horas frente a una pantalla.',      20, 1, '/images/yoga4.jpg',   null,         3, 0],
        ['La base que lo sostiene todo: despierta tus pies',     'Trabaja la conexión con el suelo activando tobillos, arcos plantares y la cadena de movimiento que empieza en los pies.',                25, 1, '/images/yoga2.jpg',   null,         4, 0],
        ['Cuando todo se conecta — la clase que lo une todo',    'Una secuencia integradora que recorre todos los patrones del grupo. El cierre perfecto para sentir el cuerpo como una unidad.',           30, 1, '/images/yoga-36.jpg', null,         5, 0],
      ];
      for (const [titulo, descripcion, duracion, nivel, imagen, vimeo_id, orden, disponible] of clases) {
        await pool.execute(
          `INSERT INTO clases (grupo_id, titulo, descripcion, duracion, nivel, imagen, vimeo_id, orden, disponible) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [1, titulo, descripcion, duracion, nivel, imagen, vimeo_id, orden, disponible]
        );
      }
    }
  });

  await runSafeMigration('Imágenes Movilidad Funcional clases 1 y 2', async () => {
    await pool.execute(
      `UPDATE clases SET imagen = '/images/grupomovilidad1.jpg'
       WHERE grupo_id = 1 AND orden = 1`
    );
    await pool.execute(
      `UPDATE clases SET imagen = '/images/grupomovilidad2.jpg'
       WHERE grupo_id = 1 AND orden = 2`
    );
  });

  await runSafeMigration('Video Movilidad Funcional clase 3', async () => {
    await pool.execute(
      `UPDATE clases SET vimeo_id = '1206175296', disponible = 1
       WHERE grupo_id = 1 AND orden = 3`
    );
  });

  await runSafeMigration('Imagen Movilidad Funcional clase 3', async () => {
    await pool.execute(
      `UPDATE clases SET imagen = '/images/yoga9.jpg'
       WHERE grupo_id = 1 AND orden = 3`
    );
  });

  await runSafeMigration('Tabla travesia_progress', () =>
    pool.execute(`
      CREATE TABLE IF NOT EXISTS travesia_progress (
        id         INT AUTO_INCREMENT PRIMARY KEY,
        usuario_id INT NOT NULL,
        clase_id   VARCHAR(50) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE KEY uk_tp (usuario_id, clase_id),
        FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
        INDEX idx_tp_usuario (usuario_id)
      )
    `)
  );

  await runSafeMigration('Columna stripe_customer_id en usuarios', async () => {
    const [[{ cnt }]] = await pool.execute(
      `SELECT COUNT(*) as cnt FROM INFORMATION_SCHEMA.COLUMNS
       WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'usuarios' AND COLUMN_NAME = 'stripe_customer_id'`
    );
    if (cnt === 0) {
      await pool.execute(`ALTER TABLE usuarios ADD COLUMN stripe_customer_id VARCHAR(100) NULL`);
    }
  });

  await runSafeMigration('Columna stripe_subscription_id en suscripciones', async () => {
    const [[{ cnt }]] = await pool.execute(
      `SELECT COUNT(*) as cnt FROM INFORMATION_SCHEMA.COLUMNS
       WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'suscripciones' AND COLUMN_NAME = 'stripe_subscription_id'`
    );
    if (cnt === 0) {
      await pool.execute(`ALTER TABLE suscripciones ADD COLUMN stripe_subscription_id VARCHAR(100) NULL`);
    }
  });

  await runSafeMigration('Actualizar importe default a 19.00', async () => {
    await pool.execute(
      `ALTER TABLE suscripciones MODIFY COLUMN importe DECIMAL(8,2) NOT NULL DEFAULT 19.00`
    );
  });

  await runSafeMigration('Suscripcion cuentas de prueba emrider', async () => {
    const emails = ['emridermotorgarage@gmail.com'];
    for (const email of emails) {
      const [[user]] = await pool.execute(
        `SELECT id FROM usuarios WHERE email = ? LIMIT 1`, [email]
      );
      if (!user) continue;
      const [[{ cnt }]] = await pool.execute(
        `SELECT COUNT(*) as cnt FROM suscripciones WHERE usuario_id = ? AND estado = 'activa' AND fecha_fin >= CURDATE()`,
        [user.id]
      );
      if (cnt > 0) continue;
      const fechaInicio = new Date().toISOString().slice(0, 10);
      const fechaFin = '2026-12-31';
      await pool.execute(
        `INSERT INTO suscripciones (usuario_id, estado, fecha_inicio, fecha_fin, importe) VALUES (?, 'activa', ?, ?, 0)`,
        [user.id, fechaInicio, fechaFin]
      );
      console.log(`Suscripción activada para cuenta de prueba: ${email}`);
    }
  });

  await runSafeMigration('Usuario admin por defecto', async () => {
    const [rows] = await pool.execute("SELECT id FROM usuarios WHERE rol = 'admin' LIMIT 1");
    if (rows.length === 0) {
      if (!process.env.ADMIN_PASSWORD) {
        console.warn('⚠️  ADMIN_PASSWORD no está configurado en .env — cambia la contraseña admin inmediatamente en producción.');
      }
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

async function testConnection(retries = 5, delay = 3000) {
  for (let i = 0; i < retries; i++) {
    try {
      const conn = await pool.getConnection();
      console.log('Conexión a MySQL establecida');
      conn.release();
      await runMigrations();
      return;
    } catch (err) {
      console.error(`Error conectando a MySQL (intento ${i + 1}/${retries}):`, err.message);
      if (i < retries - 1) {
        await new Promise(r => setTimeout(r, delay));
      }
    }
  }
  console.error('No se pudo conectar a MySQL tras varios intentos. Las rutas de API fallarán hasta que la BD esté disponible.');
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
