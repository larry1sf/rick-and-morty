import { turso } from "@/turso";

export async function POST({ request }: { request: Request }) {
    const { userId, section } = await request.json();

    if (!userId) return new Response(JSON.stringify({ data: null, message: "User not found" }), { status: 500 });

    if (!section) return new Response(JSON.stringify({ data: null, message: "Section not found" }), { status: 500 });

    const res = await turso.execute({
        sql: `SELECT * FROM favorites WHERE user_id = ? AND target_type = ?;`,
        args: [userId, section]
    })

    return new Response(JSON.stringify({ data: res.rows, message: "Favorites fetched" }), { status: 200 });
}