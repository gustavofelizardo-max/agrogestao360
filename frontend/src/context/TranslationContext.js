import React, { createContext, useContext, useState, useEffect } from 'react';

// Criar o contexto
const TranslationContext = createContext();

// Traduções completas
const translations = {
  pt: {
    // Menu
    'menu.dashboard': 'Dashboard',
    'menu.properties': 'Propriedades',
    'menu.cultures': 'Culturas',
    'menu.predictive': 'Análise Preditiva',
    'menu.supplies': 'Central de Insumos',
    'menu.shopping': 'Central de Compras',
    'menu.reports': 'Relatórios',
    'menu.settings': 'Configurações',
    'menu.logout': 'Sair',

    // Auth
    'auth.welcome': 'Bem-vindo ao AgroGestão',
    'auth.subtitle': 'Sistema de Gestão Agrícola',
    'auth.email': 'Email',
    'auth.password': 'Senha',
    'auth.email_placeholder': 'seu@email.com',
    'auth.password_placeholder': '••••••••',
    'auth.login': 'Entrar',
    'auth.logging_in': 'Entrando...',
    'auth.logout': 'Sair',
    'auth.logout_confirm': 'Tem certeza que deseja sair?',

    // Dashboard
    'dashboard.welcome': 'Bem-vindo',
    'dashboard.total_properties': 'Total de Propriedades',
    'dashboard.cultivated_area': 'Área Cultivada',
    'dashboard.total_cultures': 'Culturas Registradas',
    'dashboard.active_alerts': 'Alertas Ativos',
    'dashboard.recent_activities': 'Atividades Recentes',
    'dashboard.weather_forecast': 'Previsão do Tempo',
    'dashboard.market_prices': 'Preços de Mercado',
    'dashboard.productivity_chart': 'Gráfico de Produtividade',

    // Properties
    'properties.title': 'Gestão de Propriedades',
    'properties.new': 'Nova Propriedade',
    'properties.edit': 'Editar Propriedade',
    'properties.delete': 'Excluir Propriedade',
    'properties.search': 'Buscar propriedades...',
    'properties.no_results': 'Nenhuma propriedade encontrada',
    'properties.form.name': 'Nome da Propriedade',
    'properties.form.address': 'Endereço',
    'properties.form.cep': 'CEP',
    'properties.form.city': 'Cidade',
    'properties.form.state': 'Estado',
    'properties.form.area': 'Área Total (hectares)',
    'properties.form.cultivated_area': 'Área Cultivada (hectares)',

    // Cultures
    'cultures.title': 'Gestão de Culturas',
    'cultures.new': 'Nova Cultura',
    'cultures.edit': 'Editar Cultura',
    'cultures.delete': 'Excluir Cultura',
    'cultures.search': 'Buscar culturas...',
    'cultures.form.name': 'Nome da Cultura',
    'cultures.form.variety': 'Variedade',
    'cultures.form.planting_date': 'Data de Plantio',
    'cultures.form.harvest_date': 'Data de Colheita',
    'cultures.form.area': 'Área Plantada',
    'cultures.form.property': 'Propriedade',

    // Profiles
    'profiles.title': 'Perfis e Permissões',
    'profiles.users': 'usuários',
    'profiles.permissions': 'permissões',
    'profiles.manage_permissions': 'Gerenciar Permissões',
    'profiles.permissions_for': 'Permissões para',

    // Users
    'users.title': 'Gerenciamento de Usuários',
    'users.subtitle': 'Gerencie usuários e suas permissões',
    'users.new': 'Novo Usuário',
    'users.edit': 'Editar Usuário',
    'users.loading': 'Carregando usuários...',
    'users.no_users': 'Nenhum usuário encontrado',
    'users.search_placeholder': 'Buscar por nome ou email...',
    'users.all_roles': 'Todos os perfis',
    'users.active': 'Ativo',
    'users.inactive': 'Inativo',

    // User Form
    'users.form.name': 'Nome Completo',
    'users.form.name_placeholder': 'João Silva',
    'users.form.email': 'Email',
    'users.form.email_placeholder': 'joao@empresa.com',
    'users.form.password': 'Senha',
    'users.form.profile': 'Perfil',
    'users.form.select_profile': 'Selecione um perfil',
    'users.form.phone': 'Telefone',
    'users.form.company': 'Empresa',
    'users.form.company_placeholder': 'Nome da empresa',
    'users.form.city': 'Cidade',
    'users.form.city_placeholder': 'São Paulo',
    'users.form.state': 'Estado',

    // User Types
    'user.types.admin': 'Administrador',
    'user.types.producer': 'Produtor',
    'user.types.manager': 'Gerente',
    'user.types.supplier': 'Fornecedor',
    'user.types.buyer': 'Comprador',
    'user.types.viewer': 'Visualizador',

    // Common
    'common.save': 'Salvar',
    'common.update': 'Atualizar',
    'common.cancel': 'Cancelar',
    'common.edit': 'Editar',
    'common.delete': 'Excluir',
    'common.close': 'Fechar',
    'common.search': 'Buscar',
    'common.filter': 'Filtrar',
    'common.actions': 'Ações',
    'common.loading': 'Carregando...',
    'common.error': 'Erro',
    'common.success': 'Sucesso',
    'common.confirm': 'Confirmar',
    'common.yes': 'Sim',
    'common.no': 'Não',
    'common.all': 'Todos',
    'common.active': 'Ativo',
    'common.inactive': 'Inativo',
    'common.back': 'Voltar',
    'common.next': 'Próximo',
    'common.previous': 'Anterior',
    'common.export': 'Exportar',
    'common.import': 'Importar',
    'common.download': 'Baixar',
    'common.upload': 'Enviar',

    // Messages
    'message.confirm_delete': 'Tem certeza que deseja excluir?',
    'message.delete_success': 'Excluído com sucesso',
    'message.save_success': 'Salvo com sucesso',
    'message.update_success': 'Atualizado com sucesso',
    'message.error_generic': 'Ocorreu um erro. Tente novamente.',
    'message.required_fields': 'Preencha todos os campos obrigatórios',
  },
  
  en: {
    // Menu
    'menu.dashboard': 'Dashboard',
    'menu.properties': 'Properties',
    'menu.cultures': 'Cultures',
    'menu.predictive': 'Predictive Analysis',
    'menu.supplies': 'Supplies Center',
    'menu.shopping': 'Shopping Center',
    'menu.reports': 'Reports',
    'menu.settings': 'Settings',
    'menu.logout': 'Logout',

    // Auth
    'auth.welcome': 'Welcome to AgroGestão',
    'auth.subtitle': 'Agricultural Management System',
    'auth.email': 'Email',
    'auth.password': 'Password',
    'auth.email_placeholder': 'your@email.com',
    'auth.password_placeholder': '••••••••',
    'auth.login': 'Sign In',
    'auth.logging_in': 'Signing in...',
    'auth.logout': 'Logout',
    'auth.logout_confirm': 'Are you sure you want to logout?',

    // Dashboard
    'dashboard.welcome': 'Welcome',
    'dashboard.total_properties': 'Total Properties',
    'dashboard.cultivated_area': 'Cultivated Area',
    'dashboard.total_cultures': 'Registered Cultures',
    'dashboard.active_alerts': 'Active Alerts',
    'dashboard.recent_activities': 'Recent Activities',
    'dashboard.weather_forecast': 'Weather Forecast',
    'dashboard.market_prices': 'Market Prices',
    'dashboard.productivity_chart': 'Productivity Chart',

    // Properties
    'properties.title': 'Property Management',
    'properties.new': 'New Property',
    'properties.edit': 'Edit Property',
    'properties.delete': 'Delete Property',
    'properties.search': 'Search properties...',
    'properties.no_results': 'No properties found',
    'properties.form.name': 'Property Name',
    'properties.form.address': 'Address',
    'properties.form.cep': 'ZIP Code',
    'properties.form.city': 'City',
    'properties.form.state': 'State',
    'properties.form.area': 'Total Area (hectares)',
    'properties.form.cultivated_area': 'Cultivated Area (hectares)',

    // Cultures
    'cultures.title': 'Culture Management',
    'cultures.new': 'New Culture',
    'cultures.edit': 'Edit Culture',
    'cultures.delete': 'Delete Culture',
    'cultures.search': 'Search cultures...',
    'cultures.form.name': 'Culture Name',
    'cultures.form.variety': 'Variety',
    'cultures.form.planting_date': 'Planting Date',
    'cultures.form.harvest_date': 'Harvest Date',
    'cultures.form.area': 'Planted Area',
    'cultures.form.property': 'Property',

    // Profiles
    'profiles.title': 'Profiles and Permissions',
    'profiles.users': 'users',
    'profiles.permissions': 'permissions',
    'profiles.manage_permissions': 'Manage Permissions',
    'profiles.permissions_for': 'Permissions for',

    // Users
    'users.title': 'User Management',
    'users.subtitle': 'Manage users and their permissions',
    'users.new': 'New User',
    'users.edit': 'Edit User',
    'users.loading': 'Loading users...',
    'users.no_users': 'No users found',
    'users.search_placeholder': 'Search by name or email...',
    'users.all_roles': 'All profiles',
    'users.active': 'Active',
    'users.inactive': 'Inactive',

    // User Form
    'users.form.name': 'Full Name',
    'users.form.name_placeholder': 'John Doe',
    'users.form.email': 'Email',
    'users.form.email_placeholder': 'john@company.com',
    'users.form.password': 'Password',
    'users.form.profile': 'Profile',
    'users.form.select_profile': 'Select a profile',
    'users.form.phone': 'Phone',
    'users.form.company': 'Company',
    'users.form.company_placeholder': 'Company name',
    'users.form.city': 'City',
    'users.form.city_placeholder': 'São Paulo',
    'users.form.state': 'State',

    // User Types
    'user.types.admin': 'Administrator',
    'user.types.producer': 'Producer',
    'user.types.manager': 'Manager',
    'user.types.supplier': 'Supplier',
    'user.types.buyer': 'Buyer',
    'user.types.viewer': 'Viewer',

    // Common
    'common.save': 'Save',
    'common.update': 'Update',
    'common.cancel': 'Cancel',
    'common.edit': 'Edit',
    'common.delete': 'Delete',
    'common.close': 'Close',
    'common.search': 'Search',
    'common.filter': 'Filter',
    'common.actions': 'Actions',
    'common.loading': 'Loading...',
    'common.error': 'Error',
    'common.success': 'Success',
    'common.confirm': 'Confirm',
    'common.yes': 'Yes',
    'common.no': 'No',
    'common.all': 'All',
    'common.active': 'Active',
    'common.inactive': 'Inactive',
    'common.back': 'Back',
    'common.next': 'Next',
    'common.previous': 'Previous',
    'common.export': 'Export',
    'common.import': 'Import',
    'common.download': 'Download',
    'common.upload': 'Upload',

    // Messages
    'message.confirm_delete': 'Are you sure you want to delete?',
    'message.delete_success': 'Successfully deleted',
    'message.save_success': 'Successfully saved',
    'message.update_success': 'Successfully updated',
    'message.error_generic': 'An error occurred. Please try again.',
    'message.required_fields': 'Please fill in all required fields',
  },
  
  es: {
    // Menu
    'menu.dashboard': 'Panel de Control',
    'menu.properties': 'Propiedades',
    'menu.cultures': 'Cultivos',
    'menu.predictive': 'Análisis Predictivo',
    'menu.supplies': 'Central de Insumos',
    'menu.shopping': 'Central de Compras',
    'menu.reports': 'Informes',
    'menu.settings': 'Configuración',
    'menu.logout': 'Salir',

    // Auth
    'auth.welcome': 'Bienvenido a AgroGestão',
    'auth.subtitle': 'Sistema de Gestión Agrícola',
    'auth.email': 'Email',
    'auth.password': 'Contraseña',
    'auth.email_placeholder': 'tu@email.com',
    'auth.password_placeholder': '••••••••',
    'auth.login': 'Ingresar',
    'auth.logging_in': 'Ingresando...',
    'auth.logout': 'Salir',
    'auth.logout_confirm': '¿Estás seguro de que quieres salir?',

    // Dashboard
    'dashboard.welcome': 'Bienvenido',
    'dashboard.total_properties': 'Total de Propiedades',
    'dashboard.cultivated_area': 'Área Cultivada',
    'dashboard.total_cultures': 'Cultivos Registrados',
    'dashboard.active_alerts': 'Alertas Activas',
    'dashboard.recent_activities': 'Actividades Recientes',
    'dashboard.weather_forecast': 'Pronóstico del Tiempo',
    'dashboard.market_prices': 'Precios del Mercado',
    'dashboard.productivity_chart': 'Gráfico de Productividad',

    // Properties
    'properties.title': 'Gestión de Propiedades',
    'properties.new': 'Nueva Propiedad',
    'properties.edit': 'Editar Propiedad',
    'properties.delete': 'Eliminar Propiedad',
    'properties.search': 'Buscar propiedades...',
    'properties.no_results': 'No se encontraron propiedades',
    'properties.form.name': 'Nombre de la Propiedad',
    'properties.form.address': 'Dirección',
    'properties.form.cep': 'Código Postal',
    'properties.form.city': 'Ciudad',
    'properties.form.state': 'Estado',
    'properties.form.area': 'Área Total (hectáreas)',
    'properties.form.cultivated_area': 'Área Cultivada (hectáreas)',

    // Cultures
    'cultures.title': 'Gestión de Cultivos',
    'cultures.new': 'Nuevo Cultivo',
    'cultures.edit': 'Editar Cultivo',
    'cultures.delete': 'Eliminar Cultivo',
    'cultures.search': 'Buscar cultivos...',
    'cultures.form.name': 'Nombre del Cultivo',
    'cultures.form.variety': 'Variedad',
    'cultures.form.planting_date': 'Fecha de Siembra',
    'cultures.form.harvest_date': 'Fecha de Cosecha',
    'cultures.form.area': 'Área Plantada',
    'cultures.form.property': 'Propiedad',

    // Profiles
    'profiles.title': 'Perfiles y Permisos',
    'profiles.users': 'usuarios',
    'profiles.permissions': 'permisos',
    'profiles.manage_permissions': 'Gestionar Permisos',
    'profiles.permissions_for': 'Permisos para',

    // Users
    'users.title': 'Gestión de Usuarios',
    'users.subtitle': 'Gestiona usuarios y sus permisos',
    'users.new': 'Nuevo Usuario',
    'users.edit': 'Editar Usuario',
    'users.loading': 'Cargando usuarios...',
    'users.no_users': 'No se encontraron usuarios',
    'users.search_placeholder': 'Buscar por nombre o email...',
    'users.all_roles': 'Todos los perfiles',
    'users.active': 'Activo',
    'users.inactive': 'Inactivo',

    // User Form
    'users.form.name': 'Nombre Completo',
    'users.form.name_placeholder': 'Juan Pérez',
    'users.form.email': 'Email',
    'users.form.email_placeholder': 'juan@empresa.com',
    'users.form.password': 'Contraseña',
    'users.form.profile': 'Perfil',
    'users.form.select_profile': 'Selecciona un perfil',
    'users.form.phone': 'Teléfono',
    'users.form.company': 'Empresa',
    'users.form.company_placeholder': 'Nombre de la empresa',
    'users.form.city': 'Ciudad',
    'users.form.city_placeholder': 'São Paulo',
    'users.form.state': 'Estado',

    // User Types
    'user.types.admin': 'Administrador',
    'user.types.producer': 'Productor',
    'user.types.manager': 'Gerente',
    'user.types.supplier': 'Proveedor',
    'user.types.buyer': 'Comprador',
    'user.types.viewer': 'Visualizador',

    // Common
    'common.save': 'Guardar',
    'common.update': 'Actualizar',
    'common.cancel': 'Cancelar',
    'common.edit': 'Editar',
    'common.delete': 'Eliminar',
    'common.close': 'Cerrar',
    'common.search': 'Buscar',
    'common.filter': 'Filtrar',
    'common.actions': 'Acciones',
    'common.loading': 'Cargando...',
    'common.error': 'Error',
    'common.success': 'Éxito',
    'common.confirm': 'Confirmar',
    'common.yes': 'Sí',
    'common.no': 'No',
    'common.all': 'Todos',
    'common.active': 'Activo',
    'common.inactive': 'Inactivo',
    'common.back': 'Atrás',
    'common.next': 'Siguiente',
    'common.previous': 'Anterior',
    'common.export': 'Exportar',
    'common.import': 'Importar',
    'common.download': 'Descargar',
    'common.upload': 'Subir',

    // Messages
    'message.confirm_delete': '¿Estás seguro de que quieres eliminar?',
    'message.delete_success': 'Eliminado exitosamente',
    'message.save_success': 'Guardado exitosamente',
    'message.update_success': 'Actualizado exitosamente',
    'message.error_generic': 'Ocurrió un error. Por favor intenta de nuevo.',
    'message.required_fields': 'Por favor complete todos los campos requeridos',
  }
};

