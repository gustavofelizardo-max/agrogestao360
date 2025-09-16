const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const axios = require('axios');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;

// Middlewares
app.use(cors());
app.use(express.json());

// SQLite connection
const dbPath = path.join(__dirname, 'agrotech.db');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('❌ Erro ao conectar ao SQLite:', err.message);
  } else {
    console.log('✅ SQLite conectado com sucesso!');
  }
});

// JWT Secret
const JWT_SECRET = 'your-secret-key-change-in-production';

// Sistema de Perfis - Melhores Práticas
const USER_ROLES = {
  ADMIN: 'admin',
  PRODUCER: 'producer', 
  SUPPLIER: 'supplier',
  BUYER: 'buyer',
  MANAGER: 'manager',
  VIEWER: 'viewer'
};

const ROLE_PERMISSIONS = {
  [USER_ROLES.ADMIN]: ['*'], // Todas as permissões
  [USER_ROLES.PRODUCER]: [
    'users.view', 'users.create', 'users.update', 'users.delete',
    'properties.view', 'properties.create', 'properties.update', 'properties.delete',
    'cultures.view', 'cultures.create', 'cultures.update', 'cultures.delete',
    'weather.view', 'alerts.view', 'dashboard.view'
  ],
  [USER_ROLES.MANAGER]: [
    'users.view', 'users.create', 'users.update',
    'properties.view', 'properties.create', 'properties.update',
    'cultures.view', 'cultures.create', 'cultures.update',
    'weather.view', 'alerts.view', 'dashboard.view'
  ],
  [USER_ROLES.SUPPLIER]: [
    'properties.view', 'cultures.view', 'weather.view', 'dashboard.view'
  ],
  [USER_ROLES.BUYER]: [
    'properties.view', 'cultures.view', 'weather.view', 'dashboard.view'
  ],
  [USER_ROLES.VIEWER]: [
    'dashboard.view', 'properties.view', 'cultures.view', 'weather.view'
  ]
};

// Auth middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ success: false, message: 'Token não fornecido' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ success: false, message: 'Token inválido' });
    }
    req.user = user;
    next();
  });
};

// Permission middleware
const checkPermission = (permission) => {
  return (req, res, next) => {
    const userRole = req.user.userType;
    const userPermissions = ROLE_PERMISSIONS[userRole] || [];
    
    if (userPermissions.includes('*') || userPermissions.includes(permission)) {
      next();
    } else {
      return res.status(403).json({ 
        success: false, 
        message: 'Permissão negada. Você não tem acesso a esta funcionalidade.' 
      });
    }
  };
};

