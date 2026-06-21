import { produce } from "immer";

export function setItemAtIndex<T>(
  array: T[],
  index: number,
  partialData: Partial<T>,
) {
  return produce<T[]>(array, (draftState) => {
    draftState[index] = {
      ...draftState[index],
      ...partialData,
    };
  });
}

export function deleteItemAtIndex<T>(array: T[], index: number) {
  return produce<T[]>(array, (draftState) => {
    draftState.splice(index, 1);
  });
}

export function setItemById<T extends { id: string }>(
  array: T[],
  id: string,
  partialData: Partial<T>,
) {
  return produce<T[]>(array, (draftState) => {
    const i = draftState.findIndex((item) => item.id === id);
    if (i !== -1) Object.assign(draftState[i], partialData);
  });
}

export function deleteItemById<T extends { id: string }>(
  array: T[],
  id: string,
) {
  return produce<T[]>(array, (draftState) => {
    const i = draftState.findIndex((item) => item.id === id);
    if (i !== -1) draftState.splice(i, 1);
  });
}
