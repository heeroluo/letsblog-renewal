export default defineEventHandler(async () => {
  const now = new Date();
  return {
    ts: now.getTime(),
    currentYear: now.getFullYear(),
  };
});
