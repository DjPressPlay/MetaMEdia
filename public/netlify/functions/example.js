export default async (req, context) => {
  return new Response(
    JSON.stringify({ message: "Zetsu Function active" }),
    { headers: { "Content-Type": "application/json" } }
  );
};
