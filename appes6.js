class Book{
    constructor(title,author,isbn){
        this.title = title;
        this.author = author;
        this.isbn = isbn;
    }
}


// How to access and manipulate texts : createTextNode, textContent
//Other useful event listeners DOMContentLoaded
// some DOM manipulation functions parentElement , previousElementSibling

class UI{
    addBookToList(book){
        const list = document.getElementById('book-list');
    
        // Create a tr element
        const row = document.createElement('tr');
        // Insert cols (IMPORTANT)
        row.innerHTML = `
            <td>${book.title}</td>
            <td>${book.author}</td>
            <td>${book.isbn}</td>
            <td><a href="#" class="delete">X</a></td>
        `;
    
        list.appendChild(row);
    }
    showAlert(message, className){
        // Create div
        const div = document.createElement('div');
        // Add classes
        div.className = `alert ${className}`;
        // Add text
        div.appendChild(document.createTextNode(message));
        // Whenever we need to add some text we need to ceate a text node
        // Get parent
        const container = document.querySelector('.container');
        // Get form
        const form = document.querySelector('#book-form');
        // Insert Alert
        container.insertBefore(div,form);
    
        // Timeout after 3sec
        setTimeout(function(){
            document.querySelector('.alert').remove();
        },3000);  //One parameter is a function and the other is the time after whivh it has to be timed-out 
    }

    deleteBook(target){
        if (target.className === 'delete') {
            target.parentElement.parentElement.remove();
        }
    }

    clearFields(){
        document.getElementById('title').value = '';
        document.getElementById('author').value = '';
        document.getElementById('isbn').value = '';
    }
}

// Local Storage Class
class Store {
    static getBooks(){
        let books;
        if(localStorage.getItem('books') === null)
        {
            books = []
        }else{
            books = JSON.parse(localStorage.getItem('books'));
            // Since this is gonna be a JS object hence we use JSON.parse
        }

        return books;
    }

    // Displaying the books whenever the window is reloaded
    static displayBooks(){
        const books = Store.getBooks();

        books.forEach(function(book){
            const ui = new UI();

            // Add book to the UI
            ui.addBookToList(book);
        });
    }

    static addBook(book){
        const books = Store.getBooks();
        books.push(book);
        localStorage.setItem('books',JSON.stringify(books));
    }

    static removeBook(isbn){
        // Get the books from LS
        const books = Store.getBooks();
        books.forEach(function(book,index){
            if (book.isbn === isbn) {
                books.splice(index,1);
            }
        });
    }
}

// DOM Load Event(IMPORTANT)
document.addEventListener('DOMContentLoaded',Store.displayBooks())  //DOMContentLoaded


// Event Listener for add book
document.getElementById('book-form').addEventListener('submit',function(e)
{
    // Get form values
    const title = document.getElementById('title').value,
        author = document.getElementById('author').value,
        isbn = document.getElementById('isbn').value;

    // Instantiating a book
    const book = new Book(title,author,isbn);

    // Instantiate UI obj
    const ui = new UI();

    // Validate
    if(title === '' || author === '' || isbn === '')
    {
        // Error Alert
        ui.showAlert('Please fill in all fields','error');
        
    } else{
        // Add Book to list
        ui.addBookToList(book);

        // Add to LS
        Store.addBook(book);
        
        // Show Success
        ui.showAlert('Book Added!','success');

        // Clear fields
        ui.clearFields();
    }

    e.preventDefault();
})

// Event Listener for delete
document.getElementById('book-list').addEventListener('click',function(e){
    // Instantiate UI obj
    const ui = new UI();

    // Delete Book
    ui.deleteBook(e.target);

    // Remove from LS
    Store.removeBook(e.target.parentElement.previousElementSibling.textContent)
    // Show Message
    ui.showAlert('Book Removed!','success');
    e.preventDefault();
});