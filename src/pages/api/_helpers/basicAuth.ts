import { checkBasicAuth } from "@/lib/basicAuth";

export { checkBasicAuth };

export default function handler(req: any, res: any) {
  // This helper endpoint isn't intended to be called; return 404 so it's a valid API route.
  res.status(404).end();
}
