import { google } from "googleapis";

const SHEET_NAME = "BOOKINGS";

const HEADER_ROW = [
  "bookingId",
  "status",
  "productName",
  "mode",
  "startAt",
  "endAt",
  "customerName",
  "email",
  "phone",
  "priceTotalCents",
  "stripeSessionId",
  "stripePaymentIntentId",
  "createdAt",
];

function getAuth() {
  const email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  const key = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n");
  if (!email || !key) return null;
  return new google.auth.JWT({
    email,
    key,
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });
}

async function ensureHeader(
  sheets: ReturnType<typeof google.sheets>,
  spreadsheetId: string
) {
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range: `${SHEET_NAME}!A1:M1`,
  });
  if (!res.data.values || res.data.values.length === 0) {
    await sheets.spreadsheets.values.update({
      spreadsheetId,
      range: `${SHEET_NAME}!A1:M1`,
      valueInputOption: "RAW",
      requestBody: { values: [HEADER_ROW] },
    });
  }
}

export interface SheetBookingRow {
  bookingId: string;
  status: string;
  productName: string;
  mode: string;
  startAt: string;
  endAt: string;
  customerName: string;
  email: string;
  phone: string;
  priceTotalCents: number;
  stripeSessionId: string;
  stripePaymentIntentId: string;
  createdAt: string;
}

/**
 * Append a booking row to the Google Sheet mirror.
 * Silently fails if credentials are missing (non-blocking).
 */
export async function appendBookingRow(row: SheetBookingRow): Promise<void> {
  try {
    const auth = getAuth();
    const spreadsheetId = process.env.GOOGLE_SHEETS_ID;
    if (!auth || !spreadsheetId) {
      console.warn("[Sheets] Skipping — missing credentials or sheet ID");
      return;
    }

    const sheets = google.sheets({ version: "v4", auth });
    await ensureHeader(sheets, spreadsheetId);

    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: `${SHEET_NAME}!A:M`,
      valueInputOption: "RAW",
      insertDataOption: "INSERT_ROWS",
      requestBody: {
        values: [
          [
            row.bookingId,
            row.status,
            row.productName,
            row.mode,
            row.startAt,
            row.endAt,
            row.customerName,
            row.email,
            row.phone,
            row.priceTotalCents,
            row.stripeSessionId,
            row.stripePaymentIntentId,
            row.createdAt,
          ],
        ],
      },
    });
  } catch (err) {
    console.error("[Sheets] Failed to append row:", err);
  }
}
