import React, { createContext, useContext, useState, useEffect } from 'react';

const LanguageContext = createContext();

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage deve ser usado dentro de um LanguageProvider');
  }
  return context;
};

const translations = {
  pt: {
    // Menu
    'menu.dashboard': 'Dashboard',
    'menu.properties': 'Propriedades',
    'menu.cultures': 'Culturas',
    'menu.weather': 'Clima',
    'menu.alerts': 'Alertas',
    'menu.users': 'Usuários',
    'menu.settings': 'Configurações',

    // Auth
    'auth.login': 'Entrar',
    'auth.logout': 'Sair',
    'auth.logout_success': 'Logout realizado com sucesso!',
    'auth.logging_in': 'Entrando...',
    'auth.welcome': 'Sistema de Gestão Agrícola',
    'auth.email': 'Email',
    'auth.password': 'Senha',
    'auth.email_placeholder': 'seu@email.com',
    'auth.password_placeholder': '••••••••',
    'auth.use_test_credentials': 'Usar credenciais de teste',

    // User Types/Roles
    'user.types.producer': 'Produtor',
    'user.types.supplier': 'Fornecedor',
    'user.types.buyer': 'Comprador',
    'user.types.admin': 'Administrador',
    'user.types.manager': 'Gerente',
    'user.types.viewer': 'Visualizador',

    // Dashboard
    'dashboard.welcome': 'Bem-vindo',
    'dashboard.total_properties': 'Total de Propriedades',
    'dashboard.cultivated_area': 'Área Cultivada',
    'dashboard.total_cultures': 'Culturas Cadastradas',
    'dashboard.active_alerts': 'Alertas Ativos',
    'dashboard.error.load': 'Erro ao carregar dados do dashboard',

    // Common
    'common.loading': 'Carregando...',
    'common.save': 'Salvar',
    'common.update': 'Atualizar',
    'common.cancel': 'Cancelar',
    'common.edit': 'Editar',
    'common.delete': 'Excluir',
    'common.yes': 'Sim',
    'common.no': 'Não',
    'common.required': 'Obrigatório',
    'common.optional': 'Opcional',
    'common.search': 'Buscar',
    'common.filter': 'Filtrar',
    'common.actions': 'Ações',

    // Users Management
    'users.title': 'Gerenciamento de Usuários',
    'users.new': 'Novo Usuário',
    'users.add': 'Adicionar Usuário',
    'users.edit': 'Editar Usuário',
    'users.delete': 'Excluir Usuário',
    'users.profile': 'Perfil do Usuário',
    'users.loading': 'Carregando usuários...',
    'users.no_users': 'Nenhum usuário encontrado',
    'users.search_placeholder': 'Buscar por nome ou email...',
    'users.filter_by_role': 'Filtrar por perfil',
    'users.all_roles': 'Todos os perfis',
    'users.active_users': 'Usuários Ativos',
    'users.inactive_users': 'Usuários Inativos',

    // User Form
    'users.form.name': 'Nome Completo',
    'users.form.name_placeholder': 'Ex: João da Silva',
    'users.form.email': 'Email',
    'users.form.email_placeholder': 'joao@empresa.com',
    'users.form.password': 'Senha',
    'users.form.password_placeholder': '••••••••',
    'users.form.confirm_password': 'Confirmar Senha',
    'users.form.role': 'Perfil de Acesso',
    'users.form.role_placeholder': 'Selecione um perfil',
    'users.form.phone': 'Telefone',
    'users.form.phone_placeholder': '(11) 99999-9999',
    'users.form.company': 'Empresa',
    'users.form.company_placeholder': 'Nome da empresa',
    'users.form.department': 'Departamento',
    'users.form.department_placeholder': 'Ex: Produção',
    'users.form.status': 'Status',
    'users.form.bio': 'Biografia',
    'users.form.bio_placeholder': 'Conte um pouco sobre este usuário...',
    'users.form.location': 'Localização',
    'users.form.location_placeholder': 'Cidade, Estado',

    // User Status
    'users.status.active': 'Ativo',
    'users.status.inactive': 'Inativo',
    'users.status.pending': 'Pendente',
    'users.status.suspended': 'Suspenso',

    // User Actions & Messages
    'users.success.created': 'Usuário criado com sucesso!',
    'users.success.updated': 'Usuário atualizado com sucesso!',
    'users.success.deleted': 'Usuário excluído com sucesso!',
    'users.success.activated': 'Usuário ativado com sucesso!',
    'users.success.deactivated': 'Usuário desativado com sucesso!',
    'users.error.load': 'Erro ao carregar usuários',
    'users.error.create': 'Erro ao criar usuário',
    'users.error.update': 'Erro ao atualizar usuário',
    'users.error.delete': 'Erro ao excluir usuário',
    'users.error.name_required': 'Nome é obrigatório',
    'users.error.email_required': 'Email é obrigatório',
    'users.error.email_invalid': 'Email inválido',
    'users.error.password_required': 'Senha é obrigatória',
    'users.error.password_mismatch': 'Senhas não coincidem',
    'users.error.email_exists': 'Email já está em uso',
    'users.error.cannot_delete_self': 'Você não pode excluir seu próprio usuário',
    'users.confirm.delete': 'Tem certeza que deseja excluir este usuário?',
    'users.confirm.deactivate': 'Tem certeza que deseja desativar este usuário?',

    // User Permissions
    'users.permissions.title': 'Permissões do Perfil',
    'users.permissions.description': 'Este perfil tem acesso às seguintes funcionalidades:',
    'users.permissions.all': 'Acesso total ao sistema',
    'users.permissions.limited': 'Acesso limitado',

    // Settings
    'settings.title': 'Configurações do Sistema',
    'settings.language': 'Idioma',
    'settings.notifications': 'Notificações',
    'settings.api': 'Configurações de API',

    // Cultures
    'cultures.title': 'Gestão de Culturas',
    'cultures.new': 'Nova Cultura',
    'cultures.manage': 'Gerenciar Culturas',
    'cultures.add': 'Adicionar Cultura',
    'cultures.edit': 'Editar Cultura',
    'cultures.form.name': 'Nome da Cultura',
    'cultures.form.category': 'Categoria',
    'cultures.form.season': 'Época de Plantio',
    'cultures.form.cycle': 'Ciclo (dias)',
    'cultures.form.description': 'Descrição',

    // Properties
    'properties.title': 'Gestão de Propriedades',
    'properties.new': 'Nova Propriedade',
    'properties.edit': 'Editar Propriedade',
    'properties.form.name': 'Nome da Propriedade',
    'properties.form.owner': 'Proprietário',
    'properties.form.cep': 'CEP',
    'properties.form.address': 'Endereço',
    'properties.form.number': 'Número',
    'properties.form.city': 'Cidade',
    'properties.form.neighborhood': 'Bairro',
    'properties.form.state': 'UF',
    'properties.form.total_area': 'Área Total (ha)',
    'properties.form.arable_area': 'Área Arável (ha)',
    'properties.form.legal_reserve': 'Reserva Legal (ha)',
    'properties.form.main_cultures': 'Culturas Principais',
    'properties.form.has_irrigation': 'Possui Irrigação',
    'properties.form.has_machinery': 'Possui Maquinário',
    'properties.form.has_storage': 'Possui Armazenamento',
    'properties.form.description': 'Descrição Adicional',
    'properties.search_cep': 'Buscar',

    // Weather
    'weather.title': 'Monitoramento Meteorológico',
    'weather.update': 'Atualizar',
    'weather.updating': 'Atualizando...',
    'weather.humidity': 'Umidade',
    'weather.wind': 'Vento',
    'weather.pressure': 'Pressão',
    'weather.visibility': 'Visibilidade',

    // Alerts
    'alerts.title': 'Alertas e Notificações',
    'alerts.new': 'Novo Alerta'
  },

  en: {
    // Menu
    'menu.dashboard': 'Dashboard',
    'menu.properties': 'Properties',
    'menu.cultures': 'Cultures',
    'menu.weather': 'Weather',
    'menu.alerts': 'Alerts',
    'menu.users': 'Users',
    'menu.settings': 'Settings',

    // Auth
    'auth.login': 'Login',
    'auth.logout': 'Logout',
    'auth.logout_success': 'Logout successful!',
    'auth.logging_in': 'Logging in...',
    'auth.welcome': 'Agricultural Management System',
    'auth.email': 'Email',
    'auth.password': 'Password',
    'auth.email_placeholder': 'your@email.com',
    'auth.password_placeholder': '••••••••',
    'auth.use_test_credentials': 'Use test credentials',

    // User Types/Roles
    'user.types.producer': 'Producer',
    'user.types.supplier': 'Supplier',
    'user.types.buyer': 'Buyer',
    'user.types.admin': 'Administrator',
    'user.types.manager': 'Manager',
    'user.types.viewer': 'Viewer',

    // Dashboard
    'dashboard.welcome': 'Welcome',
    'dashboard.total_properties': 'Total Properties',
    'dashboard.cultivated_area': 'Cultivated Area',
    'dashboard.total_cultures': 'Registered Cultures',
    'dashboard.active_alerts': 'Active Alerts',
    'dashboard.error.load': 'Error loading dashboard data',

    // Common
    'common.loading': 'Loading...',
    'common.save': 'Save',
    'common.update': 'Update',
    'common.cancel': 'Cancel',
    'common.edit': 'Edit',
    'common.delete': 'Delete',
    'common.yes': 'Yes',
    'common.no': 'No',
    'common.required': 'Required',
    'common.optional': 'Optional',
    'common.search': 'Search',
    'common.filter': 'Filter',
    'common.actions': 'Actions',

    // Users Management
    'users.title': 'User Management',
    'users.new': 'New User',
    'users.add': 'Add User',
    'users.edit': 'Edit User',
    'users.delete': 'Delete User',
    'users.profile': 'User Profile',
    'users.loading': 'Loading users...',
    'users.no_users': 'No users found',
    'users.search_placeholder': 'Search by name or email...',
    'users.filter_by_role': 'Filter by role',
    'users.all_roles': 'All roles',
    'users.active_users': 'Active Users',
    'users.inactive_users': 'Inactive Users',

    // User Form
    'users.form.name': 'Full Name',
    'users.form.name_placeholder': 'Ex: John Smith',
    'users.form.email': 'Email',
    'users.form.email_placeholder': 'john@company.com',
    'users.form.password': 'Password',
    'users.form.password_placeholder': '••••••••',
    'users.form.confirm_password': 'Confirm Password',
    'users.form.role': 'Access Role',
    'users.form.role_placeholder': 'Select a role',
    'users.form.phone': 'Phone',
    'users.form.phone_placeholder': '(555) 123-4567',
    'users.form.company': 'Company',
    'users.form.company_placeholder': 'Company name',
    'users.form.department': 'Department',
    'users.form.department_placeholder': 'Ex: Production',
    'users.form.status': 'Status',
    'users.form.bio': 'Biography',
    'users.form.bio_placeholder': 'Tell us about this user...',
    'users.form.location': 'Location',
    'users.form.location_placeholder': 'City, State',

    // User Status
    'users.status.active': 'Active',
    'users.status.inactive': 'Inactive',
    'users.status.pending': 'Pending',
    'users.status.suspended': 'Suspended',

    // User Actions & Messages
    'users.success.created': 'User created successfully!',
    'users.success.updated': 'User updated successfully!',
    'users.success.deleted': 'User deleted successfully!',
    'users.success.activated': 'User activated successfully!',
    'users.success.deactivated': 'User deactivated successfully!',
    'users.error.load': 'Error loading users',
    'users.error.create': 'Error creating user',
    'users.error.update': 'Error updating user',
    'users.error.delete': 'Error deleting user',
    'users.error.name_required': 'Name is required',
    'users.error.email_required': 'Email is required',
    'users.error.email_invalid': 'Invalid email',
    'users.error.password_required': 'Password is required',
    'users.error.password_mismatch': 'Passwords do not match',
    'users.error.email_exists': 'Email is already in use',
    'users.error.cannot_delete_self': 'You cannot delete your own user',
    'users.confirm.delete': 'Are you sure you want to delete this user?',
    'users.confirm.deactivate': 'Are you sure you want to deactivate this user?',

    // User Permissions
    'users.permissions.title': 'Role Permissions',
    'users.permissions.description': 'This role has access to the following features:',
    'users.permissions.all': 'Full system access',
    'users.permissions.limited': 'Limited access',

    // Settings
    'settings.title': 'System Settings',
    'settings.language': 'Language',
    'settings.notifications': 'Notifications',
    'settings.api': 'API Settings',

    // Cultures
    'cultures.title': 'Culture Management',
    'cultures.new': 'New Culture',
    'cultures.manage': 'Manage Cultures',
    'cultures.add': 'Add Culture',
    'cultures.edit': 'Edit Culture',
    'cultures.form.name': 'Culture Name',
    'cultures.form.category': 'Category',
    'cultures.form.season': 'Planting Season',
    'cultures.form.cycle': 'Cycle (days)',
    'cultures.form.description': 'Description',

    // Properties
    'properties.title': 'Property Management',
    'properties.new': 'New Property',
    'properties.edit': 'Edit Property',
    'properties.form.name': 'Property Name',
    'properties.form.owner': 'Owner',
    'properties.form.cep': 'ZIP Code',
    'properties.form.address': 'Address',
    'properties.form.number': 'Number',
    'properties.form.city': 'City',
    'properties.form.neighborhood': 'Neighborhood',
    'properties.form.state': 'State',
    'properties.form.total_area': 'Total Area (ha)',
    'properties.form.arable_area': 'Arable Area (ha)',
    'properties.form.legal_reserve': 'Legal Reserve (ha)',
    'properties.form.main_cultures': 'Main Cultures',
    'properties.form.has_irrigation': 'Has Irrigation',
    'properties.form.has_machinery': 'Has Machinery',
    'properties.form.has_storage': 'Has Storage',
    'properties.form.description': 'Additional Description',
    'properties.search_cep': 'Search',

    // Weather
    'weather.title': 'Weather Monitoring',
    'weather.update': 'Update',
    'weather.updating': 'Updating...',
    'weather.humidity': 'Humidity',
    'weather.wind': 'Wind',
    'weather.pressure': 'Pressure',
    'weather.visibility': 'Visibility',

    // Alerts
    'alerts.title': 'Alerts and Notifications',
    'alerts.new': 'New Alert'
  },

  es: {
    // Menu
    'menu.dashboard': 'Panel',
    'menu.properties': 'Propiedades',
    'menu.cultures': 'Cultivos',
    'menu.weather': 'Clima',
    'menu.alerts': 'Alertas',
    'menu.users': 'Usuarios',
    'menu.settings': 'Configuración',

    // Auth
    'auth.login': 'Ingresar',
    'auth.logout': 'Salir',
    'auth.logout_success': '¡Logout exitoso!',
    'auth.logging_in': 'Ingresando...',
    'auth.welcome': 'Sistema de Gestión Agrícola',
    'auth.email': 'Email',
    'auth.password': 'Contraseña',
    'auth.email_placeholder': 'tu@email.com',
    'auth.password_placeholder': '••••••••',
    'auth.use_test_credentials': 'Usar credenciales de prueba',

    // User Types/Roles
    'user.types.producer': 'Productor',
    'user.types.supplier': 'Proveedor',
    'user.types.buyer': 'Comprador',
    'user.types.admin': 'Administrador',
    'user.types.manager': 'Gerente',
    'user.types.viewer': 'Visualizador',

    // Dashboard
    'dashboard.welcome': 'Bienvenido',
    'dashboard.total_properties': 'Total de Propiedades',
    'dashboard.cultivated_area': 'Área Cultivada',
    'dashboard.total_cultures': 'Cultivos Registrados',
    'dashboard.active_alerts': 'Alertas Activas',
    'dashboard.error.load': 'Error al cargar datos del panel',

    // Common
    'common.loading': 'Cargando...',
    'common.save': 'Guardar',
    'common.update': 'Actualizar',
    'common.cancel': 'Cancelar',
    'common.edit': 'Editar',
    'common.delete': 'Eliminar',
    'common.yes': 'Sí',
    'common.no': 'No',
    'common.required': 'Requerido',
    'common.optional': 'Opcional',
    'common.search': 'Buscar',
    'common.filter': 'Filtrar',
    'common.actions': 'Acciones',

    // Users Management
    'users.title': 'Gestión de Usuarios',
    'users.new': 'Nuevo Usuario',
    'users.add': 'Agregar Usuario',
    'users.edit': 'Editar Usuario',
    'users.delete': 'Eliminar Usuario',
    'users.profile': 'Perfil de Usuario',
    'users.loading': 'Cargando usuarios...',
    'users.no_users': 'No se encontraron usuarios',
    'users.search_placeholder': 'Buscar por nombre o email...',
    'users.filter_by_role': 'Filtrar por rol',
    'users.all_roles': 'Todos los roles',
    'users.active_users': 'Usuarios Activos',
    'users.inactive_users': 'Usuarios Inactivos',

    // User Form
    'users.form.name': 'Nombre Completo',
    'users.form.name_placeholder': 'Ej: Juan Pérez',
    'users.form.email': 'Email',
    'users.form.email_placeholder': 'juan@empresa.com',
    'users.form.password': 'Contraseña',
    'users.form.password_placeholder': '••••••••',
    'users.form.confirm_password': 'Confirmar Contraseña',
    'users.form.role': 'Rol de Acceso',
    'users.form.role_placeholder': 'Seleccionar un rol',
    'users.form.phone': 'Teléfono',
    'users.form.phone_placeholder': '(11) 99999-9999',
    'users.form.company': 'Empresa',
    'users.form.company_placeholder': 'Nombre de la empresa',
    'users.form.department': 'Departamento',
    'users.form.department_placeholder': 'Ej: Producción',
    'users.form.status': 'Estado',
    'users.form.bio': 'Biografía',
    'users.form.bio_placeholder': 'Cuéntanos sobre este usuario...',
    'users.form.location': 'Ubicación',
    'users.form.location_placeholder': 'Ciudad, Estado',

    // User Status
    'users.status.active': 'Activo',
    'users.status.inactive': 'Inactivo',
    'users.status.pending': 'Pendiente',
    'users.status.suspended': 'Suspendido',

    // User Actions & Messages
    'users.success.created': '¡Usuario creado exitosamente!',
    'users.success.updated': '¡Usuario actualizado exitosamente!',
    'users.success.deleted': '¡Usuario eliminado exitosamente!',
    'users.success.activated': '¡Usuario activado exitosamente!',
    'users.success.deactivated': '¡Usuario desactivado exitosamente!',
    'users.error.load': 'Error al cargar usuarios',
    'users.error.create': 'Error al crear usuario',
    'users.error.update': 'Error al actualizar usuario',
    'users.error.delete': 'Error al eliminar usuario',
    'users.error.name_required': 'El nombre es requerido',
    'users.error.email_required': 'El email es requerido',
    'users.error.email_invalid': 'Email inválido',
    'users.error.password_required': 'La contraseña es requerida',
    'users.error.password_mismatch': 'Las contraseñas no coinciden',
    'users.error.email_exists': 'El email ya está en uso',
    'users.error.cannot_delete_self': 'No puedes eliminar tu propio usuario',
    'users.confirm.delete': '¿Estás seguro de que quieres eliminar este usuario?',
    'users.confirm.deactivate': '¿Estás seguro de que quieres desactivar este usuario?',

    // User Permissions
    'users.permissions.title': 'Permisos del Rol',
    'users.permissions.description': 'Este rol tiene acceso a las siguientes funcionalidades:',
    'users.permissions.all': 'Acceso completo al sistema',
    'users.permissions.limited': 'Acceso limitado',

    // Settings
    'settings.title': 'Configuración del Sistema',
    'settings.language': 'Idioma',
    'settings.notifications': 'Notificaciones',
    'settings.api': 'Configuración de API',

    // Cultures
    'cultures.title': 'Gestión de Cultivos',
    'cultures.new': 'Nuevo Cultivo',
    'cultures.manage': 'Gestionar Cultivos',
    'cultures.add': 'Agregar Cultivo',
    'cultures.edit': 'Editar Cultivo',
    'cultures.form.name': 'Nombre del Cultivo',
    'cultures.form.category': 'Categoría',
    'cultures.form.season': 'Época de Siembra',
    'cultures.form.cycle': 'Ciclo (días)',
    'cultures.form.description': 'Descripción',

    // Properties
    'properties.title': 'Gestión de Propiedades',
    'properties.new': 'Nueva Propiedad',
    'properties.edit': 'Editar Propiedad',
    'properties.form.name': 'Nombre de la Propiedad',
    'properties.form.owner': 'Propietario',
    'properties.form.cep': 'Código Postal',
    'properties.form.address': 'Dirección',
    'properties.form.number': 'Número',
    'properties.form.city': 'Ciudad',
    'properties.form.neighborhood': 'Barrio',
    'properties.form.state': 'Estado',
    'properties.form.total_area': 'Área Total (ha)',
    'properties.form.arable_area': 'Área Cultivable (ha)',
    'properties.form.legal_reserve': 'Reserva Legal (ha)',
    'properties.form.main_cultures': 'Cultivos Principales',
    'properties.form.has_irrigation': 'Tiene Riego',
    'properties.form.has_machinery': 'Tiene Maquinaria',
    'properties.form.has_storage': 'Tiene Almacenamiento',
    'properties.form.description': 'Descripción Adicional',
    'properties.search_cep': 'Buscar',

    // Weather
    'weather.title': 'Monitoreo Meteorológico',
    'weather.update': 'Actualizar',
    'weather.updating': 'Actualizando...',
    'weather.humidity': 'Humedad',
    'weather.wind': 'Viento',
    'weather.pressure': 'Presión',
    'weather.visibility': 'Visibilidad',

    // Alerts
    'alerts.title': 'Alertas y Notificaciones',
    'alerts.new': 'Nueva Alerta'
  }
};

