import { findRecommendedList } from '#server/services/article';

export default defineEventHandler(async () => {
  return findRecommendedList();
});
