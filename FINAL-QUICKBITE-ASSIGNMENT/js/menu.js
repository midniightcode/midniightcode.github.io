// HEADER SCROLL EFFECT
const header = document.querySelector("header");
if (header) {
    window.addEventListener("scroll", () => {
        header.classList.toggle("scrolled", window.scrollY > 50);
    });
}

// --- CART LOGIC ---
let cart = JSON.parse(localStorage.getItem('qb-cart')) || [];

function toggleCart() {
    const sidebar = document.getElementById('cart-sidebar');
    if (sidebar) {
        sidebar.classList.toggle('active');
    }
}

// UPDATE: We added 'qty' as a third parameter
function addToCart(name, price, qty = 1, description = "") {

    const singleItemPrice = parseFloat(price) / qty;
    // 1. Check if the item already exists in the cart
    const existingItem = cart.find(item =>
        item.name === name &&
        item.price === singleItemPrice &&
        item.description === description
    );

    if (existingItem) {
        existingItem.quantity += qty;
        
    } else {
        cart.push({
            name: name,
            price: singleItemPrice,
            quantity: qty,
            description: description,
            id: Date.now()
        });
    }

    updateCart();
    if (navigator.vibrate) navigator.vibrate(50);
}



function updateCart() {
    const container = document.getElementById('cart-items-container');
    const countLabel = document.getElementById('cart-count');
    const totalLabel = document.getElementById('cart-total-amount');
    const checkoutBtn = document.getElementById('checkout-btn');

    if (!container) return;

    container.innerHTML = '';
    let grandTotal = 0;
    let totalItems = 0;

    if (cart.length === 0) {
        container.innerHTML = '<p style="text-align:center; padding: 20px; color: #888;">Your cart is empty!</p>';
        if (checkoutBtn) checkoutBtn.style.display = 'none';
    } else {
        if (checkoutBtn) checkoutBtn.style.display = 'block';
        cart.forEach(item => {

            const rowTotal = item.price * item.quantity;
            grandTotal += rowTotal;
            totalItems += item.quantity;

            container.innerHTML += `
                <div class="cart-item">
                    <div class="cart-item-header">
                        <div class="cart-item-details">
                            <h4>${item.name}</h4>
                            <p>${item.description}</p>
                        </div>
                        <p class="cart-item-price">$${rowTotal.toFixed(2)}</p>
                    </div>
                    
                    <div class="cart-item-actions">
                        <div class="cart-qty-controls">
                            <button onclick="changeQty(${item.id}, -1)" class="cart-qty-btn">-</button>
                            <span class="cart-qty-value">${item.quantity}</span>
                            <button onclick="changeQty(${item.id}, 1)" class="cart-qty-btn">+</button>
                        </div>
                        <button onclick="removeItem(${item.id})" class="cart-remove-btn">Remove All</button>
                    </div>
                </div>
            `;
        });
    }

    if (countLabel) countLabel.textContent = totalItems;
    if (totalLabel) totalLabel.textContent = `$${grandTotal.toFixed(2)}`;

    localStorage.setItem('qb-cart', JSON.stringify(cart));
}

function changeQty(id, delta) {
    const item = cart.find(i => i.id === id);
    if (item) {
        item.quantity += delta;

        if (item.quantity <= 0) {
            removeItem(id);
        } else {
            // Use the basePrice to update the total
            item.totalPrice = item.basePrice * item.quantity;
            updateCart();
        }
    }
}

function removeItem(id) {
    cart = cart.filter(item => item.id !== id);
    updateCart();
}


