exports.DATABASE_URL = process.env.DATABASE_URL ||
                       global.DATABASE_URL ||
                      'mongodb://localhost/woofle';
exports.PORT = process.env.PORT || 8080;
exports.JWT_SECRET_KEY = 'donottellanyone';
