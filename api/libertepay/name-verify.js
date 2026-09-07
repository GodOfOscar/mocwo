import { axios, apiKey, providerHeaders, providerUrl } from "./provider.js";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ success: false, message: "Method not allowed" });
  }

  const { institution_code, account_number } = req.body || {};
  if (!apiKey) {
    return res.status(500).json({ success: false, message: "LibertéPay secret key is not configured on the server" });
  }
  if (!institution_code || !account_number) {
    return res.status(400).json({ success: false, message: "institution_code and account_number are required" });
  }

  try {
    const response = await axios.post(
      providerUrl("name-verify"),
      { institution_code, account_number },
      { headers: providerHeaders }
    );
    return res.status(response.status).json({ success: true, data: response.data });
  } catch (error) {
    console.error("LibertéPay Name Verify Error:", error.response?.data || error.message);
    return res.status(error.response?.status || 500).json({
      success: false,
      message: "Name verification failed",
      error: error.response?.data || error.message,
    });
  }
}
