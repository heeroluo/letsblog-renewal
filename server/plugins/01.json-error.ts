export default defineNitroPlugin((nitroApp) => {
  nitroApp.hooks.hook('error', async (error, event) => {
    const evt = event.event;
    if (!evt) {
      return;
    }

    const path = evt.path;
    if (!path?.startsWith('/api/') && !path?.startsWith('/admin/api/')) {
      return;
    }

    const statusCode = (error as any).statusCode || 500;
    const errorResponse = {
      success: false,
      timestamp: new Date().toISOString(),
      code: statusCode,
      message: error.message,
    };

    evt.node.res.setHeader('Content-Type', 'application/json');
    evt.node.res.statusCode = statusCode;
    evt.node.res.end(JSON.stringify(errorResponse));

    return true;
  });
});
