function tryDecodeBase64Utf8(trimmed) {
  try {
    const normalized = trimmed.replace(/-/g, "+").replace(/_/g, "/");
    const pad = normalized.length % 4;
    const padded = pad ? normalized + "=".repeat(4 - pad) : normalized;
    const g = typeof globalThis !== "undefined" ? globalThis : {};
    if (typeof g.atob !== "function") return null;
    const binary = g.atob(padded);
    if (typeof TextDecoder !== "undefined") {
      const bytes = new Uint8Array(binary.length);
      for (let i = 0; i < binary.length; i++)
        bytes[i] = binary.charCodeAt(i) & 0xff;
      return new TextDecoder("utf-8").decode(bytes);
    }
    return binary;
  } catch {
    return null;
  }
}

export function decodeQrPayload(scanned) {
  const trimmed = String(scanned ?? "")
    .trim()
    .replace(/^\uFEFF/, "");
  if (!trimmed) return { decoded: "", segments: [], raw: scanned };

  if (trimmed.startsWith("{") || trimmed.startsWith("[")) {
    return { decoded: trimmed, segments: trimmed.split("$#$"), raw: scanned };
  }

  const fromB64 = tryDecodeBase64Utf8(trimmed);
  if (fromB64 != null && fromB64.length > 0) {
    return { decoded: fromB64, segments: fromB64.split("$#$"), raw: scanned };
  }

  return { decoded: trimmed, segments: trimmed.split("$#$"), raw: scanned };
}

function tryParseJsonObject(text) {
  const t = text.trim().replace(/^\uFEFF/, "");
  if (!t.startsWith("{")) return null;
  try {
    const parsed = JSON.parse(t);
    return parsed != null &&
      typeof parsed === "object" &&
      !Array.isArray(parsed)
      ? /** @type {Record<string, unknown>} */ (parsed)
      : null;
  } catch {
    return null;
  }
}

export function parseQrScannedForNormalization(scanned) {
  if (
    scanned != null &&
    typeof scanned === "object" &&
    !Array.isArray(scanned)
  ) {
    return /** @type {Record<string, unknown>} */ (scanned);
  }
  const str = typeof scanned === "string" ? scanned : String(scanned ?? "");

  const direct = tryParseJsonObject(str);
  if (direct) return direct;

  const { decoded, segments } = decodeQrPayload(str);
  const fromDecoded = tryParseJsonObject(decoded);
  if (fromDecoded) return fromDecoded;

  const text = decoded.trim();
  if (text.startsWith("{") || text.startsWith("[")) {
    return null;
  }

  // `apiUrl$#$companyId$#$branchId$#$branchName$#$sKey$#$companyName` (+ optional trailing host/metadata; not used as user-facing message)
  if (segments.length >= 6) {
    const [
      apilink,
      companyId,
      branchId,
      branchValue,
      sKey,
      companyValue,
      serverName,
    ] = segments;
    return {
      apilink: String(apilink ?? "").trim(),
      branchData: { id: branchId, value: String(branchValue ?? "").trim() },
      companyData: { id: companyId, value: String(companyValue ?? "").trim() },
      sKey: String(sKey ?? "").trim(),
      serverName: String(serverName ?? "").trim(),
    };
  }
  return null;
}

const unwrapNested = (raw) => {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) return raw;
  const nested =
    raw.data ??
    raw.Data ??
    raw.result ??
    raw.Result ??
    raw.payload ??
    raw.Payload;
  if (nested && typeof nested === "object" && !Array.isArray(nested))
    return nested;
  return raw;
};

export function normalizeConnectionResponse(raw) {
  if (!raw || typeof raw !== "object") return null;
  const src = unwrapNested(/** @type {Record<string, unknown>} */ (raw));
  if (!src || typeof src !== "object") return null;

  const pickStr = (obj, keys) => {
    for (const k of keys) {
      const v = obj[k];
      if (v != null && String(v).trim() !== "") return String(v).trim();
    }
    return "";
  };

  const normalizeIdValue = (x, kind) => {
    if (x == null || typeof x !== "object" || Array.isArray(x)) return null;
    const idRaw =
      x.id ??
      x.Id ??
      x.ID ??
      (kind === "branch" ? (x.branchId ?? x.BranchId) : null) ??
      (kind === "company" ? (x.companyId ?? x.CompanyId) : null);
    const idStr =
      idRaw === undefined || idRaw === null || idRaw === ""
        ? ""
        : String(idRaw).trim();
    if (!idStr) return null;
    const asInt = Number(idStr);
    const id =
      /^-?\d+$/.test(idStr) && Number.isSafeInteger(asInt) ? asInt : idStr;
    const value = String(
      x.value ??
        x.Value ??
        (kind === "branch"
          ? (x.branchName ?? x.BranchName ?? x.name ?? x.Name)
          : null) ??
        (kind === "company"
          ? (x.companyName ?? x.CompanyName ?? x.name ?? x.Name)
          : null) ??
        "",
    ).trim();
    if (!value) return null;
    return { id, value };
  };

  let apilink = pickStr(src, [
    "apilink",
    "apiLink",
    "ApiLink",
    "api_url",
    "Api_Url",
    "apiURL",
    "ApiUrl",
    "url",
    "Url",
    "URL",
    "baseUrl",
    "base_url",
    "BaseUrl",
    "endpoint",
    "Endpoint",
  ]);
  const sKey = pickStr(src, [
    "sKey",
    "skey",
    "SKey",
    "Skey",
    "sessionKey",
    "SessionKey",
    "key",
    "Key",
    "secret",
    "Secret",
  ]);
  const serverName = pickStr(src, [
    "serverName",
    "ServerName",
    "server_name",
    "Server_Name",
    "serverName",
    "ServerName",
  ]);
  const message =
    pickStr(src, ["message", "Message"]) || "Connection successfull";

  let branchData = normalizeIdValue(
    src.branchData ?? src.BranchData ?? src.branch,
    "branch",
  );
  if (!branchData) {
    branchData = normalizeIdValue(
      {
        id: src.branchId ?? src.BranchId,
        value: src.branchName ?? src.BranchName,
      },
      "branch",
    );
  }

  let companyData = normalizeIdValue(
    src.companyData ?? src.CompanyData ?? src.company,
    "company",
  );
  if (!companyData) {
    companyData = normalizeIdValue(
      {
        id: src.companyId ?? src.CompanyId,
        value: src.companyName ?? src.CompanyName,
      },
      "company",
    );
  }

  if (!companyData) return null;
  if (!apilink && /^https?:\/\//i.test(companyData.value)) {
    apilink = companyData.value;
  }

  if (!apilink || !branchData || !sKey || !serverName) return null;

  return { apilink, branchData, companyData, message, sKey, serverName };
}
