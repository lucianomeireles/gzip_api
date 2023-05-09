import request from "supertest";
import app from "./../src/app";

export default describe("Book API", () => {
  let bookId: string;

  // Test POST /books endpoint
  it("should create a new book", async () => {
    const res = await request(app)
      .post("/books")
      .send({
        title: "The Lord of the Rings",
        author: "J.R.R. Tolkien",
        description: "A fantasy novel",
      })
      .expect(201);

    expect(res.body._id).toBeDefined();
    expect(res.body.title).toBe("The Lord of the Rings");
    expect(res.body.author).toBe("J.R.R. Tolkien");
    expect(res.body.description).toBe("A fantasy novel");

    bookId = res.body._id;
  });

  // Test GET /books endpoint
  it("should return a list of books", async () => {
    const res = await request(app).get("/books").expect(200);
    expect(res.body.length).toBeGreaterThan(0);
  });

  // Test GET /books/:id endpoint
  it("should return a book by id", async () => {
    const res = await request(app).get(`/books/${bookId}`).expect(200);

    expect(res.body._id).toBeDefined();
    expect(res.body.title).toBe("The Lord of the Rings");
    expect(res.body.author).toBe("J.R.R. Tolkien");
    expect(res.body.description).toBe("A fantasy novel");
  });

  // Test PUT /books/:id endpoint
  it("should update a book by id", async () => {
    const res = await request(app)
      .put(`/books/${bookId}`)
      .send({
        title: "The Hobbit",
        author: "J.R.R. Tolkien",
        description: "A children fantasy novel",
      })
      .expect(200);

    expect(res.body._id).toBeDefined();
    expect(res.body.title).toBe("The Hobbit");
    expect(res.body.author).toBe("J.R.R. Tolkien");
    expect(res.body.description).toBe("A children fantasy novel");
  });

  // Test DELETE /books/:id endpoint
  it("should delete a book by id", async () => {
    await request(app).delete(`/books/${bookId}`).expect(200);
  });
});
