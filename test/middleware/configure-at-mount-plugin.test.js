const { init } = require('../helpers');

const middleware = require('../..');

describe('configure at mount plugin', () => {
  it('plugin option is string middleware = "xxx", should be ok', async () => {
    const { request } = await init({
      apiDoc: './test/middleware/api',
      plugins: {
        middleware: middleware('./test/middleware/controllers'),
      },
    });

    const pets = await request.get('/api/pets');
    const stores = await request.get('/api/stores');

    expect(pets.text).toMatch('find success');
    expect(stores.text).toMatch('authorized and find success');
  });

  it('plugin option is object {middleware}, should be ok', async () => {
    const { request } = await init({
      apiDoc: './test/middleware/api',
      plugins: {
        middleware: middleware({
          middleware: './test/middleware/controllers',
        }),
      },
    });

    const pets = await request.get('/api/pets');
    const stores = await request.get('/api/stores');

    expect(pets.text).toMatch('find success');
    expect(stores.text).toMatch('authorized and find success');
  });

  it('plugin option is object {middlewareDir}, should be ok', async () => {
    const { request } = await init({
      apiDoc: './test/middleware/api',
      plugins: {
        middleware: middleware({
          middlewareDir: './test/middleware/controllers',
        }),
      },
    });

    const pets = await request.get('/api/pets');
    const stores = await request.get('/api/stores');

    expect(pets.text).toMatch('find success');
    expect(stores.text).toMatch('authorized and find success');
  });

  it('plugin option is object {dir}, should be ok', async () => {
    const { request } = await init({
      apiDoc: './test/middleware/api',
      plugins: {
        middleware: middleware({
          dir: './test/middleware/controllers',
        }),
      },
    });

    const pets = await request.get('/api/pets');
    const stores = await request.get('/api/stores');

    expect(pets.text).toMatch('find success');
    expect(stores.text).toMatch('authorized and find success');
  });

  it('plugin option is invalid, should throw error', async () => {
    try {
      await init({
        apiDoc: './test/middleware/api',
        plugins: {
          middleware: middleware(),
        },
      });
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
    }
  });

  it('api doc x-oai-middleware is invalid should load nothing', async () => {
    try {
      await init({
        apiDoc: './test/middleware/api-invalid-load-file-handler',
        plugins: {
          middleware: middleware('./test/middleware/controllers'),
        },
      });
    } catch (error) {
      expect(error.message).toMatch('Cannot find module');
    }
  });

  it('api doc x-oai-middleware is invalid should load nothing1', async () => {
    try {
      await init({
        apiDoc: './test/middleware/api-invalid-load-keywords',
        plugins: {
          middleware: middleware('./test/middleware/controllers'),
        },
      });
    } catch (error) {
      expect(error.message).toMatch('invalid file and handler setted');
    }
  });
});
