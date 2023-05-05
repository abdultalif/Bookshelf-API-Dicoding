const { addBookHandler, getAllBooksHandler, getBookByIdHandler, editBookByIdHandler, deleteBookByIdHandler,
} = require('./handler');


const routes = [
  // request menambah buku
  {
    method: 'POST',
    path: '/books',
    handler: addBookHandler
  },

  // request menampilkan seluruh buku
  {
    method: 'GET',
    path: '/books',
    handler: getAllBooksHandler
  },

  // request menampilkan buku berdasarkan bookid
  {
    method: 'GET',
    path: '/books/{bookId}',
    handler: getBookByIdHandler
  },

  {
    // request mengubah/memperbarui buku berdasarkan bookid
    method: 'PUT',
    path: '/books/{bookId}',
    handler: editBookByIdHandler,
  },

  {
    // request menghapus buku berdasarkan bookid
    method: 'DELETE',
    path: '/books/{bookId}',
    handler: deleteBookByIdHandler,
  },
];

module.exports = routes;
