const canAccessUpdateUserById = (req) => {
  // either admin or current user themself
  if (!req.user) {
    throw new ForbiddenException('Insufficient permissions');
  }
  if (req.user.accountType === 'admin') {
    return true;
  }
  if (req.user.id === req.params.id) {
    return true;
  }
  throw new ForbiddenException('Insufficient permissions');
};
