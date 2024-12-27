document.getElementById("todoForm").addEventListener("submit", async function (event) {
  event.preventDefault(); // Prevent default form submission

  // Collect form data
  const bookId = document.getElementById("bookId").value;
  const author = document.getElementById("author").value;
  const description = document.getElementById("description").value;

  // Prepare the payload
  const todo = {
    BookId: parseInt(bookId),
    Author: author,
    Description: description,
  };

  try {
    // Send a POST request to the API
    const response = await fetch("http://localhost:5213/todos", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(todo),
    });

    // Check if the response is JSON or not
    const contentType = response.headers.get("Content-Type");
    if (contentType && contentType.includes("application/json")) {
      const result = await response.json();
      document.getElementById("response").textContent = JSON.stringify(result, null, 2);
    } else {
      // Handle non-JSON responses
      const text = await response.text();
      document.getElementById("response").textContent = `Error: ${text}`;
    }
  } catch (error) {
    document.getElementById("response").textContent = `Error: ${error.message}`;
  }
});
