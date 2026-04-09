// Load cart or create empty one
var cart = JSON.parse(localStorage.getItem("cart")) || [];

// Load wishlist or create empty one
var wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];

var originalThrillerBooks = []; //for sorting the thriller books


// Search books function

const searchBar = document.getElementById("searchInput");
if (searchBar) {
  searchBar.addEventListener("input", searchBooks);
}

function searchBooks() {
  let input = document.getElementById("searchInput").value.toLowerCase();
  let books = document.getElementsByClassName("bookSection");

  // Get current category
  const activeLink = document.querySelector("#mainNavUl a.active");
  const currentActiveCategory = activeLink ? activeLink.innerText.toLowerCase().replace(' ', '-') : "home";

  for (let i = 0; i < books.length; i++) {
    let titleElement = books[i].querySelector(".book-title");

    if (titleElement) {
      let titleText = titleElement.innerText.toLowerCase();
      let bookCategory = books[i].getAttribute("data-category");

      // matching variables
      const matchesSearch = titleText.includes(input);
      const matchesCategory = (currentActiveCategory === "home" || currentActiveCategory === bookCategory);

      if (matchesSearch && matchesCategory) {
        books[i].style.display = "block";
      } else {
        books[i].style.display = "none";
      }
    }
  }
}

//Romance function: sort by trending
var trendingBtn = document.querySelector("#trendingToggle");
var showingOnlyTrending = false; //filter status

if (trendingBtn) {
  trendingBtn.addEventListener("click", toggleTrendingBooks);
}

function toggleTrendingBooks() {
  // Switch the state
  showingOnlyTrending = !showingOnlyTrending;

  trendingBtn.classList.toggle("active-filter");

  // Update text based on state
  if (showingOnlyTrending) {
    trendingBtn.textContent = "Show All Romance";
  } else {
    trendingBtn.textContent = "Show Trending Only";
  }

  // Select all book sections
  var books = document.querySelectorAll(".bookSection");

  books.forEach(function (book) {
    var isTrending = book.dataset.trending === "true";

    if (showingOnlyTrending) { //trending toggled on
      if (isTrending) {
        book.style.display = "block"; //trending books
      }
      else {
        book.style.display = "none"; //hide non-trending books
      }
    }
    else {
      book.style.display = "block"; //trending toggled off
    }
  });
}

//Nature Science function:  Filter Books > 4 Stars function
var ratingBtn = document.querySelector("#ratingToggle");
var showingHighRated = false;

if (ratingBtn) {
  ratingBtn.addEventListener("click", toggleHighRatings);
}

function toggleHighRatings() {
  showingHighRated = !showingHighRated;

  ratingBtn.classList.toggle("active-filter");

  if (showingHighRated) {
    ratingBtn.textContent = "Show All Ratings";
  }
  else {
    ratingBtn.textContent = "Show > 4 Stars";
  }

  var books = document.querySelectorAll(".bookSection");

  books.forEach(function (book) {
    var rating = parseFloat(book.dataset.rating);

    if (showingHighRated) {
      if (rating > 4.0) {
        book.style.display = "block";
      }
      else {
        book.style.display = "none";
      }
    }
    else {
      book.style.display = "block";
    }
  });
}


//Manga function: anime adaptation vs none
var btnAll = document.querySelector("#btnShowAll");
var btnAnime = document.querySelector("#btnAnime");
var btnManga = document.querySelector("#btnMangaOnly");
if (btnAll) { //variable checker so the other pages don't get stuck trying to find
  btnAll.addEventListener("click", filterManga);
}
if (btnAnime) {
  btnAnime.addEventListener("click", filterManga);
}
if (btnManga) {
  btnManga.addEventListener("click", filterManga);
}

function filterManga(event) {
  var clickedBtn = event.currentTarget; //thos
  var filterValue = clickedBtn.dataset.filter;


  var allMangaBtns = document.querySelectorAll(".filterBtn");
  allMangaBtns.forEach(function (btn) { //loop to reset the appearance of the filter buttons
    btn.classList.remove("active-filter");
  });
  //filter button ON
  clickedBtn.classList.add("active-filter");

//this is the variable that will grab each book
  var books = document.querySelectorAll(".bookSection[data-category='manga']");

  books.forEach(function (book) {
    var isAdapted = book.dataset.adapted === "true";

    if (filterValue === "all") {
      book.style.display = "block";
    }
    else if (filterValue === "anime") {
      if (isAdapted) {
        book.style.display = "block";
      }
      else {
        book.style.display = "none";
      }
    }
    else if (filterValue === "manga-only") {
      if (!isAdapted) {
        book.style.display = "block";
      }
      else {
        book.style.display = "none";
      }
    }
  });
}

