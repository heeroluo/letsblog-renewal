export default defineEventHandler((event) => {
  const path = event.path;
  console.info(`[Request] ${new Date().toISOString()} - ${path}`);
});
