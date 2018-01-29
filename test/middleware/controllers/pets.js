
async function findPets(ctx, next) {
  ctx.response.body = 'find success';
}

async function addPet(ctx, next) {
  ctx.response.body = 'add success';
}

module.exports = {
  findPets,
  addPet,
};
