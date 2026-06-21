import { debounce } from "lodash";
import * as Purify from "purify-ts";

const updateHistory = (params: URLSearchParams) => {
  history.replaceState(
    null,
    "",
    window.location.pathname + "?" + params.toString(),
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
  {
    encode,
    decode,
  }: {
    encode: (x: T) => string;
    decode: (x: string) => Purify.Either<string, T>;
  },
): T => {
  const existingParams = new URLSearchParams(window.location.search);
  const existingData = existingParams.get(key);
  if (!existingData) {
    setItem(key, encode(initialValue));
    return initialValue;
  }
  return decode(existingData).orDefault(initialValue);
};

export const remove = (key: string) => {
  const params = new URLSearchParams(window.location.search);
  params.delete(key);
  updateHistory(params);
};