//Fantasy page function: Books cheaper than $20
var priceBtn = document.querySelector("#priceToggle");
var showingCheapOnly = false; //cheap tracker
if (priceBtn) {
  priceBtn.addEventListener("click", togglePriceFilter);
}


function togglePriceFilter() {
  showingCheapOnly = !showingCheapOnly;


  if (showingCheapOnly) {
    priceBtn.classList.add("active-filter");
    priceBtn.textContent = "Show All Prices";
  }
  else {
    priceBtn.classList.remove("active-filter");
    priceBtn.textContent = "Show Under $20";
  }


  var books = document.querySelectorAll(".bookSection[data-category='fantasy']");

  books.forEach(function (book) {
    var price = parseFloat(book.dataset.price);

    if (showingCheapOnly) {
      if (price < 20.00) {
        book.style.display = "block";
      }
      else {
        book.style.display = "none";
      }
    }
    else {
      // Show everything
      book.style.display = "block";
    }
  });
}

//Thiller page function: Sorting by author name
var sortSelect = document.querySelector("#sortSelect");
var grid = document.querySelector("#bookGrid");

if (sortSelect && grid) {
        var initialBooks = grid.getElementsByClassName("bookSection");
        for (var i = 0; i < initialBooks.length; i++) {
            originalThrillerBooks.push(initialBooks[i]);
        }
        sortSelect.addEventListener("change", sortBooksByAuthor);
    }

function sortBooksByAuthor() {
    var order = document.querySelector("#sortSelect").value;

    if (!grid) return; //helps the other pages ignore this giant function

    if (order === "none") {
        // resetting the array 
        for (var i = 0; i < originalThrillerBooks.length; i++) {
            grid.appendChild(originalThrillerBooks[i]);
        }
    } 
    else {
        
        var books = Array.from(grid.getElementsByClassName("bookSection"));

        books.sort(function (a, b) {
          //(/n) is telling the variables to ignore whatever's in the <strong> section of the book-title class
            var aText = a.querySelector(".book-title").innerText.split("\n"); 
            var bText = b.querySelector(".book-title").innerText.split("\n");

            //[1] is just the author name (ie the not <strong> part, just telling the program to use that)
            var aAuthor = aText[1] ? aText[1].trim().toLowerCase() : ""; 
            var bAuthor = bText[1] ? bText[1].trim().toLowerCase() : "";

            if (order === "asc") {
                return aAuthor.localeCompare(bAuthor); // A-Z
            } else {
                return bAuthor.localeCompare(aAuthor); // Z-A
            }
        });

        // book the newly sorted books back into the grid
        for (var j = 0; j < books.length; j++) {
            grid.appendChild(books[j]);
        }
    }
}

// Adding to wishlist
var allWishlistBtns = document.querySelectorAll(".wishlistBtn");

if (allWishlistBtns.length > 0) {
  allWishlistBtns.forEach(function (btn) {
    btn.addEventListener("click", toggleWishlist);
  });
}

function toggleWishlist(event) {
  var btn = event.currentTarget;

  // getting all the book data
  var bookParent = btn.closest(".bookSection");
  var title = bookParent.querySelector(".book-title strong").innerText;
  var price = bookParent.getAttribute("data-price");

  // check if the book exists in the wishlist already
  var bookIndex = wishlist.findIndex(function (item) {
    return item.title === title;
  });

  // Toggle logic
  if (btn.innerText === "♡ Wishlist") {
    // Add to wishlist
    btn.innerText = "♥ Wishlisted";
    btn.classList.add("active-wishlist");

    if (bookIndex === -1) {
      wishlist.push({ title: title, price: price });
    }
  } else {
    // Remove from wishlist
    btn.innerText = "♡ Wishlist";
    btn.classList.remove("active-wishlist");

    if (bookIndex !== -1) {
      wishlist.splice(bookIndex, 1);
    }
  }

  localStorage.setItem("wishlist", JSON.stringify(wishlist));

}

var wishlistDisplay = document.querySelector("#wishlistItems");
if (wishlistDisplay) {
  window.addEventListener("load", displayWishlist);
}

