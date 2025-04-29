import { createReader as createKeystaticReader } from "@keystatic/core/reader";
import keystaticConfig from "../../keystatic.config";

export async function createReader() {
  return createKeystaticReader(process.cwd(), keystaticConfig);
} 