// Create tables if they don't exist
const createTables = () => {
  db.serialize(() => {
    // Users table - Melhorada
    db.run(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        user_type TEXT NOT NULL DEFAULT 'viewer',
        status TEXT NOT NULL DEFAULT 'active',
        phone TEXT,
        company TEXT,
        department TEXT,
        last_login DATETIME,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // User Profiles table
    db.run(`
      CREATE TABLE IF NOT EXISTS user_profiles (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER UNIQUE,
        avatar TEXT,
        bio TEXT,
        location TEXT,
        preferences TEXT, -- JSON string
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
      )
    `);

    // Cultures table
    db.run(`
      CREATE TABLE IF NOT EXISTS cultures (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        category TEXT,
        season TEXT,
        cycle_days INTEGER,
        description TEXT,
        user_id INTEGER,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users (id)
      )
    `);

    // Properties table
    db.run(`
      CREATE TABLE IF NOT EXISTS properties (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        owner TEXT,
        cep TEXT,
        address TEXT,
        number TEXT,
        city TEXT,
        neighborhood TEXT,
        state TEXT,
        total_area REAL,
        arable_area REAL,
        legal_reserve REAL,
        main_culture_id INTEGER,
        has_irrigation BOOLEAN DEFAULT 0,
        has_machinery BOOLEAN DEFAULT 0,
        has_storage BOOLEAN DEFAULT 0,
        description TEXT,
        user_id INTEGER,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users (id),
        FOREIGN KEY (main_culture_id) REFERENCES cultures (id)
      )
    `);

    console.log('✅ Tabelas criadas/verificadas com sucesso!');

    // Create default admin user if not exists
    db.get('SELECT * FROM users WHERE email = ?', ['gufeliza@gmail.com'], async (err, row) => {
      if (err) {
        console.error('Erro ao verificar usuário:', err);
        return;
      }

      if (!row) {
        const hashedPassword = await bcrypt.hash('123456', 10);
        db.run(
          'INSERT INTO users (name, email, password, user_type, status, company) VALUES (?, ?, ?, ?, ?, ?)',
          ['Gustavo Felizardo', 'gufeliza@gmail.com', hashedPassword, 'producer', 'active', 'AgroTech'],
          function(err) {
            if (err) {
              console.error('Erro ao criar usuário padrão:', err);
            } else {
              console.log('✅ Usuário padrão criado!');
              
              // Criar perfil para o usuário padrão
              db.run(
                'INSERT INTO user_profiles (user_id, bio, location) VALUES (?, ?, ?)',
                [this.lastID, 'Administrador do sistema AgroTech', 'São Paulo, SP'],
                (err) => {
                  if (err) {
                    console.error('Erro ao criar perfil padrão:', err);
                  } else {
                    console.log('✅ Perfil padrão criado!');
                  }
                }
              );
            }
          }
        );
      }
    });
  });
};

createTables();

// ================== ROTAS DE AUTENTICAÇÃO ==================

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    db.get('SELECT * FROM users WHERE email = ? AND status = ?', [email, 'active'], async (err, user) => {
      if (err) {
        console.error('Erro na consulta:', err);
        return res.status(500).json({
          success: false,
          message: 'Erro interno do servidor'
        });
      }

      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'Credenciais inválidas ou usuário inativo'
        });
      }

      const isValidPassword = await bcrypt.compare(password, user.password);

      if (!isValidPassword) {
        return res.status(401).json({
          success: false,
          message: 'Credenciais inválidas'
        });
      }

      // Atualizar último login
      db.run('UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = ?', [user.id]);

      const token = jwt.sign(
        { 
          userId: user.id, 
          email: user.email, 
          userType: user.user_type 
        },
        JWT_SECRET,
        { expiresIn: '24h' }
      );

      res.json({
        success: true,
        message: 'Login realizado com sucesso!',
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          userType: user.user_type,
          company: user.company
        }
      });
    });

  } catch (error) {
    console.error('Erro no login:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

// ================== ROTAS DE USUÁRIOS ==================

// GET /api/users - Listar usuários
app.get('/api/users', authenticateToken, checkPermission('users.view'), (req, res) => {
  const query = `
    SELECT u.*, p.avatar, p.bio, p.location 
    FROM users u 
    LEFT JOIN user_profiles p ON u.id = p.user_id 
    ORDER BY u.name ASC
  `;
  
  db.all(query, [], (err, rows) => {
    if (err) {
      console.error('Erro ao buscar usuários:', err);
      return res.status(500).json({
        success: false,
        message: 'Erro ao buscar usuários'
      });
    }

    // Remover senhas dos resultados
    const users = rows.map(user => {
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    });

    res.json({
      success: true,
      users: users
    });
  });
});

// POST /api/users - Criar usuário
app.post('/api/users', authenticateToken, checkPermission('users.create'), async (req, res) => {
  try {
    const { name, email, password, user_type, phone, company, department, bio, location } = req.body;

    if (!name?.trim() || !email?.trim() || !password?.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Nome, email e senha são obrigatórios'
      });
    }

    // Validar tipo de usuário
    if (!Object.values(USER_ROLES).includes(user_type)) {
      return res.status(400).json({
        success: false,
        message: 'Tipo de usuário inválido'
      });
    }

    // Verificar se email já existe
    db.get('SELECT id FROM users WHERE email = ?', [email], async (err, existingUser) => {
      if (err) {
        return res.status(500).json({
          success: false,
          message: 'Erro ao verificar email'
        });
      }

      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: 'Email já está em uso'
        });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      db.run(
        `INSERT INTO users (name, email, password, user_type, phone, company, department, status) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [name.trim(), email.trim(), hashedPassword, user_type, phone, company, department, 'active'],
        function(err) {
          if (err) {
            console.error('Erro ao criar usuário:', err);
            return res.status(500).json({
              success: false,
              message: 'Erro ao criar usuário'
            });
          }

          const userId = this.lastID;

          // Criar perfil do usuário
          db.run(
            'INSERT INTO user_profiles (user_id, bio, location) VALUES (?, ?, ?)',
            [userId, bio || '', location || ''],
            (err) => {
              if (err) {
                console.error('Erro ao criar perfil:', err);
              }
            }
          );

          // Buscar usuário criado
          db.get('SELECT * FROM users WHERE id = ?', [userId], (err, newUser) => {
            if (err) {
              return res.status(500).json({
                success: false,
                message: 'Usuário criado, mas erro ao buscar dados'
              });
            }

            const { password, ...userWithoutPassword } = newUser;

            res.status(201).json({
              success: true,
              message: 'Usuário criado com sucesso!',
              user: userWithoutPassword
            });
          });
        }
      );
    });

  } catch (error) {
    console.error('Erro ao criar usuário:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

// PUT /api/users/:id - Atualizar usuário
app.put('/api/users/:id', authenticateToken, checkPermission('users.update'), async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, user_type, phone, company, department, status, bio, location, password } = req.body;

    if (!name?.trim() || !email?.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Nome e email são obrigatórios'
      });
    }

    // Verificar se usuário existe
    db.get('SELECT * FROM users WHERE id = ?', [id], async (err, existingUser) => {
      if (err || !existingUser) {
        return res.status(404).json({
          success: false,
          message: 'Usuário não encontrado'
        });
      }

      // Verificar se email não está em uso por outro usuário
      db.get('SELECT id FROM users WHERE email = ? AND id != ?', [email, id], async (err, emailUser) => {
        if (err) {
          return res.status(500).json({
            success: false,
            message: 'Erro ao verificar email'
          });
        }

        if (emailUser) {
          return res.status(400).json({
            success: false,
            message: 'Email já está em uso por outro usuário'
          });
        }

        let updateQuery = `
          UPDATE users 
          SET name = ?, email = ?, user_type = ?, phone = ?, company = ?, 
              department = ?, status = ?, updated_at = CURRENT_TIMESTAMP
        `;
        let updateParams = [name.trim(), email.trim(), user_type, phone, company, department, status || 'active'];

        // Se senha foi fornecida, incluir na atualização
        if (password && password.trim()) {
          const hashedPassword = await bcrypt.hash(password.trim(), 10);
          updateQuery += ', password = ?';
          updateParams.push(hashedPassword);
        }

        updateQuery += ' WHERE id = ?';
        updateParams.push(id);

        db.run(updateQuery, updateParams, function(err) {
          if (err) {
            console.error('Erro ao atualizar usuário:', err);
            return res.status(500).json({
              success: false,
              message: 'Erro ao atualizar usuário'
            });
          }

          // Atualizar perfil
          db.run(
            'UPDATE user_profiles SET bio = ?, location = ?, updated_at = CURRENT_TIMESTAMP WHERE user_id = ?',
            [bio || '', location || '', id],
            (err) => {
              if (err) {
                console.error('Erro ao atualizar perfil:', err);
              }
            }
          );

          // Buscar usuário atualizado
          db.get(`
            SELECT u.*, p.bio, p.location 
            FROM users u 
            LEFT JOIN user_profiles p ON u.id = p.user_id 
            WHERE u.id = ?
          `, [id], (err, updatedUser) => {
            if (err) {
              return res.status(500).json({
                success: false,
                message: 'Usuário atualizado, mas erro ao buscar dados'
              });
            }

            const { password, ...userWithoutPassword } = updatedUser;

            res.json({
              success: true,
              message: 'Usuário atualizado com sucesso!',
              user: userWithoutPassword
            });
          });
        });
      });
    });

  } catch (error) {
    console.error('Erro ao atualizar usuário:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

// DELETE /api/users/:id - Excluir usuário (soft delete)
app.delete('/api/users/:id', authenticateToken, checkPermission('users.delete'), (req, res) => {
  const { id } = req.params;

  // Não permitir excluir o próprio usuário
  if (parseInt(id) === req.user.userId) {
    return res.status(400).json({
      success: false,
      message: 'Você não pode excluir seu próprio usuário'
    });
  }

  db.run(
    'UPDATE users SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
    ['inactive', id],
    function(err) {
      if (err) {
        console.error('Erro ao excluir usuário:', err);
        return res.status(500).json({
          success: false,
          message: 'Erro ao excluir usuário'
        });
      }

      if (this.changes === 0) {
        return res.status(404).json({
          success: false,
          message: 'Usuário não encontrado'
        });
      }

      res.json({
        success: true,
        message: 'Usuário excluído com sucesso!'
      });
    }
  );
});

// GET /api/user-roles - Listar roles disponíveis
app.get('/api/user-roles', authenticateToken, (req, res) => {
  const roles = Object.entries(USER_ROLES).map(([key, value]) => ({
    key: key,
    value: value,
    permissions: ROLE_PERMISSIONS[value] || []
  }));

  res.json({
    success: true,
    roles: roles
  });
});

// ================== OUTRAS ROTAS EXISTENTES ==================

// Manter todas as rotas de culturas, propriedades, cep, dashboard que já funcionam...
// (código anterior aqui - não alterado)

// GET /api/cultures - Listar culturas
app.get('/api/cultures', authenticateToken, (req, res) => {
  db.all(
    'SELECT * FROM cultures WHERE user_id = ? ORDER BY name ASC',
    [req.user.userId],
    (err, rows) => {
      if (err) {
        console.error('Erro ao buscar culturas:', err);
        return res.status(500).json({
          success: false,
          message: 'Erro ao buscar culturas'
        });
      }

      res.json({
        success: true,
        cultures: rows
      });
    }
  );
});

// POST /api/cultures - Criar cultura
app.post('/api/cultures', authenticateToken, (req, res) => {
  const { name, category, season, cycle_days, description } = req.body;

  if (!name?.trim()) {
    return res.status(400).json({
      success: false,
      message: 'Nome da cultura é obrigatório'
    });
  }

  db.run(
    `INSERT INTO cultures (name, category, season, cycle_days, description, user_id) 
     VALUES (?, ?, ?, ?, ?, ?)`,
    [name.trim(), category, season, cycle_days || null, description, req.user.userId],
    function(err) {
      if (err) {
        console.error('Erro ao criar cultura:', err);
        return res.status(500).json({
          success: false,
          message: 'Erro ao criar cultura'
        });
      }

      db.get(
        'SELECT * FROM cultures WHERE id = ?',
        [this.lastID],
        (err, row) => {
          if (err) {
            console.error('Erro ao buscar cultura criada:', err);
            return res.status(500).json({
              success: false,
              message: 'Erro ao buscar cultura criada'
            });
          }

          res.status(201).json({
            success: true,
            message: 'Cultura criada com sucesso!',
            culture: row
          });
        }
      );
    }
  );
});

// PUT /api/cultures/:id - Atualizar cultura
app.put('/api/cultures/:id', authenticateToken, (req, res) => {
  const { id } = req.params;
  const { name, category, season, cycle_days, description } = req.body;

  if (!name?.trim()) {
    return res.status(400).json({
      success: false,
      message: 'Nome da cultura é obrigatório'
    });
  }

  db.run(
    `UPDATE cultures 
     SET name = ?, category = ?, season = ?, cycle_days = ?, description = ?, updated_at = CURRENT_TIMESTAMP
     WHERE id = ? AND user_id = ?`,
    [name.trim(), category, season, cycle_days || null, description, id, req.user.userId],
    function(err) {
      if (err) {
        console.error('Erro ao atualizar cultura:', err);
        return res.status(500).json({
          success: false,
          message: 'Erro ao atualizar cultura'
        });
      }

      if (this.changes === 0) {
        return res.status(404).json({
          success: false,
          message: 'Cultura não encontrada'
        });
      }

      db.get(
        'SELECT * FROM cultures WHERE id = ?',
        [id],
        (err, row) => {
          if (err) {
            console.error('Erro ao buscar cultura atualizada:', err);
            return res.status(500).json({
              success: false,
              message: 'Erro ao buscar cultura atualizada'
            });
          }

          res.json({
            success: true,
            message: 'Cultura atualizada com sucesso!',
            culture: row
          });
        }
      );
    }
  );
});

// DELETE /api/cultures/:id - Excluir cultura
app.delete('/api/cultures/:id', authenticateToken, (req, res) => {
  const { id } = req.params;

  db.run(
    'DELETE FROM cultures WHERE id = ? AND user_id = ?',
    [id, req.user.userId],
    function(err) {
      if (err) {
        console.error('Erro ao excluir cultura:', err);
        return res.status(500).json({
          success: false,
          message: 'Erro ao excluir cultura'
        });
      }

      if (this.changes === 0) {
        return res.status(404).json({
          success: false,
          message: 'Cultura não encontrada'
        });
      }

      res.json({
        success: true,
        message: 'Cultura excluída com sucesso!'
      });
    }
  );
});

// GET /api/properties - Listar propriedades
app.get('/api/properties', authenticateToken, (req, res) => {
  db.all(
    `SELECT p.*, c.name as culture_name 
     FROM properties p 
     LEFT JOIN cultures c ON p.main_culture_id = c.id 
     WHERE p.user_id = ? 
     ORDER BY p.name ASC`,
    [req.user.userId],
    (err, rows) => {
      if (err) {
        console.error('Erro ao buscar propriedades:', err);
        return res.status(500).json({
          success: false,
          message: 'Erro ao buscar propriedades'
        });
      }

      res.json({
        success: true,
        properties: rows
      });
    }
  );
});

// POST /api/properties - Criar propriedade
app.post('/api/properties', authenticateToken, (req, res) => {
  const { 
    name, owner, cep, address, number, city, neighborhood, state, 
    total_area, arable_area, legal_reserve, main_culture_id, 
    has_irrigation, has_machinery, has_storage, description 
  } = req.body;

  if (!name?.trim()) {
    return res.status(400).json({
      success: false,
      message: 'Nome da propriedade é obrigatório'
    });
  }

  db.run(
    `INSERT INTO properties (
      name, owner, cep, address, number, city, neighborhood, state,
      total_area, arable_area, legal_reserve, main_culture_id, 
      has_irrigation, has_machinery, has_storage, description, user_id
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      name.trim(), owner, cep, address, number, city, neighborhood, state,
      total_area, arable_area, legal_reserve, main_culture_id || null, 
      has_irrigation ? 1 : 0, has_machinery ? 1 : 0, has_storage ? 1 : 0, 
      description, req.user.userId
    ],
    function(err) {
      if (err) {
        console.error('Erro ao criar propriedade:', err);
        return res.status(500).json({
          success: false,
          message: 'Erro ao criar propriedade'
        });
      }

      db.get(
        'SELECT * FROM properties WHERE id = ?',
        [this.lastID],
        (err, row) => {
          if (err) {
            console.error('Erro ao buscar propriedade criada:', err);
            return res.status(500).json({
              success: false,
              message: 'Erro ao buscar propriedade criada'
            });
          }

          res.status(201).json({
            success: true,
            message: 'Propriedade criada com sucesso!',
            property: row
          });
        }
      );
    }
  );
});

// PUT /api/properties/:id - Atualizar propriedade
app.put('/api/properties/:id', authenticateToken, (req, res) => {
  const { id } = req.params;
  const { 
    name, owner, cep, address, number, city, neighborhood, state,
    total_area, arable_area, legal_reserve, main_culture_id, 
    has_irrigation, has_machinery, has_storage, description 
  } = req.body;

  if (!name?.trim()) {
    return res.status(400).json({
      success: false,
      message: 'Nome da propriedade é obrigatório'
    });
  }

  db.run(
    `UPDATE properties 
     SET name = ?, owner = ?, cep = ?, address = ?, number = ?, city = ?, 
         neighborhood = ?, state = ?, total_area = ?, arable_area = ?, 
         legal_reserve = ?, main_culture_id = ?, has_irrigation = ?, 
         has_machinery = ?, has_storage = ?, description = ?, 
         updated_at = CURRENT_TIMESTAMP
     WHERE id = ? AND user_id = ?`,
    [
      name.trim(), owner, cep, address, number, city, neighborhood, state,
      total_area, arable_area, legal_reserve, main_culture_id || null,
      has_irrigation ? 1 : 0, has_machinery ? 1 : 0, has_storage ? 1 : 0,
      description, id, req.user.userId
    ],
    function(err) {
      if (err) {
        console.error('Erro ao atualizar propriedade:', err);
        return res.status(500).json({
          success: false,
          message: 'Erro ao atualizar propriedade'
        });
      }

      if (this.changes === 0) {
        return res.status(404).json({
          success: false,
          message: 'Propriedade não encontrada'
        });
      }

      db.get(
        'SELECT * FROM properties WHERE id = ?',
        [id],
        (err, row) => {
          if (err) {
            console.error('Erro ao buscar propriedade atualizada:', err);
            return res.status(500).json({
              success: false,
              message: 'Erro ao buscar propriedade atualizada'
            });
          }

          res.json({
            success: true,
            message: 'Propriedade atualizada com sucesso!',
            property: row
          });
        }
      );
    }
  );
});

// DELETE /api/properties/:id - Excluir propriedade
app.delete('/api/properties/:id', authenticateToken, (req, res) => {
  const { id } = req.params;

  db.run(
    'DELETE FROM properties WHERE id = ? AND user_id = ?',
    [id, req.user.userId],
    function(err) {
      if (err) {
        console.error('Erro ao excluir propriedade:', err);
        return res.status(500).json({
          success: false,
          message: 'Erro ao excluir propriedade'
        });
      }

      if (this.changes === 0) {
        return res.status(404).json({
          success: false,
          message: 'Propriedade não encontrada'
        });
      }

      res.json({
        success: true,
        message: 'Propriedade excluída com sucesso!'
      });
    }
  );
});

// GET /api/cep/:cep - Buscar dados do CEP
app.get('/api/cep/:cep', async (req, res) => {
  try {
    const { cep } = req.params;
    
    if (!cep || cep.length !== 8) {
      return res.status(400).json({
        success: false,
        message: 'CEP deve ter 8 dígitos'
      });
    }

    const response = await axios.get(`https://viacep.com.br/ws/${cep}/json/`);
    
    if (response.data.erro) {
      return res.status(404).json({
        success: false,
        message: 'CEP não encontrado'
      });
    }

    res.json({
      success: true,
      data: {
        address: response.data.logradouro,
        city: response.data.localidade,
        state: response.data.uf
      }
    });
  } catch (error) {
    console.error('Erro ao buscar CEP:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao buscar dados do CEP'
    });
  }
});