const getLanguageFlag = (lang) => {
  switch (lang) {
    case 'pt': return '🇧🇷';
    case 'en': return '🇺🇸';
    case 'es': return '🇪🇸';
    default: return '🇧🇷';
  }
};

const getLanguageLabel = (lang) => {
  switch (lang) {
    case 'pt': return 'Português';
    case 'en': return 'English';
    case 'es': return 'Español';
    default: return 'Português';
  }
};

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem('language') || 'pt';
  });

  useEffect(() => {
    localStorage.setItem('language', language);
  }, [language]);

  const t = (key, fallback = null) => {
    const translation = translations[language]?.[key];
    if (translation) {
      return translation;
    }
    
    const ptTranslation = translations['pt']?.[key];
    if (ptTranslation) {
      return ptTranslation;
    }
    
    if (fallback) {
      return fallback;
    }
    
    // Fallbacks específicos
    switch(key) {
      case 'menu.dashboard': return 'Dashboard';
      case 'menu.properties': return 'Propriedades';
      case 'menu.cultures': return 'Culturas';
      case 'menu.weather': return 'Clima';
      case 'menu.alerts': return 'Alertas';
      case 'menu.users': return 'Usuários';
      case 'menu.settings': return 'Configurações';
      case 'auth.logout': return 'Sair';
      case 'user.types.producer': return 'Produtor';
      case 'users.title': return 'Gerenciamento de Usuários';
      case 'users.new': return 'Novo Usuário';
      case 'common.loading': return 'Carregando...';
      default: return key;
    }
  };

  const cycleLanguage = () => {
    const languages = ['pt', 'en', 'es'];
    const currentIndex = languages.indexOf(language);
    const nextIndex = (currentIndex + 1) % languages.length;
    setLanguage(languages[nextIndex]);
  };

  const changeLanguage = (lang) => {
    if (translations[lang]) {
      setLanguage(lang);
    }
  };

  const value = {
    language,
    setLanguage: changeLanguage,
    cycleLanguage,
    t,
    getLanguageFlag,
    getLanguageLabel,
    availableLanguages: Object.keys(translations)
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

export default LanguageContext;
