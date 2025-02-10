// Book Class
class Book {
    constructor(title, author, pages, read, color) {
        this.title = title;
        this.author = author;
        this.pages = pages;
        this.read = read;
        this.color = color;
    }

    info() {
        return `${this.title} by ${this.author}, ${this.pages} pages, ${this.read ? 'read' : 'not read yet'}`;
    }
}

// Library Controller
const LibraryController = {
    myLibrary: [
        new Book("The Great Gatsby", "F. Scott Fitzgerald", 180, true, '#2C3930'),
    ],
    colors: ['#2C3930', '#3F4F44', '#A27B5C'],
    colorIndex: 0,

    addBook(title, author, pages, read) {
        const newBook = new Book(title, author, pages, read, this.colors[this.colorIndex]);
        this.myLibrary.push(newBook);
        this.colorIndex = (this.colorIndex + 1) % this.colors.length;
        UI.displayBooks();
    },

    removeBook(index) {
        this.myLibrary.splice(index, 1);
        UI.displayBooks();
    },

    toggleReadStatus(index) {
        const book = this.myLibrary[index];
        book.read = !book.read;
        UI.displayBooks();
    }
};

// UI Controller
const UI = {
    getShape(index) {
        const shapes = ['circle', 'square', 'triangle-up'];
        return shapes[index % shapes.length];
    },

    displayBooks() {
        const libraryContainer = document.getElementById("libraryContainer");
        libraryContainer.innerHTML = '';

        LibraryController.myLibrary.forEach((book, index) => {
            const bookCard = this.createBookCard(book, index);
            libraryContainer.appendChild(bookCard);
        });
    },

    createBookCard(book, index) {
        const bookCard = document.createElement("div");
        bookCard.className = "book-card";
        bookCard.style.backgroundColor = book.color;
        
        bookCard.innerHTML = `
            <div class="${this.getShape(index)}"></div>
            <h3>${book.title}</h3>
            <p>Author: ${book.author}</p>
            <p>Pages: ${book.pages}</p>
            <button class="status-button" onclick="LibraryController.toggleReadStatus(${index})">
                ${book.read ? 'Read' : 'Not Read'}
            </button>
            <button class="trash-button" onclick="ModalController.showDeleteConfirmation(${index})">
                🗑️
            </button>
        `;
        return bookCard;
    },

    showToast(message) {
        const toast = document.getElementById("toast");
        toast.textContent = message;
        toast.classList.add("show");
        setTimeout(() => toast.classList.remove("show"), 3000);
    }
};

// Modal Controller
const ModalController = {
    bookToDeleteIndex: null,

    init() {
        this.initializeEventListeners();
    },

    initializeEventListeners() {
        // Add Book Modal
        const addBookBtn = document.querySelector(".app-button");
        const closeModalBtn = document.getElementById("closeModal");
        const bookForm = document.getElementById("bookForm");

        addBookBtn.onclick = () => this.showModal("bookModal");
        closeModalBtn.onclick = () => this.hideModal("bookModal");
        bookForm.onsubmit = (e) => this.handleFormSubmit(e);

        // Delete Confirmation Modal
        document.getElementById("confirmDeleteButton").onclick = () => this.handleDeleteConfirmation();
        document.getElementById("cancelDeleteButton").onclick = () => this.hideModal("confirmModal");

        // Close modals when clicking outside
        window.onclick = (e) => {
            if (e.target.classList.contains("modal")) {
                this.hideModal(e.target.id);
            }
        };
    },

    showModal(modalId) {
        const modal = document.getElementById(modalId);
        modal.classList.add("show");
    },

    hideModal(modalId) {
        const modal = document.getElementById(modalId);
        modal.classList.remove("show");
        if (modalId === "confirmModal") {
            this.bookToDeleteIndex = null;
        }
    },

    showDeleteConfirmation(index) {
        this.bookToDeleteIndex = index;
        this.showModal("confirmModal");
    },

    handleDeleteConfirmation() {
        if (this.bookToDeleteIndex !== null) {
            LibraryController.removeBook(this.bookToDeleteIndex);
            this.hideModal("confirmModal");
        }
    },

    handleFormSubmit(event) {
        event.preventDefault();
        
        const title = document.getElementById("title").value;
        const author = document.getElementById("author").value;
        const pages = parseInt(document.getElementById("pages").value, 10);
        
        if (pages < 0) {
            UI.showToast("Please enter a valid number of pages (0 or more).");
            return;
        }

        if (readStatus === null) {
            UI.showToast("Please select Yes or No before submitting!");
            return;
        }

        LibraryController.addBook(title, author, pages, readStatus);
        this.hideModal("bookModal");
        event.target.reset();
        readStatus = null;
        this.resetReadButtons();
    },

    resetReadButtons() {
        const yesButton = document.querySelector('.read-button:nth-of-type(1)');
        const noButton = document.querySelector('.read-button:nth-of-type(2)');
        [yesButton, noButton].forEach(button => {
            button.style.backgroundColor = '';
            button.style.color = '';
        });
    }
};

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    ModalController.init();
    UI.displayBooks();
});

// Global read status (could be refactored into the ModalController)
let readStatus = null;

// Read status toggle function (could be refactored into the ModalController)
function toggleRead(button) {
    const yesButton = document.querySelector('.read-button:nth-of-type(1)');
    const noButton = document.querySelector('.read-button:nth-of-type(2)');

    if (button === yesButton) {
        yesButton.style.backgroundColor = '#f0f0f0';
        yesButton.style.color = '#000';
        noButton.style.backgroundColor = '';
        noButton.style.color = '';
        readStatus = true;
    } else if (button === noButton) {
        noButton.style.backgroundColor = '#f0f0f0';
        noButton.style.color = '#000';
        yesButton.style.backgroundColor = '';
        yesButton.style.color = '';
        readStatus = false;
    }
} 