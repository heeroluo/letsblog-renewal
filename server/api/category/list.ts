import { findAll } from '#server/services/category';

export default defineEventHandler(async () => {
  return (await findAll()).filter((item) => {
    return item.weight > 0;
  });
});
