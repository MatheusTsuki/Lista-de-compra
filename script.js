
const productForm = document.getElementById("productForm");
const productName = document.getElementById("productName");
const productPrice = document.getElementById("productPrice");
const productList = document.getElementById("productList");

const total = document.getElementById("total");
const count = document.getElementById("count");
const completed = document.getElementById("completed");
const emptyMessage = document.getElementById("emptyMessage");
const clearButton = document.getElementById("clearButton");

// Recuperar produtos salvos
let products = JSON.parse(localStorage.getItem("products")) || [];

// Salvar produtos
function saveProducts() {
    localStorage.setItem("products", JSON.stringify(products));
}

// Formatar valores
function formatMoney(value) {
    return value.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });
}

// Atualizar a tela
function updateScreen() {
    productList.innerHTML = "";

    let totalValue = 0;
    let purchasedCount = 0;

    products.forEach((product) => {
        totalValue += product.price;

        if (product.purchased) {
            purchasedCount++;
        }

        const item = document.createElement("div");
        item.className = "product";

        if (product.purchased) {
            item.classList.add("purchased");
        }

        const info = document.createElement("div");
        info.className = "product-info";

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = product.purchased;

        checkbox.addEventListener("change", () => {
            product.purchased = checkbox.checked;
            saveProducts();
            updateScreen();
        });

        const name = document.createElement("span");
        name.className = "product-name";
        name.textContent = product.name;

        const price = document.createElement("span");
        price.className = "product-price";
        price.textContent = formatMoney(product.price);

        const deleteButton = document.createElement("button");
        deleteButton.className = "delete-button";
        deleteButton.textContent = "Excluir";

        deleteButton.addEventListener("click", () => {
            products = products.filter(p => p.id !== product.id);
            saveProducts();
            updateScreen();
        });

        info.appendChild(checkbox);
        info.appendChild(name);

        item.appendChild(info);
        item.appendChild(price);
        item.appendChild(deleteButton);

        productList.appendChild(item);
    });

    total.textContent = formatMoney(totalValue);
    count.textContent = `${products.length} produtos`;
    completed.textContent = `${purchasedCount} comprados`;

    emptyMessage.style.display =
        products.length === 0 ? "block" : "none";

    clearButton.style.display =
        products.length === 0 ? "none" : "block";
}

// Adicionar produto
productForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const name = productName.value.trim();
    const price = Number(productPrice.value);

    if (!name || !Number.isFinite(price) || price <= 0) {
        alert("Digite um nome e um preço válido!");
        return;
    }

    const newProduct = {
        id: Date.now(),
        name: name,
        price: price,
        purchased: false
    };

    products.push(newProduct);

    saveProducts();
    updateScreen();

    productForm.reset();
    productName.focus();
});

// Limpar lista
clearButton.addEventListener("click", () => {
    const confirmClear = confirm(
        "Tem certeza que deseja apagar todos os produtos?"
    );

    if (confirmClear) {
        products = [];
        saveProducts();
        updateScreen();
    }
});

// Mostrar produtos ao abrir a página
updateScreen();