// GET /api/dashboard - Dados do dashboard
app.get('/api/dashboard', authenticateToken, (req, res) => {
  db.get(
    'SELECT COUNT(*) as count, SUM(total_area) as total_area FROM properties WHERE user_id = ?',
    [req.user.userId],
    (err, propertiesResult) => {
      if (err) {
        console.error('Erro ao buscar propriedades do dashboard:', err);
        return res.status(500).json({
          success: false,
          message: 'Erro ao buscar dados do dashboard'
        });
      }

      db.get(
        'SELECT COUNT(*) as count FROM cultures WHERE user_id = ?',
        [req.user.userId],
        (err, culturesResult) => {
          if (err) {
            console.error('Erro ao buscar culturas do dashboard:', err);
            return res.status(500).json({
              success: false,
              message: 'Erro ao buscar dados do dashboard'
            });
          }

          res.json({
            success: true,
            totalProperties: parseInt(propertiesResult.count) || 0,
            cultivatedArea: parseFloat(propertiesResult.total_area) || 0,
            totalCultures: parseInt(culturesResult.count) || 0,
            activeAlerts: 0 // Para implementar depois
          });
        }
      );
    }
  );
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'AgroTech API funcionando com SQLite!',
    timestamp: new Date().toISOString()
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Algo deu errado!'
  });
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n🔄 Fechando servidor...');
  db.close((err) => {
    if (err) {
      console.error('Erro ao fechar banco de dados:', err.message);
    } else {
      console.log('✅ Banco de dados fechado.');
    }
    process.exit(0);
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Servidor AgroTech rodando na porta ${PORT}`);
  console.log(`💾 Usando SQLite - Banco: ${dbPath}`);
  console.log(`📍 Health: http://localhost:${PORT}/api/health`);
  console.log(`🔐 Login: http://localhost:${PORT}/api/auth/login`);
  console.log('✅ Rotas disponíveis:');
  console.log('   📋 CRUD Usuários:');
  console.log('     - GET /api/users');
  console.log('     - POST /api/users');
  console.log('     - PUT /api/users/:id');
  console.log('     - DELETE /api/users/:id');
  console.log('     - GET /api/user-roles');
  console.log('   🌾 CRUD Culturas:');
  console.log('     - GET /api/cultures');
  console.log('     - POST /api/cultures');
  console.log('     - PUT /api/cultures/:id');
  console.log('     - DELETE /api/cultures/:id');
  console.log('   🏡 CRUD Propriedades:');
  console.log('     - GET /api/properties');
  console.log('     - POST /api/properties');
  console.log('     - PUT /api/properties/:id');
  console.log('     - DELETE /api/properties/:id');
  console.log('   🔧 Utilitários:');
  console.log('     - GET /api/cep/:cep');
  console.log('     - GET /api/dashboard');
  console.log('     - POST /api/auth/login');
});
