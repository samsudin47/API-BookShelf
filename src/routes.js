const { addBookHandler, getAllbookHandler, getIdBookHandler, editBookIdHandler, deleteBookIdHandler } = require("./handler");

const routes = [{
        method: "POST",
        path: "/books",
        handler: addBookHandler,
    },
    {
        method: "GET",
        path: "/books",
        handler: getAllbookHandler,
    },
    {
        method: "GET",
        path: "/books/{bookId}",
        handler: getIdBookHandler,
    },
    {
        method: "PUT",
        path: "/books/{bookId}",
        handler: editBookIdHandler,
    },
    {
        method: "DELETE",
        path: "/books/{bookId}",
        handler: deleteBookIdHandler,
    },
];

module.exports = routes;