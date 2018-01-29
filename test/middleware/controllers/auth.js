
async function authorized(ctx, next) {
  ctx.response.body = 'authorized';

  return next();
}

module.exports = {
  authorized,
};
