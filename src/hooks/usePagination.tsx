import { useState } from "react";

export function usePagination({
    information,
}: {
    information: string[];
}) {
    const itemsPerPage = 10;

    const [page, setPage] = useState(1);
    const start = (page - 1) * itemsPerPage;
    const end = page * itemsPerPage;

    const infoProcessed = information;
    const totalPage = Math.ceil(infoProcessed.length / itemsPerPage);
    const episodes = infoProcessed.slice(start, end);

    const hasPrevPage = page > 1;
    const hasNextPage = page < totalPage;

    const handlePrevPage = () => {
        setPage(page - 1);
    };
    const handleNextPage = () => {
        setPage(page + 1);
    };

    return {
        page,
        episodes,
        totalPage,
        hasPrevPage,
        hasNextPage,
        handlePrevPage,
        handleNextPage,
    };
}
