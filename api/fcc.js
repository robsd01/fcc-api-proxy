export default async function handler(req, res) {
  const { address } = req.query;

  if (!address) {
    return res.status(400).json({ error: "Missing address parameter" });
  }

  const encoded = encodeURIComponent(address);
  const url = `https://broadbandmap.fcc.gov/nbm/api/locationSummary?address=${encoded}`;

  try {
    const fccRes = await fetch(url);

    // 🛑 If FCC responds with a non-200 status, handle it
    if (!fccRes.ok) {
      const html = await fccRes.text(); // Capture raw error page
      return res.status(fccRes.status).json({
        error: "FCC API responded with non-200 status",
        status: fccRes.status,
        htmlPreview: html.slice(0, 100) // only show a sample
      });
    }

    const data = await fccRes.json();

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET');
    return res.status(200).json(data);

  } catch (err) {
    res.status(500).json({ error: "Failed to contact FCC API", details: err.message });
  }
}