function openCheckout() {
    const checkoutModal = document.getElementById('checkout-modal');
    const orderSummary = document.getElementById('order-summary');

    if (!checkoutModal || !orderSummary) {
        console.error("Checkout elements not found!");
        return;
    }

    if (cart.length === 0) {
        alert("Your cart is empty! Please add items before checking out.");
        return;
    }

    orderSummary.innerHTML = '';
    let grandTotal = 0;

    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        grandTotal += itemTotal;

        orderSummary.innerHTML += `
            <div style="display: flex; justify-content: space-between; margin-bottom: 10px; border-bottom: 1px solid #eee; padding-bottom: 5px;">
                <div style="text-align: left;">
                    <strong style="display:block;">${item.name} (x${item.quantity})</strong>
                    <small style="color: #666; font-style: italic;">${item.description}</small>
                </div>
                <span style="font-weight: bold;">$${itemTotal.toFixed(2)}</span>
            </div>
        `;
    });

    orderSummary.innerHTML += `
        <div style="display: flex; justify-content: space-between; margin-top: 15px; padding-top: 10px; border-top: 2px solid #333;">
            <strong style="font-size: 1.2rem;">TOTAL:</strong>
            <strong style="font-size: 1.2rem; color: #341206;">$${grandTotal.toFixed(2)}</strong>
        </div>
    `;

    checkoutModal.classList.add('show');
    
    // Close the cart sidebar so it's not in the way
    const sidebar = document.getElementById('cart-sidebar');
    if (sidebar) sidebar.classList.remove('active');
}

function closeCheckout() {
    document.getElementById('checkout-modal').classList.remove('show');
}


//MIGHT NEED TO DELETE
const paymentForm = document.getElementById('payment-form');
if (paymentForm) {
  paymentForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('cust-name').value;
      const method = document.getElementById('pay-method').value;
      const date = document.getElementById('order-date').value;

      // Generate random order number
      const orderNum = 'QB' + Math.floor(Math.random() * 100000);
      const displaySpan = document.getElementById('display-order-num');
      if(displaySpan) displaySpan.textContent = orderNum;

      // Save order to localStorage
      localStorage.setItem('qb-lastOrderNum', orderNum);

      // Empty cart
      cart = [];
      updateCart(); 
      closeCheckout(); 
      paymentForm.reset(); 

      // Open Success Modal
      const successModal = document.getElementById('success-modal');
      if(successModal) {
          successModal.classList.add('show');
      }
  });
}

function closeSuccess() {
    const successModal = document.getElementById('success-modal');
    if (successModal) {
        successModal.classList.remove('show');
    }
}

function copyOrder() {
    const orderNum = document.getElementById('display-order-num').textContent;
    if (navigator.clipboard) {
        navigator.clipboard.writeText("Order #" + orderNum).then(() => {
            alert("Order number copied to clipboard!");
            if (navigator.vibrate) navigator.vibrate(100);
        }).catch(err => {
            alert("Failed to copy text: " + err);
        });
    } else {
        alert("Clipboard API not supported in this browser.");
    }
}

async function shareReceipt() {
    const orderNum = document.getElementById('display-order-num').textContent;
    if (navigator.share) {
        try {
            await navigator.share({
                title: "QuickBite BBQ Receipt",
                text: "Here is my QuickBite order: #" + orderNum,
                url: window.location.href
            });
            if (navigator.vibrate) navigator.vibrate(100);
        } catch (err) {
            console.log("Error sharing or user cancelled: ", err);
        }
    } else {
        alert("Sharing is not supported on this browser/device.");
    }
}


updateCart();





//-----------------------END OF CART LOGIC----------------------//


