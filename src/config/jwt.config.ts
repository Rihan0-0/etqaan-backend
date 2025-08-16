export default () => ({
  jwtSecret: process.env.JWT_SECRET || 'defaultSecret',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '1d',
});
