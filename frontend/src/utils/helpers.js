export const computeTotal = (arr) => {
  const sum = arr?.reduce(add, 0) // with initial value to avoid when the array is empty

  function add(accumulator, a) {
    return accumulator + a
  }
  return sum
}
