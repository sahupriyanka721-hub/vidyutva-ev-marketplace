import { handleApiRequest } from '../server/backendHandler.js';

export default async function handler(req, res) {
  return handleApiRequest(req, res);
}
