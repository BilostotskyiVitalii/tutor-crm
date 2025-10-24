import type { NextFunction, Request, Response } from 'express';

import { type DateKeyPredicate, mapTimestampsToISOSelective } from '../utils/serializeDates';

type Options = { keys?: (string | RegExp)[] } | { predicate?: DateKeyPredicate };

const compilePredicate = (opt?: Options): DateKeyPredicate => {
  if (opt && 'predicate' in opt && opt.predicate) {
    return opt.predicate;
  }
  const list = opt && 'keys' in opt && opt.keys ? opt.keys : undefined;
  if (!list) {
    return undefined as unknown as DateKeyPredicate;
  }

  return (_path, key) => {
    return list.some((entry) => (typeof entry === 'string' ? entry === key : entry.test(key)));
  };
};

export const serializeDatesToISO =
  (options?: Options) => (_req: Request, res: Response, next: NextFunction) => {
    const originalJson = res.json.bind(res);
    const isDateKey = compilePredicate(options);

    res.json = (body: unknown) => {
      try {
        const serialized = mapTimestampsToISOSelective(body, isDateKey || undefined);
        return originalJson(serialized);
      } catch {
        return originalJson(body);
      }
    };

    next();
  };
