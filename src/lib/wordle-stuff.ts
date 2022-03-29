const START_DATE = new Date(2021, 5, 19, 0, 0, 0, 0)
export const getCurrentDayOffset = () => {
  const diff =
    new Date().setHours(0, 0, 0, 0) - new Date(START_DATE).setHours(0, 0, 0, 0)
  return Math.round(diff / 864e5)
}
