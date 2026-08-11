jest.mock('../../utils/jwt');
const { verifyAccessToken } = require('../../utils/jwt');
const authGuard = require('../authGuard.middleware');

describe('authGuard middleware', () => {
  let req, res, next;

  beforeEach(() => {
    req = { headers: {} };
    res = {};
    next = jest.fn(); // mock
    jest.clearAllMocks();
  });

  it('should throw when authorization header is missing', () => {
    expect(() => authGuard(req, res, next)).toThrow('Authentication required');
  });

  it('should call next when the token is valid', () => {
    const payload = { id: 123 };
    const token = 'valid-token';
    req.headers.authorization = `Bearer ${token}`;
    verifyAccessToken.mockReturnValue(payload); // === jest.fn()

    authGuard(req, res, next);

    expect(next).toHaveBeenCalled();
    expect(req.user).toEqual(payload);
    expect(verifyAccessToken).toHaveBeenCalledWith(token);
  });
});

// TDD
