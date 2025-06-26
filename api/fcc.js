export default async function handler(req, res) {
  const { address } = req.query;

  if (!address) {
    return res.status(400).json({ error: "Missing address parameter" });
  }

  const encoded = encodeURIComponent(address);
  const url = `https://broadbandmap.fcc.gov/nbm/api/locationSummary?address=${encoded}`;

  try {
    const fccRes = await fetch(url, {
      headers: {
        // This is key to avoid HTML fallback pages
        "User-Agent": "Mozilla/5.0 (FCC Proxy)",
        "Accept": "application/json"
      }
    });

    const contentType = fccRes.headers.get("content-type");

    if (!fccRes.ok || !contentType.includes("application/json")) {
      const html = await fccRes.text();
      return res.status(fccRes.status).json({
        error: "FCC API did not return JSON",
        status: fccRes.status,
        preview: html.slice(0, 150)
      });
    }

    const data = await fccRes.json();

    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET");
    return res.status(200).json(data);

  } catch (err) {
    res.status(500).json({
      error: "Failed to contact FCC API",
      details: err.message
    });
  }
}
