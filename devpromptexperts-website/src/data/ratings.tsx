export const rating =  [100, 100, 100, 100, 100]

export default function Stars(rating: number[]): number {
  const totalReviews = rating.reduce((sum, rating) => sum + rating, 0);
  if (totalReviews === 0) return 0;

  const totalScore = rating.reduce((sum, rating, index) => sum + rating * (index + 1), 0);
  return  Math.round((totalScore / totalReviews)*10)/10;
}

