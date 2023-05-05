const { nanoid } = require('nanoid');
const books = require('./books');



const addBookHandler = (request, h) => {
  const {
    name, year, author, summary, publisher, pageCount, readPage, reading,
  } = request.payload;

  const id = nanoid(16);
  const finished = pageCount === readPage;
  const insertedAt = new Date().toISOString();
  const updatedAt = new Date().toISOString();

  const newBook = { id, name, year, author, summary, publisher, pageCount, readPage, finished, reading, insertedAt, updatedAt };


  // tidak mengisi name/buku pada saat request
  if (typeof name === 'undefined') {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. Mohon isi nama buku'
    });
    response.code(400);
    return response;
  }

  // Lampir value yang readPage yg lebih gede daripada value pageCount
  if (pageCount < readPage) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount'
    });
    response.code(400);
    return response;
  }



  books.push(newBook);
  const isSuccess = books.filter((book) => book.id === id).length > 0;


  // buku berhasil ditambah
  if (isSuccess) {
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil ditambahkan',
      data: { bookId: id }
    });
    response.code(201);
    return response;
  }



  // gagal menambahkan buku
  const response = h.response({
    status: 'error',
    message: 'Buku gagal ditambahkan'
  });
  response.code(500);
  return response;
};



const getAllBooksHandler = (request, h) => {
  const { name, reading, finished } = request.query;

  if (books.length === 0) {
    const response = h.response({
      status: 'success',
      data: { books: [] }
    });
    response.code(200);
    return response;
  }

  let filterBook = books;

  if (name) {
    filterBook = books.filter((book) => book.name.toLowerCase().includes(name.toLowerCase()));
  }
  if (reading) {
    filterBook = books.filter((book) => Number(book.reading) === Number(reading));
  }
  if (finished) {
    filterBook = books.filter((book) => Number(book.finished) === Number(finished));
  }


  const listBookss = filterBook.map((book) => ({
    id: book.id,
    name: book.name,
    publisher: book.publisher
  }));


  const response = h.response({
    status: 'success',
    data: { books: listBookss }
  });
  response.code(200);
  return response;
};

const getBookByIdHandler = (request, h) => {
  const { bookId } = request.params;

  const book = books.filter((n) => n.id === bookId)[0];

  if (typeof book !== 'undefined') {
    const response = h.response({
      status: 'success',
      data: { book }
    });
    response.code(200);
    return response;
  }


  // jika id yg dicari tidak ada
  const response = h.response({
    status: 'fail',
    message: 'Buku tidak ditemukan'
  });
  response.code(404);
  return response;
};


const editBookByIdHandler = (request, h) => {
  const { bookId } = request.params;

  const {
    name, year, author, summary, publisher, pageCount, readPage, reading,
  } = request.payload;
  const updatedAt = new Date().toISOString();
  const index = books.findIndex((book) => book.id === bookId);



  // tidak mengisi name/buku pada saat request body
  if (typeof name === 'undefined') {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Mohon isi nama buku'
    });
    response.code(400);
    return response;
  }



  // Lampir value yang readPage yg lebih gede daripada value pageCount
  if (pageCount < readPage) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount'
    });
    response.code(400);
    return response;
  }



  if (index !== -1) {
    books[index] = {
      ...books[index], name, year, author, summary, publisher, pageCount, readPage, reading, updatedAt
    };

    // buku berhasil di update/perbarui
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil diperbarui'
    });
    response.code(200);
    return response;
  }


  // buku gagal di perbarui karena tidak menemukan id
  const response = h.response({
    status: 'fail',
    message: 'Gagal memperbarui buku. Id tidak ditemukan'
  });
  response.code(404);
  return response;
};

const deleteBookByIdHandler = (request, h) => {
  const { bookId } = request.params;
  const index = books.findIndex((book) => book.id === bookId);



  // jika memiliki id buku terhapus
  if (index !== -1) {
    books.splice(index, 1);
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil dihapus'
    });
    response.code(200);
    return response;
  }



  // jika id tidak ada maka buku tidak terhapus
  const response = h.response({
    status: 'fail',
    message: 'Buku gagal dihapus. Id tidak ditemukan'
  });
  response.code(404);
  return response;
};



module.exports = { addBookHandler, getAllBooksHandler, getBookByIdHandler, editBookByIdHandler, deleteBookByIdHandler };
