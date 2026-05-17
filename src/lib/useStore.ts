"use client";

import { useState, useCallback } from "react";

export function useStoreData<T>(loader: () => T): [T, () => void] {
  const [, setVersion] = useState(0);
  const refresh = useCallback(() => setVersion((v) => v + 1), []);
  return [loader(), refresh];
}
