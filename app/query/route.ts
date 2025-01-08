import { db } from "@vercel/postgres";

async function listInvoices() {
  const client = await db.connect();
  try {
    const data = await client.sql`
      SELECT invoices.amount, customers.name
      FROM invoices
      JOIN customers ON invoices.customer_id = customers.id
      WHERE invoices.amount = 666;
    `;
    return data.rows;
  } catch (error) {
    console.error("Error executing listInvoices query:", error);
    throw new Error("Failed to fetch invoices");
  } finally {
    client.release();
  }
}

export async function GET() {
  try {
    const invoices = await listInvoices();
    return new Response(
      JSON.stringify({ invoices }),
      { headers: { "Content-Type": "application/json" }, status: 200 }
    );
  } catch (error) {
    console.error("Error in GET handler:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { "Content-Type": "application/json" }, status: 500 }
    );
  }
}