import { turso } from "@/turso";

function saveFavoritesRows({ registers, section, userId }: {
    registers: number[],
    section: string,
    userId: string
}) {
    if (!Array.isArray(registers) || !section) return;

    registers.forEach(async (register) => {
        await turso.execute({
            sql: `INSERT OR IGNORE INTO favorites (user_id,target_type,target_id) VALUES (?,?,?);`,
            args: [userId, section, register]
        })
    })
}

function deleteFavoritesRows({ registers, section, userId }: {
    registers: number[],
    section: string,
    userId: string
}) {
    if (!Array.isArray(registers) || !section) return;

    registers.forEach(async (register) => {
        await turso.execute({
            sql: `DELETE FROM favorites WHERE user_id=? AND target_type=? AND target_id=?;`,
            args: [userId, section, register]
        })
    })
}

export async function POST({ request }: { request: Request }) {
    const { registers, section, userId } = await request.json();

    if (!userId) return new Response(JSON.stringify({ data: null, message: "User not found" }), { status: 500 });
    if (!section) return new Response(JSON.stringify({ data: null, message: "Section not found" }), { status: 500 });
    if (!registers.length) return new Response(JSON.stringify({ data: null, message: "Registers not found" }), { status: 500 });

    saveFavoritesRows({ registers, section, userId });

    return new Response(JSON.stringify({ data: null, message: "Favorites saved" }), { status: 200 });

}

export async function DELETE({ request }: { request: Request }) {
    const { id, section, userId } = await request.json();

    if (!userId) return new Response(JSON.stringify({ data: null, message: "User not found" }), { status: 500 });
    if (!section) return new Response(JSON.stringify({ data: null, message: "Section not found" }), { status: 500 });
    if (!id) return new Response(JSON.stringify({ data: null, message: "Id not found" }), { status: 500 });

    deleteFavoritesRows({ registers: [id], section, userId });

    return new Response(JSON.stringify({ data: null, message: "Favorites deleted" }), { status: 200 });
}