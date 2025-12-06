// backend/middleware/authorize.js
const authorize = (allowedRoles = []) => {
  return (req, res, next) => {
    // req.user vem do middleware 'authenticate'
    if (!req.user) {
      return res.status(401).json({ message: "Não autenticado." });
    }

    // Se a role do usuário não estiver na lista permitida
    if (!allowedRoles.includes(req.user.user_type)) {
      return res.status(403).json({
        message:
          "Acesso Negado: Você não tem permissão para realizar esta ação.",
      });
    }

    next();
  };
};

module.exports = authorize;
