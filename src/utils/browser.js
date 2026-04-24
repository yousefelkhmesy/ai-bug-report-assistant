export function detectBrowser() {
  const ua = window.navigator.userAgent;

  const matchers = [
    {
      name: "Google Chrome",
      test: () => /Chrome\/(\d+)/.test(ua) && !/Edg\//.test(ua),
      getVersion: () => ua.match(/Chrome\/([\d.]+)/)?.[1],
    },
    {
      name: "Microsoft Edge",
      test: () => /Edg\/(\d+)/.test(ua),
      getVersion: () => ua.match(/Edg\/([\d.]+)/)?.[1],
    },
    {
      name: "Mozilla Firefox",
      test: () => /Firefox\/(\d+)/.test(ua),
      getVersion: () => ua.match(/Firefox\/([\d.]+)/)?.[1],
    },
    {
      name: "Safari",
      test: () => /Safari\//.test(ua) && !/Chrome|Edg\//.test(ua),
      getVersion: () => ua.match(/Version\/([\d.]+)/)?.[1],
    },
  ];

  const detected = matchers.find((matcher) => matcher.test());

  if (!detected) {
    return "Unknown browser";
  }

  const version = detected.getVersion();
  return version ? `${detected.name} ${version}` : detected.name;
}
