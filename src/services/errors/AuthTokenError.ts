export class AuthTokenError extends Error {
  constructor(message?: 'Error with authentication token') {
    super(message);
  }
}
