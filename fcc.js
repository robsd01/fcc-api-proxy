export default async function handler(req, res) {
  const { address } = req.query;

  if (!address) {
    return res.status(400).json({ error: "Missing address parameter" });
  }

  const encoded = encodeURIComponent(address);
  const url = `https://broadbandmap.fcc.gov/nbm/api/locationSummary?address=${encoded}`;

  try {
    const fccRes = await fetch(url);
    const data = await fccRes.json();

    res.setHeader('Access-Control-Allow-Origin', '*'); // ✅ Solve CORS
    res.setHeader('Access-Control-Allow-Methods', 'GET');
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ error: "Failed to contact FCC API", details: err.message });
  }
}
