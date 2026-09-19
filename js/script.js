const promoButton = document.querySelector("#promoButton");

if (promoButton) {
  promoButton.addEventListener("click", () => {
    promoButton.textContent = "Promo: Beli 2 gratis tester!";
    console.log("Promo Kopi Ku berhasil ditampilkan.");
  });
}

const rows = document.querySelectorAll("tbody tr");
if (rows.length) {
  console.log("Baris data:", rows.length);
}