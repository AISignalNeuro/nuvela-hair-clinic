// Every successful response has the shape { status: "ok", data, meta? }.
export function ok(res, data, meta) {
  return res.json(meta ? { status: "ok", data, meta } : { status: "ok", data });
}

export function created(res, data) {
  return res.status(201).json({ status: "ok", data });
}

export function noContent(res) {
  return res.status(204).end();
}
