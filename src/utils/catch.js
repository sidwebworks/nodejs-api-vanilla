/**
 *
 * @param {() => Promise<void>} controller
 * @returns {import('express').RequestHandler}
 */
export const catchAsync = (controller) => (req, res, next) => {
  controller(req, res, next).catch(next)
}
