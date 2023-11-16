exports.authorization = (...roles) => {
  return (req, res, next) => {
    // roles ['admin', 'lead-guide']. role='user'
    console.log(roles);
    console.log(req.user.role);
    if (!roles.includes(req.user.role)) {
      return next(
        res.status(403).send("Access denied: Only admins can create new users.")
      );
    }
    next();
  };
};
