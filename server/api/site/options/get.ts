import { findOne } from '#server/services/options';

export default defineEventHandler(() => {
  return findOne();
});
