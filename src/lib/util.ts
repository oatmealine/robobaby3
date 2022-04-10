export function delay(duration: number) {
  return new Promise(function (resolve) {
    setTimeout(resolve.bind(null, null), duration);
  });
}
