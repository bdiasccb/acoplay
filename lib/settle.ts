/** Para seções que podem falhar sozinhas sem derrubar a página inteira. */
export async function settle<T>(promise: Promise<T>): Promise<T | null> {
  try {
    return await promise;
  } catch (error) {
    console.error(error);
    return null;
  }
}
