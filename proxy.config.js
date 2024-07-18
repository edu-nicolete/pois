const proxy = [
    {
      context: '/*',
      target: 'https://challenge-backend.mobi7.io',
      pathRewrite: {'^/*' : ''}
    }
  ];
  module.exports = proxy;