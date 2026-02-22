// src/data/trackerDb.js
export const KNOWN_TRACKER_DOMAINS = [
  'doubleclick.net', 'googlesyndication.com', 'google-analytics.com',
  'googletagmanager.com', 'googletagservices.com',
  'facebook.com', 'facebook.net', 'fbcdn.net', 'connect.facebook',
  'scorecardresearch.com', 'quantserve.com', 'amazon-adsystem.com',
  'ads.twitter.com', 'analytics.twitter.com',
  'hotjar.com', 'mixpanel.com', 'segment.com', 'segment.io',
  'fullstory.com', 'logrocket.com', 'clarity.ms',
  'mouseflow.com', 'inspectlet.com', 'crazyegg.com',
  'adnxs.com', 'rubiconproject.com', 'pubmatic.com', 'openx.net',
  'criteo.com', 'taboola.com', 'outbrain.com',
  'adsrvr.org', 'casalemedia.com', 'chartbeat.com', 'parsely.com',
  'newrelic.com', 'telemetry.microsoft.com', 'vortex.data.microsoft.com',
  'watson.microsoft.com', 'settings-win.data.microsoft.com',
];

export const CROSS_SITE_DOMAINS = [
  'doubleclick.net', 'google-analytics.com', 'googletagmanager.com',
  'facebook.com', 'connect.facebook.net', 'criteo.com',
  'segment.io', 'hotjar.com', 'clarity.ms',
];

export const FINGERPRINTING_DOMAINS = [
  'fingerprintjs.com', 'maxmind.com', 'ipinfo.io',
  'ipapi.co', 'ipgeolocation.io', 'deviceatlas.com',
];

export const TRACKER_IP_PREFIXES = [
  '142.250', '34.107', '35.190',
  '52.46', '69.171', '31.13', '157.240',
];

export const SAFE_IPS = new Set([
  '8.8.8.8', '8.8.4.4', '1.1.1.1', '1.0.0.1', '9.9.9.9',
]);

export const FREQUENCY_ANOMALY_THRESHOLD = 4;