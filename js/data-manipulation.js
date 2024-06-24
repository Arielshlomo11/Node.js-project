var productsData = [];
var selectedProductId = -1;

function addProduct(e) {
  e.preventDefault();
  var productObject = {
    userId: firebase.auth().currentUser.uid,
    name: document.getElementById("product-name").value,
    description: document.getElementById("product-description").value,
    category: document.getElementById("product-category").value,
    price: Number(document.getElementById("product-price").value),
    image: document.getElementById("product-image").value,
  };

  try {
    firestoreDB
      .collection("Products")
      .add(productObject)
      .then(function (docRef) {
        alert("Product added with ID: " + docRef.id);
        window.location.href = "./dashboard.html";
        getAllProductsData();
      })
      .catch(function (error) {
        alert("Error adding product: " + error);
      });
  } catch (x) {}
}

// Function to update product data
async function updateProductData(e) {
  e.preventDefault();
  var productObject = {
    userId: firebase.auth().currentUser.uid,
    name: document.getElementById("update-product-name").value,
    description: document.getElementById("update-product-description").value,
    category: document.getElementById("update-product-category").value,
    price: Number(document.getElementById("update-product-price").value),
    image: document.getElementById("update-product-image").value,
  };
  try {
    firestoreDB
      .collection("Products")
      .doc(localStorage.getItem("selectedProductId"))
      .set(productObject, { merge: true })
      .then(function () {
        alert("Product updated successfully.");
        window.location.href = "./dashboard.html";
      })
      .catch(function (error) {
        alert("Error updating product: " + error);
      });
  } catch (error) {
    console.error("Error updating product: ", error);
  }
}

// Function to get all products data
async function getAllProductsData() {
  try {
    firestoreDB
      .collection("Products")
      .get()
      .then(function (querySnapshot) {
        var productTable = document.getElementById("table-content");
        if (productTable) {
          productTable.innerHTML = "";
        }
        querySnapshot.forEach(function (doc) {
          let tableData = `<tr>
            <td><img class='product-logo' src=${doc.data().image} /></td>
            <td>${doc.data().name}</td>
            <td>${doc.data().description}</td>
            <td>${doc.data().category}</td>
            <td>${doc.data().price}</td>
            <td class="action">
                <button onclick="getProductById(event, '${
                  doc.id
                }')">View</button>
                ${
                  doc.data().userId == firebase.auth().currentUser.uid
                    ? `<button onclick="getProductById(event, '${doc.id}', 'update')">Edit</button>`
                    : ""
                }
                ${
                  doc.data().userId == firebase.auth().currentUser.uid
                    ? `<button onclick="deleteProductById(event, '${doc.id}')">Delete</button>`
                    : ""
                }
            </td>
        </tr>`;

          productsData.push({
            userId: doc.data().userId,
            id: doc.id,
            name: doc.data().name,
            description: doc.data().description,
            category: doc.data().category,
            price: doc.data().price,
            image: doc.data().image,
          });

          if (productTable) {
            productTable.innerHTML = productTable?.innerHTML + tableData;
          }
        });
      })
      .catch((error) => {
        alert("Error retrieving data: " + error);
      });
  } catch (x) {}
}

// Function to get product by ID
async function getProductById(event, productId, route) {
  event?.preventDefault();
  if (event) {
    try {
      const doc = await firestoreDB.collection("Products").doc(productId).get();
      if (doc.exists) {
        selectedProductId = productId;
        localStorage.setItem("selectedProductId", productId);
        localStorage.setItem("selectedProductData", JSON.stringify(doc.data()));
        // Redirect to product-detail.html after setting local storage
        window.location.href = !route
          ? "./product-detail.html"
          : "./update-product.html";
      } else {
        alert(`No product found with ID: ${productId}`);
        window.location.href = "./dashboard.html";
      }
    } catch (error) {
      console.error("Error getting product: ", error);
    }
  }
}

// Function to delete product by ID
async function deleteProductById(event, productId) {
  event?.preventDefault();
  if (event) {
    try {
      firestoreDB
        .collection("Products")
        .doc(productId)
        .delete()
        .then(function () {
          alert(`Product ${productId} deleted successfully.`);
          window.location.href = "./dashboard.html";
        })
        .catch(function (error) {
          console.error("Error deleting product: ", error);
        });
    } catch (x) {}
  }
}

function filterData(event) {
  event.preventDefault();
  let searchInput = document.getElementById("search-filter");
  let filteredData = productsData.filter((product) => {
    if (product.name.includes(searchInput.value)) {
      return true;
    } else if (product.category.includes(searchInput.value)) {
      return true;
    } else if (product.price == Number(searchInput.value)) {
      return true;
    }
    return false;
  });

  var productTable = document.getElementById("table-content");
  productTable.innerHTML = "";
  filteredData.forEach(function (product) {
    let tableData = `<tr>
      <td><img class='product-logo' src=${product.image} /></td>
      <td class='text-capitalize'>${product.name}</td>
      <td>${product.description}</td>
      <td class='text-capitalize'>${product.category}</td>
      <td>${product.price}</td>
      <td class="action">
        <button onclick="getProductById(event, '${product.id}')">View</button>
        ${
          product.userId == firebase.auth().currentUser.uid
            ? `<button onclick="getProductById(event, '${product.id}', 'update')">Edit</button>`
            : ""
        }
        ${
          product.userId == firebase.auth().currentUser.uid
            ? `<button onclick="deleteProductById(event, '${product.id}')">Delete</button>`
            : ""
        }
      </td>
  </tr>`;
    if (productTable) {
      productTable.innerHTML = productTable.innerHTML + tableData;
    }
  });
}

function generateRandomProduct(e) {
  e.preventDefault();
  let randomProductId = Math.floor(Math.random() * 194) + 1;

  fetch(`https://dummyjson.com/products/${randomProductId}`)
    .then((res) => res.json())
    .then((product) => {
      let productObject = {
        userId: firebase.auth().currentUser.uid,
        name: product.title,
        description: product.description,
        category: product.category,
        price: product.price,
        image: product.images[0],
      };
      firestoreDB
        .collection("Products")
        .add(productObject)
        .then(function (docRef) {
          alert("Product added with ID: " + docRef.id);
          getAllProductsData();
        })
        .catch(function (error) {
          alert("Error adding product: " + error);
        });
    });
}

function checkIfUserIsAuthenticated() {
  const user = firebase.auth().currentUser;
  if (user) {
    localStorage.setItem("userData", JSON.stringify(user));
    getAllProductsData();
  } else {
    window.location.href = "./login.html";
  }
}

setTimeout(() => {
  checkIfUserIsAuthenticated();
}, 1000);
