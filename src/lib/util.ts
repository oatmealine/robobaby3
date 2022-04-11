export function delay(duration: number) {
  return new Promise(function (resolve) {
    setTimeout(resolve.bind(null, null), duration);
  });
}

export function removeUrls(text: string) {
  return text.replace(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g, "");
}
