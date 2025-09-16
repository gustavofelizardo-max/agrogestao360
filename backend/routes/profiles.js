const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.json({ 
    success: true, 
    profiles: [
      { id: 1, name: 'admin', description: 'Administrador' },
      { id: 2, name: 'producer', description: 'Produtor' }
    ] 
  });
});

module.exports = router;
