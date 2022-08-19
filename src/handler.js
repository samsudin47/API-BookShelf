const { nanoid } = require("nanoid");
const ebooks = require("./ebooks");

// fungsi menyimpan buku
const addBookHandler = (request, h) => {
    const { name, year, author, summary, publisher, pageCount, readPage, reading } = request.payload;

    if (name === undefined) {
        const response = h.response({
            status: "fail",
            message: "Gagal menambahkan buku. Mohon isi nama buku",
        });
        response.code(400);
        return response;
    }
    if (readPage > pageCount) {
        const response = h.response({
            status: "fail",
            message: "Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount",
        });
        response.code(400);
        return response;
    }

    const id = nanoid(16);
    const insertedAt = new Date().toISOString();
    const updatedAt = insertedAt;
    const finished = pageCount === readPage ? true : false;
    const newBook = { id, name, year, author, summary, publisher, pageCount, finished, readPage, reading, insertedAt, updatedAt };
    ebooks.push(newBook);

    const isSuccess = ebooks.filter((b) => b.id === id).length > 0;
    if (isSuccess) {
        const response = h.response({
            status: "success",
            message: "Buku berhasil ditambahkan",
            data: {
                bookId: id,
            },
        });
        response.header("Access-Control-Allow-Origin", "*");
        response.code(201);
        return response;
    }

    const response = h.response({
        status: "error",
        message: "Buku gagal ditemukan",
    });
    response.code(500);
    return response;
};

// fungsi menampilkan seluruh buku
const getAllbookHandler = (request, h) => {
    const { name, reading, finished } = request.query;

    if (name) {
        let ebooks = ebooks.filter((n) => name.tolowerCase() === name.tolowerCase());
        return h.response({
            status: "success",
            data: {
                books: ebooks.map((book) => ({
                    id: book.id,
                    name: book.name,
                    publisher: book.publisher,
                })),
            },
        });
    }
    if (reading) {
        let ebooks = ebooks.filter((n) => Number(n.reading) === reading);
        return h.response({
            status: "success",
            data: {
                books: ebooks.map((book) => ({
                    id: book.id,
                    name: book.name,
                    publisher: book.publisher,
                })),
            },
        });
    }
    if (finished) {
        let ebooks = ebooks.filter((n) => Number(n.finished) === finished);
        return h.response({
            status: "success",
            data: {
                books: ebooks.map((book) => ({
                    id: book.id,
                    name: book.name,
                    publisher: book.publisher,
                })),
            },
        });
    }
    if (!name && !reading && !finished) {
        return h.response({
            status: "success",
            data: {
                books: ebooks.map((book) => ({
                    id: book.id,
                    name: book.name,
                    publisher: book.publisher,
                })),
            },
        });
    }
};

// fungsi menampilkan detail buku
const getIdBookHandler = (request, h) => {
    const { bookId } = request.params;
    const book = ebooks.filter((n) => n.id === bookId)[0];
    if (book !== undefined) {
        return {
            status: "success",
            data: {
                book,
            },
        };
    }

    const response = h.response({
        status: "fail",
        message: "Buku tidak ditemukan",
    });
    response.code(404);
    return response;
};

// fungsi mengubah data buku
const editBookIdHandler = (request, h) => {
    const { bookId } = request.params;

    const { name, year, author, summary, publisher, pageCount, readPage, reading } = request.payload;

    if (name === undefined) {
        const response = h.response({
            status: "fail",
            message: "Gagal memperbarui buku. Mohon isi nama buku",
        });
        response.code(400);
        return response;
    }
    if (readPage > pageCount) {
        const response = h.response({
            status: "fail",
            message: "Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount",
        });
        response.code(400);
        return response;
    }

    const updatedAt = new Date().toISOString();
    const index = ebooks.findIndex((n) => n.id === bookId);
    if (index !== -1) {
        ebooks[index] = {
            ...ebooks[index],
            name,
            year,
            author,
            summary,
            publisher,
            pageCount,
            readPage,
            reading,
            updatedAt,
        };

        const response = h.response({
            status: "success",
            message: "Buku berhasil diperbarui",
        });
        response.code(200);
        return response;
    }

    const response = h.response({
        status: "fail",
        message: "Gagal memperbarui buku. Id tidak ditemukan",
    });
    response.code(404);
    return response;
};

// fungsi menghapus data buku
const deleteBookIdHandler = (request, h) => {
    const { bookId } = request.params;

    const index = ebooks.findIndex((n) => n.id === bookId);

    if (index !== -1) {
        ebooks.splice(index, 1);
        const response = h.response({
            status: "success",
            message: "Buku berhasil dihapus",
        });
        response.code(200);
        return response;
    }

    const response = h.response({
        status: "fail",
        message: "Buku gagal dihapus. Id tidak ditemukan",
    });
    response.code(404);
    return response;
};

module.exports = { addBookHandler, getAllbookHandler, getIdBookHandler, editBookIdHandler, deleteBookIdHandler };