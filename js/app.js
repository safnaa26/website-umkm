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

const produkGrid = document.querySelector("#produk-grid");
const produkStatus = document.querySelector("#produk-status");
const tombolFilter = document.querySelectorAll("[data-filter]");

console.log("Target grid:", produkGrid);
console.log("Target status:", produkStatus);
console.log("Jumlah tombol filter:", tombolFilter.length);

function buatElemenProduk(produk) {
  const card = document.createElement("article");
  card.classList.add("product-card");

  const title = document.createElement("h3");
  title.textContent = produk.nama;

  const category = document.createElement("p");
  category.classList.add("category-note");
  category.textContent = produk.kategori;

  const price = document.createElement("p");
  price.classList.add("price");
  price.textContent = formatRupiah(produk.harga);

  const stock = document.createElement("span");
  const status = statusStok(produk.stok);
  stock.classList.add("stock-badge");
  if (status.className) {
    stock.classList.add(status.className);
  }
  stock.textContent = status.label;

  card.append(title, category, price, stock);

  const removeButton = document.createElement("button");
  removeButton.type = "button";
  removeButton.textContent = "Sembunyikan";
  removeButton.classList.add("ghost-button");

  removeButton.addEventListener("click", () => {
    card.remove();
    produkStatus.textContent = "Satu kartu disembunyikan dari tampilan sementara.";
  });

  card.append(removeButton);

  return card;
}

function buatEmptyState(kategori) {
  const empty = document.createElement("p");
  empty.classList.add("empty-state");
  empty.textContent = `Belum ada produk pada kategori ${kategori}.`;
  return empty;
}

function renderProduk(kategoriAktif = "Semua") {
  if (!produkGrid || !produkStatus) {
    console.warn("Target render produk tidak ditemukan.");
    return;
  }

  console.log("Render kategori:", kategoriAktif);

  const produkTampil = kategoriAktif === "Semua"
    ? produkUmkm
    : produkUmkm.filter((produk) => produk.kategori === kategoriAktif);

  produkGrid.replaceChildren();

  if (produkTampil.length === 0) {
    produkGrid.append(buatEmptyState(kategoriAktif));
    produkStatus.textContent = "0 produk ditemukan.";
    return;
  }

  produkTampil.forEach((produk) => {
    produkGrid.append(buatElemenProduk(produk));
  });

  produkStatus.textContent = `${produkTampil.length} produk ditampilkan.`;
}

renderProduk();

tombolFilter.forEach((tombol) => {
  tombol.addEventListener("click", (event) => {
    const tombolAktif = event.currentTarget;
    const kategori = tombolAktif.dataset.filter;

    tombolFilter.forEach((item) => item.classList.remove("is-active"));
    tombolAktif.classList.add("is-active");

    renderProduk(kategori);
  });
});