// Provider Component
export const TranslationProvider = ({ children }) => {
  const [language, setLanguage] = useState('pt');

  // Carregar idioma salvo no localStorage
  useEffect(() => {
    const savedLanguage = localStorage.getItem('language');
    if (savedLanguage && translations[savedLanguage]) {
      setLanguage(savedLanguage);
    }
  }, []);

  // Salvar idioma quando mudar
  const changeLanguage = (newLanguage) => {
    if (translations[newLanguage]) {
      setLanguage(newLanguage);
      localStorage.setItem('language', newLanguage);
    }
  };

  // Função de tradução
  const t = (key) => {
    return translations[language]?.[key] || translations['pt']?.[key] || key;
  };

  const value = {
    language,
    setLanguage: changeLanguage,
    t,
    languages: [
      { code: 'pt', name: 'Português', flag: '🇧🇷' },
      { code: 'en', name: 'English', flag: '🇺🇸' },
      { code: 'es', name: 'Español', flag: '🇪🇸' }
    ]
  };

  return (
    <TranslationContext.Provider value={value}>
      {children}
    </TranslationContext.Provider>
  );
};

// Hook para usar as traduções
export const useTranslation = () => {
  const context = useContext(TranslationContext);
  if (!context) {
    throw new Error('useTranslation deve ser usado dentro de TranslationProvider');
  }
  return context;
};
