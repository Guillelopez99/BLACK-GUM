#!/usr/bin/env node
const baseUrl = (process.env.BASE_URL || process.argv[2] || "").trim().replace(/\/+$/, "");

if (!baseUrl) {
  console.error("Usage: BASE_URL=https://your-domain.com npm run verify:media:remote");
  process.exit(1);
}

const targets = [
  { path: "/paquetes/pack-campaign.mp4", expectType: "video/mp4" },
  { path: "/paquetes/pack-monthly.mp4", expectType: "video/mp4" },
  { path: "/paquetes/pack-alacarte.mp4", expectType: "video/mp4" },
  { path: "/textures/humo-3-hq.mp4", expectType: "video/mp4" },
  { path: "/textures/humo-3-opt.mp4", expectType: "video/mp4" },
  { path: "/videos/previews/ARREGLANDO_HORNO_FRATELLI_PAZZI-preview.mp4", expectType: "video/mp4" }
];

async function probe(url, expectType) {
  let response = await fetch(url, { method: "HEAD", redirect: "follow" });
  if (response.status === 405 || response.status === 501) {
    response = await fetch(url, {
      method: "GET",
      redirect: "follow",
      headers: { Range: "bytes=0-1" }
    });
  }

  const contentType = (response.headers.get("content-type") || "").toLowerCase();
  const okStatus = response.ok;
  const okType = contentType.includes(expectType);

  return {
    ok: okStatus && okType,
    status: response.status,
    contentType
  };
}

async function run() {
  const failures = [];

  for (const target of targets) {
    const url = `${baseUrl}${target.path}`;
    const result = await probe(url, target.expectType);
    if (!result.ok) {
      failures.push({ url, ...result, expected: target.expectType });
    } else {
      console.log(`OK    ${url} (${result.status}, ${result.contentType || "no content-type"})`);
    }
  }

  if (failures.length > 0) {
    console.error(`\nMedia endpoint verification failed (${failures.length}/${targets.length}).`);
    for (const fail of failures) {
      console.error(
        `FAIL  ${fail.url} (status=${fail.status}, content-type='${fail.contentType || "missing"}', expected contains '${fail.expected}')`
      );
    }
    process.exit(1);
  }

  console.log(`\nMedia endpoint verification passed (${targets.length}/${targets.length}).`);
}

run().catch((error) => {
  console.error("Verification error:", error);
  process.exit(1);
});
