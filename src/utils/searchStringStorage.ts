import { debounce } from "lodash";

const updateHistory = (params: URLSearchParams) => {
  history.replaceState(
    null,
    "",
    window.location.origin + "?" + params.toString(),
  );
};

export const setItem = debounce((key: string, value: string) => {
  const params = new URLSearchParams(window.location.search);
  params.set(key, value);
  updateHistory(params);
}, 100);

export const getItem = <T = unknown>(
  key: string,
  initialValue: T,
  { encode, decode }: { encode: (x: T) => string; decode: (x: string) => T },
) => {
  const existingParams = new URLSearchParams(window.location.search);
  const existingData = existingParams.get(key);
  if (!existingData) {
    setItem(key, encode(initialValue));
    return initialValue;
  }
  return decode(existingData);
};

export const remove = (key: string) => {
  const params = new URLSearchParams(window.location.search);
  params.delete(key);
  updateHistory(params);
};
