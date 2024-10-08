const nextAuth = jest.requireActual('next-auth/react');

module.exports = {
  ...nextAuth,
  useSession: jest.fn(() => {
    return { data: null, status: 'unauthenticated' }; 
  }),
};