
async function findStores(ctx, next) {
  ctx.response.body += ' and find success';
}

async function addStore(ctx, next) {
  ctx.response.body += ' and add success';
}

module.exports = {
  findStores,
  addStore,
};
