export function NotFoundError(resource = 'Resource', id = 0) {
  const err = new Error(`${resource} with ID ${id} does not exist`);
  err.status = 404;
  err.code = `NOT_FOUND_${resource.toUpperCase()}`;
  return err;
}

export function DuplicateError(resource = 'Resource', id = 0){
  const err = new Error(`${resource} already exists with ID ${id}`);
  err.status = 409;
  err.code = `CONFLICT_${resource.toUpperCase()}`;
  return err;
}

export function BadRequestError(message = 'Bad request') {
  const err = new Error(message);
  err.status = 400;
  err.code = 'BAD_REQUEST';
  return err;
}

export function UnauthorizedError(message = 'Unauthorized') {
  const err = new Error(message);
  err.status = 401;
  err.code = 'UNAUTHORIZED';
  return err;
}
