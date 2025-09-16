const express = require('express');
const router = express.Router();

router.post('/login', (req, res) => {
  const { email, password } = req.body;
  
  if ((email === 'admin@agrotech.com' && password === 'admin123') ||
      (email === 'gufeliza@gmail.com' && password === '123456')) {
    res.json({
      success: true,
      token: 'fake-token-123',
      user: {
        id: 1,
        email: email,
        name: email === 'admin@agrotech.com' ? 'Administrador' : 'Gustavo Felizardo',
        user_type: 'producer',
        profile: 'admin'
      }
    });
  } else {
    res.status(401).json({
      success: false,
      message: 'Email ou senha incorretos'
    });
  }
});

module.exports = router;
