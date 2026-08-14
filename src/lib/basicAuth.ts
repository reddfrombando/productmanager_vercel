export function checkBasicAuth(req: any) {
  const header = (req.headers?.authorization || "") as string;
  if (!header || !header.startsWith("Basic ")) return false;
  try {
    const encoded = header.split(" ")[1];
    const decoded = Buffer.from(encoded, "base64").toString();
    const [user, pass] = decoded.split(":");
    return (
      user === process.env.ADMIN_USERNAME &&
      pass === process.env.ADMIN_PASSWORD
    );
  } catch (e) {
    return false;
  }
}
