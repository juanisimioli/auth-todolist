export const isTest = async (event) =>
  await fetch(`${process.env.API}${process.env.ENDPOINT}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(event),
    cache: "no-store",
  });