function displayWishlist() {
  if (!wishlistDisplay) return;
  wishlistDisplay.innerHTML = "";
  var savedWishlist = JSON.parse(localStorage.getItem("wishlist")) || [];

  if (savedWishlist.length === 0) {
    wishlistItems.textContent = "Your wishlist is currently empty!";
    return;
  }

  // Loop through each book in the array and create the HTML
  savedWishlist.forEach(function (book, index) {
    // Create a div for the book
    var bookDiv = document.createElement("div");
    bookDiv.classList.add("wishlist-item");

    bookDiv.innerHTML = `
            <div class="wishlist-info">
                <strong>${book.title}</strong>
                <span>$${book.price}</span>
            </div>
            <button class="remove-btn" onclick="removeFromWishlist(${index})">Remove</button>
        `;

    wishlistDisplay.appendChild(bookDiv);
  });
}

//var remove = document.querySelector();
function removeFromWishlist(index) {
  var savedWishlist = JSON.parse(localStorage.getItem("wishlist")) || [];

  // Remove the item at the specific index
  savedWishlist.splice(index, 1);

  // Save the new list back to LocalStorage
  localStorage.setItem("wishlist", JSON.stringify(savedWishlist));

  // Refresh the display immediately
  displayWishlist();
}




//Checkout Functions

// Add to cart 
var allCarted = document.querySelectorAll(".cartBtn");

if (allCarted.length > 0) {
  allCarted.forEach(function (btn) {
    btn.addEventListener("click", addToCart);
  });
}

function addToCart(event) {
  var btn = event.currentTarget;


  var bookParent = btn.closest(".bookSection");


  var title = bookParent.querySelector(".book-title strong").innerText;
  var price = bookParent.getAttribute("data-price");

  cart.push({ title: title, price: price });
  localStorage.setItem("cart", JSON.stringify(cart));
  alert(title + " added to cart!");

}

var cartDisplay = document.querySelector("#cartItems");
var totalDisplay = document.querySelector("#cartTotal");
if (cartDisplay) {
  window.addEventListener("load", cartMain);
}

function cartMain() {
  if (!cartDisplay) return;

  cartDisplay.innerHTML = "";
  var savedCart = JSON.parse(localStorage.getItem("cart")) || [];
  var total = 0;

  if (savedCart.length === 0) {
    cartDisplay.innerHTML = "Your cart is empty!";
    if (totalDisplay) {
      totalDisplay.innerHTML = "0.00";
    }
    return;
  }

  for (var i = 0; i < savedCart.length; i++) {
    var item = savedCart[i];
    var itemDiv = document.createElement("div");
    itemDiv.className = "cart-item";


itemDiv.innerHTML = "<strong>" + item.title + "</strong> - $" + item.price + 
                    " <button class='remove-btn' onclick='removeFromCart(" + i + ")'>Remove</button>";
    cartDisplay.appendChild(itemDiv);

    // Add to total
    total = total + parseFloat(item.price);
  }
  if (totalDisplay) {
    totalDisplay.innerHTML = total.toFixed(2);
  }
}


function removeFromCart(index) {
  cart.splice(index, 1);
  localStorage.setItem("cart", JSON.stringify(cart));
  cartMain();
}

var checkoutBut = document.querySelector("#checkOutBtn");
checkoutBut.addEventListener("click", transComplete);
var msg = document.querySelector("#message");



function transComplete(event) {
  event.preventDefault(); // form submission won't refresh the page

  var checkoutForm = document.querySelector(".checkout-header");
  var name = document.querySelector("#nameField");
  var mail = document.querySelector("#userEmail");
  var home = document.querySelector("#userAddress");
  var zip = document.querySelector("#postalCode");
  var cardNum = document.querySelector("#cardNum");
  var exp = document.querySelector("#expiry");
  var security = document.querySelector("#cvv");

  var checkoutForm = document.querySelector(".checkout-header");

 if (name.value !== "" && mail.value !== "" && home.value !== "" && zip.value!== "" && cardNum.value !== "" && exp.value !== "" && security.value !== "" ) {
        var name = nameField.value;
        msg.textContent = "Thank you, " + name + "! Your purchase is confirmed.";
        msg.style.color = "green";

        cart = []; 
        localStorage.setItem("cart", JSON.stringify(cart)); 

        name.value = "";
        mail.value = "";
        home.value = "";
        zip.value = "";
        cardNum.value = "";
        exp.value = "";
        security.value = "";

        cartMain();
        
    } else {
        msg.textContent = "ERROR. Please fill out all form fields";
        msg.style.color = "red";
    }

  
}









