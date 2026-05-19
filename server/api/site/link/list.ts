import { findAll } from '#server/services/link';

export default defineEventHandler(async () => {
  const data = await findAll();
  return data
    ? data.filter((item) => {
        return item.weight > 0;
      })
    : null;
});
