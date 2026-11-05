"use strict";

console.log("P09 JavaScript aktif");

const produkUmkm = [
  { nama: "Kopi Tubruk Signature", kategori: "Kopi", harga: 18000, stok: 12, unggulan: true },
  { nama: "Cold Brew Aren", kategori: "Kopi", harga: 22000, stok: 4, unggulan: true },
  { nama: "Coffee Latte", kategori: "Kopi", harga: 20000, stok: 15, unggulan: false },
  { nama: "Americano", kategori: "Kopi", harga: 15000, stok: 20, unggulan: false },
  { nama: "Caramel Macchiato", kategori: "Kopi", harga: 23000, stok: 0, unggulan: false },
  { nama: "Matcha Latte", kategori: "Non-Kopi", harga: 22000, stok: 10, unggulan: false },
  { nama: "Paket Seduh Rumahan", kategori: "Bundling", harga: 75000, stok: 0, unggulan: false },
];

function formatRupiah(nilai) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(nilai);
}

console.log("Tes formatRupiah:", formatRupiah(85000));
console.log("Harga produk pertama:", formatRupiah(produkUmkm[0].harga));

function statusStok(stok) {
  if (stok <= 0) {
    return { label: "Habis", className: "empty" };
  }

  if (stok <= 5) {
    return { label: "Stok terbatas", className: "warning" };
  }

  return { label: "Tersedia", className: "" };
}

console.log(statusStok(0));
console.log(statusStok(3));
console.log(statusStok(12));

function labelKategori(kategori) {
  switch (kategori) {
    case "Kopi":
      return "Produk kopi pilihan";
    case "Non-Kopi":
      return "Minuman non-kopi";
    case "Bundling":
      return "Paket hemat";
    default:
      return "Produk UMKM";
  }
}

function buatKartuProduk(produk) {
  const status = statusStok(produk.stok);
  const kategori = labelKategori(produk.kategori);
  const labelAksi = produk.stok > 0 ? "Siap dipesan" : "Hubungi admin";

  return `
    <article class="js-product-card">
      <h3>${produk.nama}</h3>
      <p class="category-note">${kategori}</p>
      <p class="price">${formatRupiah(produk.harga)}</p>
      <span class="stock-badge ${status.className}">${status.label}</span>
      <p>${labelAksi}</p>
    </article>
  `;
}

function renderProduk() {
  const grid = document.querySelector("#produk-dinamis");
  const ringkasan = document.querySelector("#produk-ringkasan");
  const unggulan = document.querySelector("#produk-unggulan");

  if (!grid || !ringkasan || !unggulan) {
    console.warn("Target render produk belum lengkap.");
    return;
  }

  produkUmkm.forEach((produk) => {
    console.log("Debug produk:", produk.nama, "stok:", produk.stok);
  });
  console.table(produkUmkm);

  const produkTersedia = produkUmkm.filter((produk) => produk.stok > 0);
  const produkUnggulan = produkUmkm.find((produk) => produk.unggulan === true);
  const markupProduk = produkTersedia.map(buatKartuProduk).join("");

  console.log("Jumlah produk tersedia:", produkTersedia.length);

  grid.innerHTML = markupProduk;
  ringkasan.textContent = `${produkTersedia.length} produk tersedia dari ${produkUmkm.length} data.`;

  unggulan.textContent = produkUnggulan
    ? `Produk unggulan: ${produkUnggulan.nama}`
    : "Belum ada produk unggulan.";
}

document.addEventListener("DOMContentLoaded", renderProduk);