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
  enableKeepAlive: true,
  keepAliveInitialDelay: 10000,
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

  await runSafeMigration('Audio src meditacion 3 nuevo Volver a ti', async () => {
    await pool.execute(
      `UPDATE meditaciones SET src = '/audios/meditacion3.mp3', disponible = 1
       WHERE orden = 3
         AND serie_id = (SELECT id FROM series_meditacion WHERE slug = 'volver-a-ti')`,
      []
    );
  });

  await runSafeMigration('Audio src meditacion 4 Volver a ti', async () => {
    await pool.execute(
      `UPDATE meditaciones SET src = '/audios/meditacion4.mp3', disponible = 1
       WHERE orden = 4
         AND serie_id = (SELECT id FROM series_meditacion WHERE slug = 'volver-a-ti')`,
      []
    );
  });

  await runSafeMigration('Tabla feedback_clases', () =>
    pool.execute(`
      CREATE TABLE IF NOT EXISTS feedback_clases (
        id         INT AUTO_INCREMENT PRIMARY KEY,
        usuario_id INT NOT NULL,
        clase_id   VARCHAR(50) NOT NULL,
        texto      TEXT NOT NULL,
        visible    BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
        UNIQUE KEY uk_fb_clase (usuario_id, clase_id),
        INDEX idx_fb_clase (clase_id)
      )
    `)
  );

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

  await runSafeMigration('Corregir vimeo_id Movilidad Funcional clase 1', async () => {
    await pool.execute(
      `UPDATE clases SET vimeo_id = '1204671530' WHERE grupo_id = 1 AND orden = 1`
    );
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

  await runSafeMigration('Duracion Movilidad Funcional clase 3 a 30min', async () => {
    await pool.execute(
      `UPDATE clases SET duracion = 30 WHERE grupo_id = 1 AND orden = 3`
    );
  });

  await runSafeMigration('Video Movilidad Funcional clase 4', async () => {
    await pool.execute(
      `UPDATE clases SET vimeo_id = '1206606063', disponible = 1
       WHERE grupo_id = 1 AND orden = 4`
    );
  });

  await runSafeMigration('Imagen y descripcion Movilidad Funcional clase 4', async () => {
    await pool.execute(
      `UPDATE clases SET
         imagen = '/images/yoga10.jpg',
         descripcion = 'Trabaja la conexión con el suelo activando tobillos, arcos plantares y la cadena de movimiento que empieza en los pies, recorriendo gemelos, isquiotibiales y cuádriceps hasta la cadera.'
       WHERE grupo_id = 1 AND orden = 4`
    );
  });

  await runSafeMigration('Imagen Movilidad Funcional clase 5', async () => {
    await pool.execute(
      `UPDATE clases SET imagen = '/images/yoga12.jpg' WHERE grupo_id = 1 AND orden = 5`
    );
  });

  await runSafeMigration('Imagen Movilidad Funcional clase 2 yoga2movilidad', async () => {
    await pool.execute(
      `UPDATE clases SET imagen = '/images/yoga2movilidad.jpg' WHERE grupo_id = 1 AND orden = 2`
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

  await runSafeMigration('Tabla travesia_plans', () =>
    pool.query(`
      CREATE TABLE IF NOT EXISTS travesia_plans (
        id         INT AUTO_INCREMENT PRIMARY KEY,
        usuario_id INT NOT NULL UNIQUE,
        plan_type  VARCHAR(10) NOT NULL DEFAULT '3m',
        start_date DATE NOT NULL,
        plan_days  VARCHAR(20) NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `)
  );

  await runSafeMigration('Columna plan_days en travesia_plans', async () => {
    const [[{ cnt }]] = await pool.execute(
      `SELECT COUNT(*) as cnt FROM INFORMATION_SCHEMA.COLUMNS
       WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'travesia_plans' AND COLUMN_NAME = 'plan_days'`
    );
    if (cnt === 0) {
      await pool.query(`ALTER TABLE travesia_plans ADD COLUMN plan_days VARCHAR(20) NULL`);
    }
  });

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

  await runSafeMigration('Seed clases grupo 2 Respiracion Consciente', async () => {
    await pool.execute(`DELETE FROM clases WHERE grupo_id = 2`);
    const clases = [
      ['Volver al aire',                 'Solo observación. Notar cómo respiras cuando nadie te está mirando, sin cambiar nada.',                                         10, 1, '/images/yoga-21.jpg', null, 1],
      ['Alargar el camino de vuelta',    'Exhalar más despacio le dice al cuerpo que puede soltar.',                                                                       12, 1, '/images/yoga-37.jpg', null, 2],
      ['Encontrar el equilibrio',        'Equilibrio entre esfuerzo y descanso, activación y calma.',                                                                      15, 1, '/images/yoga-30.jpg', null, 3],
      ['La respiración como ancla',      'La respiración deja de ser pasiva y se convierte en un punto de apoyo activo, útil también fuera del mat.',                      15, 1, '/images/yoga5.jpg',   null, 4],
      ['El espacio entre respiraciones', 'La quietud no es ausencia de respiración, es un tipo distinto de presencia.',                                                    18, 1, '/images/yoga-18.jpg', null, 5],
    ];
    for (const [titulo, descripcion, duracion, nivel, imagen, vimeo_id, orden] of clases) {
      await pool.execute(
        `INSERT INTO clases (grupo_id, titulo, descripcion, duracion, nivel, imagen, vimeo_id, orden, disponible) VALUES (2, ?, ?, ?, ?, ?, ?, ?, 0)`,
        [titulo, descripcion, duracion, nivel, imagen, vimeo_id, orden]
      );
    }
  });

  await runSafeMigration('Video Movilidad Funcional clase 5', async () => {
    await pool.execute(
      `UPDATE clases SET vimeo_id = '1209957932', disponible = 1
       WHERE grupo_id = 1 AND orden = 5`
    );
  });

  await runSafeMigration('Video Movilidad Funcional clase 5 v2', async () => {
    await pool.execute(
      `UPDATE clases SET vimeo_id = '1209967860', disponible = 1
       WHERE grupo_id = 1 AND orden = 5`
    );
  });

  await runSafeMigration('Video Movilidad Funcional clase 2', async () => {
    await pool.execute(
      `UPDATE clases SET vimeo_id = '1209940701', disponible = 1
       WHERE grupo_id = 1 AND orden = 2`
    );
  });

  await runSafeMigration('Video Movilidad Funcional clase 3 hombros', async () => {
    await pool.execute(
      `UPDATE clases SET vimeo_id = '1209932441', disponible = 1
       WHERE grupo_id = 1 AND orden = 3`
    );
  });

  await runSafeMigration('Imagenes clases 2-5 Respiracion Consciente', async () => {
    await pool.execute(
      `UPDATE clases SET imagen = '/images/respiracionconsciente1.jpg'
       WHERE grupo_id = 2 AND orden IN (2, 3, 4, 5)`
    );
  });

  await runSafeMigration('Imagen clase 1 Respiracion Consciente', async () => {
    await pool.execute(
      `UPDATE clases SET imagen = '/images/respiracionconsciente1.jpg'
       WHERE grupo_id = 2 AND orden = 1`
    );
  });

  await runSafeMigration('Rol admin para paula_ctc@hotmail.es', async () => {
    await pool.execute(
      `UPDATE usuarios SET rol = 'admin' WHERE email = 'paula_ctc@hotmail.es'`
    );
  });

  await runSafeMigration('Seed clases grupo 3 Vinyasa', async () => {
    const [[{ cnt }]] = await pool.execute(
      `SELECT COUNT(*) as cnt FROM clases WHERE grupo_id = 3`
    );
    if (cnt === 0) {
      const clases = [
        ['Del cuerpo al silencio',      'Del cuerpo al silencio: una práctica que va soltando capas hasta llegar a la quietud interior.', 60, 2, '/images/yoga11.jpg', '1206825714', 1, 1],
        ['El regreso constante',        'Una clase para practicar el gesto más honesto del yoga: darte cuenta de que la mente se fue, y volver. Sin culpa, sin esperar quedarte quieta para siempre, solo notar y regresar al cuerpo, una y otra vez, tantas veces como haga falta.', 30, 2, '/images/yoga14.jpg', '1210240715', 2, 1],
      ];
      for (const [titulo, descripcion, duracion, nivel, imagen, vimeo_id, orden, disponible] of clases) {
        await pool.execute(
          `INSERT INTO clases (grupo_id, titulo, descripcion, duracion, nivel, imagen, vimeo_id, orden, disponible) VALUES (3, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [titulo, descripcion, duracion, nivel, imagen, vimeo_id, orden, disponible]
        );
      }
    }
  });

  await runSafeMigration('Usuario admin por defecto', async () => {
    const [rows] = await pool.execute("SELECT id FROM usuarios WHERE rol = 'admin' LIMIT 1");
    if (rows.length === 0) {
      if (!process.env.ADMIN_PASSWORD) {
        console.error('❌  ADMIN_PASSWORD no está configurado — no se creará el usuario admin. Configura esta variable de entorno.');
        return;
      }
      const bcrypt = require('bcryptjs');
      const hashed = await bcrypt.hash(process.env.ADMIN_PASSWORD, 12);
      await pool.execute(
        `INSERT INTO usuarios (nombre, email, password, rol) VALUES (?, ?, ?, 'admin')`,
        ['Admin', process.env.ADMIN_EMAIL || 'admin@yogatierraviva.es', hashed]
      );
      console.log('  -> Admin creado:', process.env.ADMIN_EMAIL || 'admin@yogatierraviva.es');
    }
  });

  await runSafeMigration('Vinyasa clase 3: Fuerza silenciosa', async () => {
    const [[{ cnt }]] = await pool.execute(
      `SELECT COUNT(*) as cnt FROM clases WHERE grupo_id = 3 AND orden = 3`
    );
    if (cnt === 0) {
      await pool.execute(
        `INSERT INTO clases (grupo_id, titulo, descripcion, duracion, nivel, imagen, vimeo_id, orden, disponible)
         VALUES (3, ?, ?, ?, ?, ?, ?, 3, 1)`,
        [
          'Fuerza silenciosa',
          'La fuerza que no necesita hacer ruido: posturas sostenidas con control, para encontrar estabilidad sin tensión de más.',
          40,
          2,
          '/images/yoga14.jpg',
          '1218287865',
        ]
      );
    }
  });

  await runSafeMigration('Imagen Vinyasa clase 3 Fuerza silenciosa yoga25', () =>
    pool.execute(`UPDATE clases SET imagen = '/images/yoga25.jpg' WHERE grupo_id = 3 AND orden = 3`)
  );

  await runSafeMigration('Vinyasa clase 4: Los cimientos en Vinyasa', async () => {
    const [[{ cnt }]] = await pool.execute(
      `SELECT COUNT(*) as cnt FROM clases WHERE grupo_id = 3 AND orden = 4`
    );
    if (cnt === 0) {
      await pool.execute(
        `INSERT INTO clases (grupo_id, titulo, descripcion, duracion, nivel, imagen, vimeo_id, orden, disponible)
         VALUES (3, ?, ?, ?, ?, ?, ?, 4, 1)`,
        [
          'Los cimientos en Vinyasa',
          'Trabaja la cadena de tobillo, rodilla y cadera para construir un enraizamiento sólido en Tadasana, la postura base de la que nacen gran parte de las demás.',
          30,
          2,
          '/images/yoga28.jpg',
          '1221525071',
        ]
      );
    }
  });

  await runSafeMigration('Vinyasa clase 5: Vinyasa construyendo Janu Sirsasana', async () => {
    const [[{ cnt }]] = await pool.execute(
      `SELECT COUNT(*) as cnt FROM clases WHERE grupo_id = 3 AND orden = 5`
    );
    if (cnt === 0) {
      await pool.execute(
        `INSERT INTO clases (grupo_id, titulo, descripcion, duracion, nivel, imagen, vimeo_id, orden, disponible)
         VALUES (3, ?, ?, ?, ?, ?, ?, 5, 1)`,
        [
          'Vinyasa construyendo Janu Sirsasana',
          'Una secuencia que prepara cadera, isquiotibiales y columna para llegar con seguridad a Janu Sirsasana, la flexión hacia la pierna extendida que calma el sistema nervioso y invita a soltar el control.',
          30,
          2,
          '/images/yoga29.jpg',
          '1222049222',
        ]
      );
    }
  });

  await runSafeMigration('Tabla testimonios', () =>
    pool.execute(`
      CREATE TABLE IF NOT EXISTS testimonios (
        id         INT AUTO_INCREMENT PRIMARY KEY,
        nombre     VARCHAR(100) NOT NULL,
        texto      TEXT NOT NULL,
        aprobado   BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_testimonios_aprobado (aprobado)
      )
    `)
  );

  await runSafeMigration('Tabla compras_pack', () =>
    pool.execute(`
      CREATE TABLE IF NOT EXISTS compras_pack (
        id                INT AUTO_INCREMENT PRIMARY KEY,
        usuario_id        INT NOT NULL,
        pack_slug         VARCHAR(50) NOT NULL,
        stripe_session_id VARCHAR(200) NULL,
        importe           DECIMAL(8,2) NOT NULL,
        created_at        TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
        UNIQUE KEY uk_compra_usuario_pack (usuario_id, pack_slug),
        INDEX idx_compras_pack_usuario (usuario_id)
      )
    `)
  );

  await runSafeMigration('Columna last_welcome_msg_index en usuarios', async () => {
    const [[{ cnt }]] = await pool.execute(
      `SELECT COUNT(*) as cnt FROM INFORMATION_SCHEMA.COLUMNS
       WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'usuarios' AND COLUMN_NAME = 'last_welcome_msg_index'`
    );
    if (cnt === 0) {
      await pool.execute(`ALTER TABLE usuarios ADD COLUMN last_welcome_msg_index TINYINT UNSIGNED NOT NULL DEFAULT 0`);
    }
  });

  await runSafeMigration('Tabla blog_posts', () =>
    pool.execute(`
      CREATE TABLE IF NOT EXISTS blog_posts (
        id                 INT AUTO_INCREMENT PRIMARY KEY,
        slug               VARCHAR(200) NOT NULL UNIQUE,
        titulo             VARCHAR(300) NOT NULL,
        resumen            TEXT,
        imagen_portada     VARCHAR(300),
        imagen_portada_alt VARCHAR(300),
        tiempo_lectura     VARCHAR(50),
        contenido          LONGTEXT NOT NULL,
        publicado          BOOLEAN DEFAULT TRUE,
        created_at         TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at         TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_blog_publicado (publicado)
      )
    `)
  );

  // Los 3 artículos vivían como array fijo en frontend/src/data/blogPosts.js
  // (sin CMS). Se migran aquí, una sola vez, para que a partir de ahora se
  // gestionen desde el panel admin.
  await runSafeMigration('Seed blog_posts desde artículos existentes', async () => {
    const [[{ cnt }]] = await pool.execute('SELECT COUNT(*) as cnt FROM blog_posts');
    if (cnt > 0) return;

    const ARTICULOS_INICIALES = [
      {
        slug: 'abhyasa-y-vairagya',
        titulo: 'Abhyasa y Vairagya: la práctica constante y el desapego al resultado',
        resumen: 'Dos palabras sánscritas de los Yoga Sutras que se sostienen mutuamente: la práctica constante y el desapego a los resultados. Por qué un cuerpo diferente cada día no es un problema que resolver, sino el punto de partida real.',
        imagenPortada: '/images/yoga27.jpg',
        imagenPortadaAlt: 'Postura de perro boca abajo, metáfora de la constancia y el desapego al resultado',
        fecha: '2026-08-25',
        tiempoLectura: '7 min de lectura',
        contenido: [
          { tipo: 'parrafo', texto: 'Cada cuerpo que llega a la esterilla es distinto y no solo de una persona a otra, sino del mismo cuerpo de un día para otro. Hoy quizá llega con energía de sobra; mañana, cansado, dolorido, con la cabeza en otro sitio. Eso no es un fallo en tu práctica: es lo normal. Hay dos palabras sánscritas, tan antiguas como los propios Yoga Sutras de Patanjali, que explican por qué esa variación no solo no estorba el camino del yoga, sino que es parte de él: Abhyasa y Vairagya.' },
          { tipo: 'subtitulo', texto: 'Abhyasa — el gesto de volver, una y otra vez' },
          { tipo: 'parrafo', texto: 'Patanjali lo dice en el sutra 1.13: "tatra sthitau yatno\'bhyasah" — el esfuerzo sostenido por permanecer estable es Abhyasa. No es intensidad puntual ni un arranque de motivación de enero: es repetición. El sutra siguiente, el 1.14, lo deja aún más claro: la práctica se afianza de verdad cuando se sostiene mucho tiempo, sin interrupción, y con una actitud sincera hacia ella. Ni un fin de semana de retiro intensivo ni una racha de tres semanas perfectas — es volver, sesión tras sesión, durante meses, durante años, aunque algunos días sean diez minutos y otros una hora entera.' },
          { tipo: 'parrafo', texto: 'Es exactamente lo que trabajamos en "El regreso constante", una de las clases del Pack Raíz: notar que la mente se fue, y volver. Sin culpa. Las veces que haga falta.' },
          { tipo: 'subtitulo', texto: 'Vairagya — soltar el apego a lo que la postura debería ser' },
          { tipo: 'parrafo', texto: 'Si Abhyasa es el esfuerzo de seguir, Vairagya es soltar la necesidad de que ese esfuerzo produzca un resultado concreto. El sutra 1.15 lo define como el dominio de no anhelar aquello que ves o de lo que oyes hablar — en la esterilla, eso se traduce en no perseguir la foto de la postura perfecta, no medir la clase de hoy contra la de la semana pasada, no necesitar que el cuerpo obedezca. Vairagya no es indiferencia ni pasividad: puedes seguir intentando la postura con todo tu esfuerzo y, al mismo tiempo, no necesitar que salga de una manera concreta para que la práctica haya valido la pena.' },
          { tipo: 'subtitulo', texto: 'Por qué van siempre de la mano' },
          { tipo: 'parrafo', texto: 'Patanjali las presenta juntas, en el mismo sutra, por una razón: por separado, cada una se tuerce. Abhyasa sin Vairagya se convierte en exigencia — practicar para conseguir, para lucir, para llegar a algún sitio, y castigarte cuando no llegas. Vairagya sin Abhyasa se convierte en resignación — dejar de intentarlo con la excusa de "total, da igual". Juntas son otra cosa: sigues apareciendo en la esterilla con disciplina real, y sueltas la necesidad de que ese esfuerzo se traduzca en un logro visible. Practicas por practicar. Eso, paradójicamente, es lo que sostiene una práctica durante años, cuando la motivación por sí sola ya se ha agotado mil veces.' },
          { tipo: 'imagen', src: '/images/yoga26.jpg', alt: 'Manos y pies apoyados en la esterilla, detalle del esfuerzo sostenido' },
          { tipo: 'subtitulo', texto: 'Desmitificar la perfección de la asana' },
          { tipo: 'parrafo', texto: 'En el primer artículo de este blog hablé de cómo Patanjali define Asana con solo dos palabras: sthira sukham asanam, estable y cómoda. No dice nada de lo abierta que debe quedar la cadera ni de si el talón toca el suelo. Aun así, es fácil caer en la idea de que existe una "versión correcta" de cada postura y que el objetivo es conquistarla. Esa búsqueda de perfección forzar una flexibilidad que hoy no tienes, sostener una postura más allá de lo que tu cuerpo te pide con tal de completarla es exactamente lo contrario de Vairagya. Adaptar la postura a tu cuerpo, y no tu cuerpo a la postura, no es conformarse: es la práctica misma.' },
          { tipo: 'imagen', src: '/images/yoga18.jpg', alt: 'Práctica sentada en calma junto a la ventana, sin buscar la perfección' },
          { tipo: 'subtitulo', texto: 'Un cuerpo diferente cada día, y eso es lo natural' },
          { tipo: 'parrafo', texto: 'Hay días en los que subes a la esterilla sin energía. Días con una rodilla que avisa, una noche mal dormida, una cabeza que no para. Nada de eso es un obstáculo para la práctica — es la práctica, tal cual se presenta hoy. Abhyasa no pide un cuerpo constante: pide que vuelvas, sea cual sea el cuerpo que traigas. Y Vairagya es lo que te permite volver sin la exigencia de que hoy tenga que parecerse a tu mejor día. Adaptas la postura, bajas la intensidad, a veces simplemente respiras — y eso también cuenta, entero, como práctica.' },
          { tipo: 'subtitulo', texto: 'Lo que se transforma no es solo el cuerpo' },
          { tipo: 'parrafo', texto: 'Practicar así, una y otra vez, sin aferrarte al resultado, tiene un efecto que va mucho más allá de lo físico. Cuando sueltas la necesidad de que cada sesión sea "buena" según algún criterio externo, empiezas a tratarte con la misma paciencia con la que tratarías a alguien que quieres — lo que en psicología se conoce como autocompasión. Con el tiempo, ese gesto repetido de volver sin juzgarte se traslada fuera de la esterilla: a cómo respondes cuando un plan no sale, cuando cometes un error, cuando el día no rinde lo que esperabas. La constancia sin apego no solo cambia la flexibilidad de tus caderas — cambia, poco a poco, la relación que tienes contigo misma.' },
          { tipo: 'parrafo', texto: 'En eso están, en el fondo, todas las clases del Pack Raíz: no en conquistar posturas, sino en sostener la práctica y soltar el resultado, una vez tras otra. Si algún día llegas a la esterilla sin energía, sin flexibilidad, sin ganas, sube igual. Eso también es Abhyasa. Y no le pidas que sea perfecta. Eso es Vairagya.' },
        ],
      },
      {
        slug: 'los-ocho-pasos-de-patanjali',
        titulo: 'Los ocho pasos de Patanjali',
        resumen: 'La postura es solo uno de los ocho escalones del yoga. Un recorrido por el Ashtanga de los Yoga Sutras, de la ética hacia los demás a la unión final.',
        imagenPortada: '/images/montaña.jpeg',
        imagenPortadaAlt: 'Camino ascendente entre montañas, metáfora del sendero del yoga',
        fecha: '2026-08-07',
        tiempoLectura: '7 min de lectura',
        contenido: [
          { tipo: 'parrafo', texto: 'Cuando alguien empieza yoga, casi siempre piensa en el cuerpo: en estirar, en fortalecer, en esa postura que todavía no le sale. Y está bien empezar ahí yo también empecé ahí. Pero hace más de dos mil años, un sabio llamado Patanjali recopiló los Yoga Sutras, un texto breve y denso que describe el yoga no como una serie de posturas, sino como un camino de ocho pasos: el Ashtanga (de "ashta", ocho, y "anga", miembro o escalón). La postura, Asana, es solo el tercero.' },
          { tipo: 'parrafo', texto: 'No hace falta recorrerlos en fila india ni dominar uno para pasar al siguiente en la práctica real se entrelazan. Pero conocerlos ayuda a entender por qué una clase de yoga bien dada no es solo gimnasia con música relajante. Aquí van, uno a uno.' },
          { tipo: 'subtitulo', texto: '1. Yama — cómo te relacionas con lo que te rodea' },
          { tipo: 'parrafo', texto: 'Los Yamas son cinco principios éticos, orientados hacia fuera: Ahimsa (no causar daño), Satya (honestidad), Asteya (no tomar lo que no es tuyo), Brahmacharya (uso consciente de la energía) y Aparigraha (no acumular de más). No son mandamientos abstractos , son preguntas que te puedes hacer en la esterilla: ¿te estás forzando en una postura hasta hacerte daño? Eso también es una falta de Ahimsa, hacia ti misma.' },
          { tipo: 'subtitulo', texto: '2. Niyama — cómo te relacionas contigo misma' },
          { tipo: 'parrafo', texto: 'Si los Yamas miran hacia fuera, los Niyamas miran hacia dentro: Saucha (limpieza, orden), Santosha (contentamiento con lo que hay), Tapas (disciplina, el calor del esfuerzo sostenido), Svadhyaya (autoconocimiento) e Ishvara Pranidhana (entrega a algo más grande que el ego). Practicar con constancia, aunque sea diez minutos, es Tapas. Aceptar el cuerpo que tienes hoy, no el de hace un año, es Santosha.' },
          { tipo: 'subtitulo', texto: '3. Asana — el cuerpo como punto de partida, no de llegada' },
          { tipo: 'parrafo', texto: 'Patanjali define Asana con solo dos palabras: "sthira sukham asanam" la postura debe ser estable y cómoda a la vez. No dice nada de flexibilidad ni de lo bonita que se vea en una foto. Por eso en mis clases insisto tanto en el ajuste: una postura mal alineada no es más yoga por ser más intensa, es simplemente una postura que no va a sostenerte. El cuerpo bien colocado es el que te permite quedarte, respirar, y seguir hacia dentro.' },
          { tipo: 'imagen', src: '/images/avanzadoa1.jpg', alt: 'Postura de yoga con alineación y ajuste preciso' },
          { tipo: 'subtitulo', texto: '4. Pranayama — el puente entre cuerpo y mente' },
          { tipo: 'parrafo', texto: 'Pranayama es la extensión (ayama) de la fuerza vital (prana) a través de la respiración. Es el primer paso que ya no se ve tanto desde fuera ,nadie sabe si estás haciendo Ujjayi o respirando de cualquier manera, pero tú sí lo notas. Es también el puente: mientras el cuerpo se educa con Asana, la respiración empieza a educar a la mente.' },
          { tipo: 'imagen', src: '/images/yogarespiracion.jpg', alt: 'Práctica de respiración consciente, pranayama' },
          { tipo: 'subtitulo', texto: '5. Pratyahara — retirar los sentidos hacia dentro' },
          { tipo: 'parrafo', texto: 'Pratyahara es soltar el enganche automático a lo que entra por los sentidos: el móvil, el ruido, la lista de tareas. No es dejar de sentir, es dejar de perseguir cada estímulo. Es ese momento, al final de una práctica, en que cierras los ojos y por fin no hace falta mirar nada más.' },
          { tipo: 'subtitulo', texto: '6. Dharana — la concentración' },
          { tipo: 'parrafo', texto: 'Con los sentidos ya no tirando hacia fuera, Dharana es posar la atención en un solo punto , la respiración, una vela, una palabra  y sostenerla ahí. Suena sencillo y es, para la mayoría, lo más difícil de los ocho pasos. La mente se va. Se nota. Se vuelve. Se va otra vez.' },
          { tipo: 'subtitulo', texto: '7. Dhyana — la meditación' },
          { tipo: 'parrafo', texto: 'Cuando esa concentración deja de necesitar esfuerzo y se sostiene sola, sin que tengas que traerla de vuelta constantemente, eso es Dhyana. No es un estado especial reservado a unos pocos: es lo que ocurre, a veces sin que te des cuenta, en algún tramo de una práctica larga y bien construida.' },
          { tipo: 'subtitulo', texto: '8. Samadhi — la unión' },
          { tipo: 'parrafo', texto: 'El último paso, Samadhi, es la disolución de la distancia entre quien observa y lo observado. Es difícil de describir con palabras porque, por definición, ahí ya no hay un "yo" narrando la experiencia. Patanjali lo señala como la meta, pero también deja claro que los ocho pasos son, en realidad, un solo camino continuo — no una escalera que se sube y se abandona.' },
          { tipo: 'imagen', src: '/images/yoga-36.jpg', alt: 'Práctica de yoga en calma, integrando cuerpo y mente' },
          { tipo: 'parrafo', texto: 'En mis clases trabajamos sobre todo los primeros cuatro pasos ,el cuerpo, la ética cotidiana, la respiración  porque son la puerta de entrada real para la mayoría de nosotras. No hace falta llegar a Samadhi para que el yoga funcione: basta con empezar por donde estás, con un ajuste preciso y una respiración que acompañe. Lo demás, si llega, llega solo.' },
        ],
      },
      {
        slug: 'el-ego-espiritual',
        titulo: 'El ego espiritual',
        resumen: 'La práctica también puede convertirse en otro escenario para el ego: comparar, coleccionar posturas, sentirte "más consciente" que los demás. Cómo reconocerlo y volver al cuerpo como maestro.',
        imagenPortada: '/images/yoga24.jpg',
        imagenPortadaAlt: 'Practicante de yoga en equilibrio, trabajando el desapego',
        fecha: '2026-08-07',
        tiempoLectura: '6 min de lectura',
        contenido: [
          { tipo: 'parrafo', texto: 'Hay una paradoja incómoda en cualquier camino de crecimiento personal: la misma práctica que debería aflojar el ego puede convertirse en su escondite favorito. Pasa con el yoga, con la meditación, con cualquier disciplina que hable de "conciencia". En vez de soltar, el ego se disfraza de espiritual y sigue haciendo lo de siempre solo que ahora con incienso.' },
          { tipo: 'subtitulo', texto: 'Cuando la práctica se convierte en otro logro más' },
          { tipo: 'parrafo', texto: 'Lo veo, y lo he vivido: la tentación de medir la práctica como se mide cualquier otra cosa en esta cultura — cuántas posturas dominas, cuántas certificaciones tienes, cuántos años llevas "en el camino". Coleccionar logros espirituales es tan posible como coleccionar cualquier otra cosa. El problema no es progresar, es cuando ese progreso empieza a ser sobre todo una forma de sentirte por encima de quien todavía no llegó ahí.' },
          { tipo: 'subtitulo', texto: 'La espiritualidad como escudo' },
          { tipo: 'parrafo', texto: 'Otra forma, más silenciosa, es usar la espiritualidad para no sentir. "Suelto lo que no puedo controlar", decimos, y a veces es verdadera sabiduría — y otras veces es una manera elegante de no enfadarnos, no llorar, no reconocer que algo nos ha dolido. Cuando la calma se convierte en una máscara para no estar presente con lo difícil, deja de ser calma. Se llama spiritual bypassing, y es más común de lo que parece, sobre todo en quienes llevamos tiempo practicando.' },
          { tipo: 'imagen', src: '/images/yoga22.jpg', alt: 'Práctica de yoga sobre el regreso constante de la atención' },
          { tipo: 'subtitulo', texto: 'Señales para reconocerlo' },
          { tipo: 'parrafo', texto: 'Algunas pistas que a mí me han servido para pillarme a mí misma: juzgar en silencio la práctica de otra persona en clase. Necesitar que alguien note lo mucho que has cambiado. Sentir que ya "sabes" y por eso escuchar menos. Que te cueste especialmente volver a ser principiante en algo — una postura nueva, una conversación difícil — porque tu identidad ya se apoya en no serlo.' },
          { tipo: 'subtitulo', texto: 'Volver al cuerpo como maestro, no como trofeo' },
          { tipo: 'parrafo', texto: 'La forma que he encontrado de trabajar con esto no es dramática: es volver, una y otra vez, al cuerpo tal y como está hoy. El cuerpo no miente ni compara — simplemente está donde está. Cuando la práctica se apoya de verdad en el cuerpo, y no en la idea de quién quieres ser, el ego tiene mucho menos donde agarrarse. Por eso insisto tanto en empezar desde cero cada vez, sin exigencias: no como humillación, sino como el gesto más honesto que existe.' },
          { tipo: 'imagen', src: '/images/yoga23.jpg', alt: 'Yoga Tierra Viva, práctica desde la calma' },
          { tipo: 'parrafo', texto: 'Esto conecta directamente con dos de las clases del Aula: "El regreso constante" practica exactamente ese gesto — notar que la mente se fue, y volver, sin culpa. Y "Desapego en movimiento" trabaja el equilibrio inestable como forma de soltar el apego al resultado. Si el cuerpo cae, no ha fallado: está diciendo la verdad del momento. El ego espiritual no se combate con más disciplina — se disuelve, poco a poco, cada vez que elegimos la verdad del cuerpo por encima de la imagen que queremos dar de nosotras mismas.' },
        ],
      },
    ];

    for (const post of ARTICULOS_INICIALES) {
      await pool.execute(
        `INSERT INTO blog_posts (slug, titulo, resumen, imagen_portada, imagen_portada_alt, tiempo_lectura, contenido, publicado, created_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, TRUE, ?)`,
        [post.slug, post.titulo, post.resumen, post.imagenPortada, post.imagenPortadaAlt, post.tiempoLectura, JSON.stringify(post.contenido), post.fecha]
      );
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

const CONNECTION_ERRORS = new Set(['ECONNRESET', 'ECONNREFUSED', 'PROTOCOL_CONNECTION_LOST', 'ER_CON_COUNT_ERROR']);

async function executeQuery(sql, params = [], retry = true) {
  try {
    const [rows] = await pool.execute(sql, params);
    return { success: true, data: rows };
  } catch (err) {
    if (retry && CONNECTION_ERRORS.has(err.code)) {
      console.warn('Reintentando query tras error de conexión:', err.code);
      return executeQuery(sql, params, false);
    }
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