document.addEventListener("DOMContentLoaded", () => {
    // --- ELEMENTS ---
    const hamburger = document.getElementById("hamburger");
    const nav = document.getElementById("nav-links");
    const modal = document.getElementById("item-modal");
    const modalImage = document.getElementById("modal-image");
    const modalName = document.querySelector(".modal-item-name");
    const optionsContainer = document.querySelector(".modal-options");
    const addButtons = document.querySelectorAll(".add-btn");
    const closeBtn = document.querySelector(".close-btn");
    const qtyNumber = document.querySelector(".qty-number");
    const minusBtn = document.querySelector(".qty-minus");
    const plusBtn = document.querySelector(".qty-plus");
    const modalAddBtn = document.querySelector(".modal-add");
    const categoryButtons = document.querySelectorAll(".menu-categories button");
    const menuItems = document.querySelectorAll(".menu-card");

    // --- STATE ---
    let quantity = 1;
    let basePrice = 0;
    let currentPrice = 0;

    // --- HAMBURGER MENU ---
    if (hamburger && nav) {
        hamburger.addEventListener("click", () => {
            nav.classList.toggle("active");
        });
    }


    //SCANNER//
    function getSelectedOptionsText() {
    
        if (!optionsContainer) return "";

        let selected = [];

        // Grabs checked checkboxes and radios
        const inputs = optionsContainer.querySelectorAll('input:checked');
        inputs.forEach(input => {
            const labelText = input.parentElement.textContent.trim();
            selected.push(labelText);
        });

        // Grabs the selected flavor from dropdowns
        const selects = optionsContainer.querySelectorAll('select');
        selects.forEach(select => {
            if (select.value) selected.push(select.value);
        });

        return selected.length > 0 ? selected.join(", ") : "Standard";
    }


    // --- CATEGORY FILTER ---
    categoryButtons.forEach(button => {
        button.addEventListener("click", () => {
            categoryButtons.forEach(btn => btn.classList.remove("active"));
            button.classList.add("active");

            const category = button.dataset.category;
            menuItems.forEach(item => {
                const isFeatured = item.dataset.featured === "true";
                const match =
                    category === "all" ||
                    item.dataset.category === category ||
                    (category === "featured" && isFeatured);

                item.style.display = match ? "flex" : "none";
            });
        });
    });

    // --- UI HELPERS ---
    function updateQtyDisplay() {
        qtyNumber.textContent = quantity;
    }

    function updatePrice() {
        let extras = 0;

        // 1. Scan for all checked boxes/radios
        const selectedOptions = optionsContainer.querySelectorAll('input:checked');

        selectedOptions.forEach(opt => {
            // 2. Look for the "+$X.XX" pattern in the label text
            const labelText = opt.parentElement.textContent;
            const match = labelText.match(/\+\$([0-9.]+)/);
            if (match) {
                extras += parseFloat(match[1]);
            }
        });

        // 3. Add those extras to the base price of the item
        currentPrice = basePrice + extras;

        // 4. Multiply by quantity and update the button text
        const total = (currentPrice * quantity).toFixed(2);
        modalAddBtn.textContent = `Add to Cart - $${total}`;
    }

    function limitSides(max) {
        const group = optionsContainer.querySelector(".sides-group");
        if (!group) return;
        const checkboxes = group.querySelectorAll('input[type="checkbox"]');
        checkboxes.forEach(box => {
            box.addEventListener("change", () => {
                const checked = group.querySelectorAll('input[type="checkbox"]:checked');
                if (checked.length > max) {
                    box.checked = false;
                }
            });
        });
    }

    // --- MODAL OPEN LOGIC ---
    addButtons.forEach(button => {
        button.addEventListener("click", (e) => {
            // Prevent event bubbling if the card itself has a click listener
            e.stopPropagation();

            const card = e.target.closest(".menu-card");
            if (!card) return;

            const img = card.querySelector("img").src;
            const name = card.querySelector("h3").textContent;
            const priceText = card.querySelector(".price").textContent;

            // Extract numbers and decimals only
            basePrice = parseFloat(priceText.replace(/[^0-9.]/g, ""));
            const type = card.dataset.type;

            // Reset state
            quantity = 1;
            currentPrice = basePrice;

            // Set content
            modalImage.src = img;
            modalName.textContent = name;

            
            // Build Options based on type
            renderOptions(type);

            updateQtyDisplay();
            updatePrice();
            modal.classList.add("show");
        });
    });

    // --- MODAL OPTIONS RENDERER ---
    function renderOptions(type) {
        switch (type) {
            case "brisket-plate":
            case "ribs-plate":
                optionsContainer.innerHTML = `
                    <div class="sides-group">
                        <p>Choose 2 sides:</p>
                        <label><input type="checkbox"> Coleslaw</label>
                        <label><input type="checkbox"> Green Beans</label>
                        <label><input type="checkbox"> Onion Rings</label>
                        <label><input type="checkbox"> Corn</label>
                        <label><input type="checkbox"> Potato Salad</label>
                    </div>
                    <div class="drink-group">
                        <p>Drink:</p>
                        <select>
                            <option>Coca-Cola</option><option>Dr Pepper</option>
                            <option>Sprite</option><option>Lemonade</option>
                            <option>Water</option>
                        </select>
                    </div>`;
                limitSides(2);
            break;

            case "sandwich":
                optionsContainer.innerHTML = `
                    <label><input type="checkbox"> Extra Meat (+$3)</label>
                    <label><input type="checkbox"> BBQ Sauce (+$1)</label>
                    <label><input type="checkbox"> Jalapeños (+$0.50)</label>`;
            break;

            case "potato-plain":
                optionsContainer.innerHTML = `
                        <label><input type="checkbox"> Cheese (+$1)</label>
                        <label><input type="checkbox"> Bacon (+$2)</label>
                    `;
            break;


            case "potato-loaded1":
                optionsContainer.innerHTML = `
                        <label><input type="checkbox"> Extra Meat (+$3)</label>
                        <label><input type="checkbox"> Extra Cheese (+$1)</label>
                        <label><input type="checkbox"> Extra chili Sauce (+$1)</label>
                        <label><input type="checkbox"> Jalapeños (+$0.50)</label>
                    `;
            break;   

            case "potato-loaded2":
                optionsContainer.innerHTML = `
                        <label><input type="checkbox"> Extra Meat (+$3)</label>
                        <label><input type="checkbox"> Extra Cheese (+$1)</label>
                        <label><input type="checkbox"> BBQ Sauce (+$1)</label>
                        <label><input type="checkbox"> Add Sour Cream (+$0.75)</label>
                        <label><input type="checkbox"> Jalapeños (+$0.50)</label>
                    `;
            break;

            case "potato-loaded3":
                optionsContainer.innerHTML = `
                        <label><input type="checkbox"> Extra Meat (+$3)</label>
                        <label><input type="checkbox"> Extra Cheese (+$1)</label>
                        <label><input type="checkbox"> BBQ Sauce (+$1)</label>
                        <label><input type="checkbox"> Extra Sour Cream (+$0.75)</label>
                        <label><input type="checkbox"> Jalapeños (+$0.50)</label>
                    `;
            break;

            case "potato-simple":
                optionsContainer.innerHTML = `
                        <label><input type="checkbox"> Add Sour Cream (+$0.75)</label>
                        <label><input type="checkbox"> Add Butter (+$0.50)</label>
                        <label><input type="checkbox"> Extra Meat (+$0.25)</label>
                    `;
            break;

            //SIDES//

            case "sides":
                optionsContainer.innerHTML = `
                        <label><input type="radio" name="size"> Small</label>
                        <label><input type="radio" name="size"> Medium (+$1)</label>
                        <label><input type="radio" name="size"> Large (+$2)</label>
                    `;
            break;

            case "veggies":
                optionsContainer.innerHTML = `
                    <p>Choose size:</p>
                        <label><input type="radio" name="size">Full Cob ($8.00)</label>
                        <label><input type="radio" name="size">Half Cob</label>
                    <p>Extras:</p>
                        <label><input type="checkbox"> Add Butter</label>
                        <label><input type="checkbox"> Add Seasoning</label>
                    `;
            break;

            //DESSERTS//

            case "dessert-cobblers":
                optionsContainer.innerHTML = `
                        <label><input type="checkbox"> Add Ice Cream (+$1.50)</label>
                    `;
            break;  

            case "cold-dessert":
                optionsContainer.innerHTML = `
                    <p>Choose Cone or Cup:</p>
                        <label><input type="radio" name="container"> Waffle Cone</label>
                        <label><input type="radio" name="container"> Cake Cone</label>
                        <label><input type="radio" name="container"> Cup</label>

                    <p>Choose amount:</p>
                        <label><input type="radio" name="size"> Single Scoop</label>
                        <label><input type="radio" name="size"> Double Scoop (+$1)</label>
                    `;
            break;

            case "dessert":
                optionsContainer.innerHTML = `
                    <p>A delicious peacan pie slice, perfect for that sweet spot</p>
                `;
            break;


            //DRINKS//

            case "drink":
                optionsContainer.innerHTML = `
                    <label><input type="radio" name="size"> Small</label>
                    <label><input type="radio" name="size"> Medium (+$0.50)</label>
                    <label><input type="radio" name="size"> Large (+$1)</label>
                `;
            break;

            case "drink-fountain":
                optionsContainer.innerHTML = `
                    <p>Choose size:</p>
                        <label><input type="radio" name="size"> Small</label>
                        <label><input type="radio" name="size"> Medium (+$0.50)</label>
                        <label><input type="radio" name="size"> Large (+$1)</label>

                    <p>Flavor:</p>
                    <select>
                        <option>Coca-Cola</option>
                        <option>Pepsi</option>
                        <option>Sprite</option>
                        <option>Dr Pepper</option>
                        <option>Mountain Dew</option>
                        <option>Fanta</option>
                        <option>Lemonade</option>
                    </select>`;
                break;

            case "drink-glass-bottle":
                optionsContainer.innerHTML = `
                    <p>Choose flavor:</p>
                    <select>
                        <option>Mexican Cola</option>
                        <option>Fruit Punch</option>
                        <option>Pineapple</option>
                        <option>Watermelon</option>
                        <option>Mango</option>
                        <option>Mandarin</option>
                        <option>Strawberry Fresa</option>
                        <option>Lime</option>
                        <option>Guava</option>
                        <option>Grapefruit</option>
                    </select>`;
                break;

            default:
                optionsContainer.innerHTML = `<p>Standard preparation</p>`;
        }

        // This makes the price update the moment you click a checkbox
        const inputs = optionsContainer.querySelectorAll('input');
        inputs.forEach(input => {
            input.addEventListener('change', updatePrice);
        });
    }

    // --- QUANTITY CONTROLS ---
    plusBtn.addEventListener("click", () => {
        quantity++;
        updateQtyDisplay();
        updatePrice();
    });

    minusBtn.addEventListener("click", () => {
        if (quantity > 1) {
            quantity--;
            updateQtyDisplay();
            updatePrice();
        }
    });

    // --- CLOSE MODAL ---
    const closeModal = () => {
        modal.classList.remove("show");
    };

    closeBtn.addEventListener("click", closeModal);
    window.addEventListener("click", (e) => {
        if (e.target === modal) closeModal();
    });

    // --- ADD TO CART LOGIC ---
    modalAddBtn.addEventListener("click", () => {
        const itemName = modalName.textContent;
        // We use the total calculated price (price * quantity)
        const itemTotalPrice = parseFloat(currentPrice * quantity);

        const itemDescription = getSelectedOptionsText();

        // 1. Call the cart function (Make sure this function is defined in your script!)
        if (typeof addToCart === "function") {
            addToCart(itemName, itemTotalPrice, quantity, itemDescription);
        }

        // 2. Provide feedback (Part 2: Vibration Requirement)
        if (navigator.vibrate) {
            navigator.vibrate(50);
        }

        // 3. Save "Last Added" to LocalStorage (Part 3: Requirement)
        localStorage.setItem('lastItemAdded', itemName);

        // 4. Close the modal and open the cart sidebar
        closeModal();

        // Add a tiny delay so the user sees the modal close before the cart slides in
        setTimeout(() => {
            if (typeof toggleCart === "function") {
                toggleCart();
            }
        }, 300);
    });

    // Checkout functions are defined in the global scope above

    // --- DEEP LINK LOGIC ---
    const params = new URLSearchParams(window.location.search);
    const itemType = params.get("item");

    if (itemType) {
        const targetItem = document.querySelector(`.menu-card[data-type="${itemType}"]`);
        if (targetItem) {
            const category = targetItem.dataset.category;
            const targetButton = document.querySelector(`.menu-categories button[data-category="${category}"]`);
            const itemButton = targetItem.querySelector(".add-btn");
            if (itemButton) {
                itemButton.click(); // This forces the modal to open
            }

            if (targetButton) targetButton.click();

            setTimeout(() => {
                targetItem.scrollIntoView({ behavior: "smooth", block: "center" });
                targetItem.classList.add("highlight");
                setTimeout(() => targetItem.classList.remove("highlight"), 1500);
            }, 1000);
        }
    }

});
