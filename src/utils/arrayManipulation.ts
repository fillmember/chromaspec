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
