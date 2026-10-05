/**
 * ========================================================
 * Expense Tracker App — main.js
 * ========================================================
 * Tulis seluruh kode JavaScript kamu di sini.
 */

// TODO [Basic] Buat variabel array untuk menyimpan semua data transaksi, contoh: let transactions = []
// TODO [Basic] Buat fungsi untuk menghasilkan ID unik secara otomatis, contoh: gunakan +new Date()

let transactions = [];
let editTransactionId = null;

function genereteId() {
  return +new Date();
}

/**
 * ========================================================
 * Kriteria 1: Memanipulasi DOM untuk Form dan Daftar Transaksi
 * ========================================================
 */
// TODO [Basic] Ambil elemen kontainer incomeList dan expenseList dari DOM

const income = document.getElementById("incomeList");
const expense = document.getElementById("expenseList");

transactions = JSON.parse(localStorage.getItem("transaksi")) || [];

renderTransaksi();
updateDashboard();

/**
 * TODO [Basic]:
 * Buat fungsi untuk menampilkan (render) semua transaksi ke layar:
 *  - Kosongkan kontainer terlebih dahulu sebelum mengisi ulang
 *  - Gunakan perulangan, buat setiap elemen kartu dengan document.createElement()
 *  - Pastikan setiap elemen memiliki atribut data-testid yang sesuai (lihat panduan di rubrik)
 *  - Masukkan kartu ke kontainer yang tepat: income → incomeList, expense → expenseList
 */

function renderTransaksi(data = transactions) {
  income.innerHTML = "";
  expense.innerHTML = "";

  for (const transaksi of data) {
    const kartu = document.createElement("div");
    const boxButton = document.createElement("div");
    const judul = document.createElement("h3");
    const nominal = document.createElement("p");
    const tanggal = document.createElement("p");
    const tipe = document.createElement("p");
    const removeButton = document.createElement("button");
    const updateButton = document.createElement("button");
    const changeTypeButton = document.createElement("button");

    kartu.setAttribute("data-testid", "transactionItem");
    judul.setAttribute("data-testid", "transactionItemTitle");
    nominal.setAttribute("data-testid", "transactionItemAmount");
    tanggal.setAttribute("data-testid", "transactionItemDate");
    tipe.setAttribute("data-testid", "transactionItemType");
    removeButton.setAttribute("data-testid", "transactionItemDeleteButton");
    changeTypeButton.setAttribute(
      "data-testid",
      "transactionItemEditTypeButton",
    );

    judul.innerText = transaksi.title;
    nominal.innerText = `Nominal: Rp${transaksi.amount}`;
    tanggal.innerText = `Tanggal: ${transaksi.date}`;

    removeButton.innerText = "Hapus";
    updateButton.innerText = "Edit";
    changeTypeButton.innerText = "Ubah Tipe";

    if (transaksi.type === "income") {
      tipe.innerText = "Tipe: Pemasukan";
    } else if (transaksi.type === "expense") {
      tipe.innerText = "Tipe: Pengeluaran";
    }

    //remove
    removeButton.addEventListener("click", function () {
      const removeIdTransaksi = transaksi.id;

      transactions = transactions.filter(
        (item) => item.id !== removeIdTransaksi,
      );

      localStorage.setItem("transaksi", JSON.stringify(transactions));

      document.dispatchEvent(new Event("transaction:updated"));
    });

    //update
    updateButton.addEventListener("click", function () {
      const updateTransaksiTitle = transaksi.title;
      const updateTransaksiNominal = transaksi.amount;
      const updateTransaksiDate = transaksi.date;
      const updateTransaksiType = transaksi.type;

      editTransactionId = transaksi.id;

      document.getElementById("transactionFormTitleInput").value =
        updateTransaksiTitle;

      document.getElementById("transactionFormAmountInput").value =
        updateTransaksiNominal;

      document.getElementById("transactionFormDateInput").value =
        updateTransaksiDate;

      document.getElementById("transactionFormTypeSelect").value =
        updateTransaksiType;
    });

    //ubah tipe
    changeTypeButton.addEventListener("click", function () {
      const index = transactions.findIndex((item) => item.id === transaksi.id);

      if (index !== -1) {
        if (transactions[index].type === "income") {
          transactions[index].type = "expense";
        } else {
          transactions[index].type = "income";
        }

        localStorage.setItem("transaksi", JSON.stringify(transactions));

        document.dispatchEvent(new Event("transaction:updated"));
      }
    });

    kartu.appendChild(judul);
    kartu.appendChild(nominal);
    kartu.appendChild(tanggal);
    kartu.appendChild(tipe);
    kartu.appendChild(boxButton);

    boxButton.appendChild(updateButton);
    boxButton.appendChild(changeTypeButton);
    boxButton.appendChild(removeButton);

    if (transaksi.type === "income") {
      income.appendChild(kartu);
    } else if (transaksi.type === "expense") {
      expense.appendChild(kartu);
    }
  }
}

// TODO [Basic] Tambahkan event listener 'submit' pada form, panggil e.preventDefault() di dalamnya
// TODO [Basic] Di dalam handler submit, ambil nilai input lalu tambahkan sebagai objek transaksi baru ke array

const transaksiForm = document.getElementById("transactionForm");
const searchTransaksi = document.getElementById("searchTransactionForm");

transaksiForm.addEventListener("submit", function (e) {
  e.preventDefault();
  formTransaksi();
});

function formTransaksi() {
  const title = document.getElementById("transactionFormTitleInput").value;
  const amount = Number(
    document.getElementById("transactionFormAmountInput").value,
  );
  const date = document.getElementById("transactionFormDateInput").value;
  const typeSelect = document.getElementById("transactionFormTypeSelect").value;

  if (title === "") {
    alert("harap isi Title nya!");
    return;
  }

  if (amount < 1) {
    alert("harap berikan nilai lebih dari 1");
    return;
  }

  if (editTransactionId !== null) {
    const index = transactions.findIndex(
      (item) => item.id === editTransactionId,
    );

    if (index !== -1) {
      transactions[index].title = title;
      transactions[index].amount = amount;
      transactions[index].date = date;
      transactions[index].type = typeSelect;
    }

    editTransactionId = null;
  } else {
    const filterObject = {
      id: genereteId(),
      title: title,
      amount: amount,
      date: date,
      type: typeSelect,
    };

    transactions.push(filterObject);
  }

  localStorage.setItem("transaksi", JSON.stringify(transactions));

  document.dispatchEvent(new Event("transaction:updated"));

  document.getElementById("transactionFormTitleInput").value = "";
  document.getElementById("transactionFormAmountInput").value = "";
  document.getElementById("transactionFormDateInput").value = "";
  document.getElementById("transactionFormTypeSelect").value = "income";
}

searchTransaksi.addEventListener("submit", function (e) {
  e.preventDefault();
  filtersearch();
});

function filtersearch() {
  const titleSearch = document
    .getElementById("searchTransactionFormTitleInput")
    .value.toLowerCase();

  const filterData = transactions.filter((transaksi) =>
    transaksi.title.toLowerCase().includes(titleSearch),
  );

  renderTransaksi(filterData);
}

/**
 * TODO [Skilled]:
 * Tambahkan validasi input sebelum menyimpan data:
 *  - Tampilkan alert() dan hentikan proses jika judul kosong
 *  - Tampilkan alert() dan hentikan proses jika nominal kurang dari 1
 */

/**
 * TODO [Advanced]:
 * Setiap kali data transaksi berubah, perbarui Panel Dasbor:
 *  - Hitung total pemasukan, total pengeluaran, dan saldo (pemasukan - pengeluaran)
 *  - Tampilkan hasilnya ke elemen yang sesuai di HTML
 */

function updateDashboard() {
  let totalIncome = 0;
  let totalExpense = 0;

  for (const transaksi of transactions) {
    if (transaksi.type === "income") {
      totalIncome += transaksi.amount;
    } else if (transaksi.type === "expense") {
      totalExpense += transaksi.amount;
    }
  }

  const balance = totalIncome - totalExpense;

  document.querySelector(".tracker-summary__balance-amount").innerText =
    `Rp ${balance}`;

  document.querySelector(".tracker-summary__stat-amount--income").innerText =
    `Rp ${totalIncome}`;

  document.querySelector(".tracker-summary__stat-amount--expense").innerText =
    `Rp ${totalExpense}`;
}

/**
 * ========================================================
 * Kriteria 2: Mengelola Penyimpanan Data (Web Storage API)
 * ========================================================
 */
/**
 * TODO [Basic]:
 * Data transaksi disimpan ke localStorage menggunakan JSON.stringify(), dan dimuat kembali saat halaman dibuka menggunakan JSON.parse().
 *  - Tombol "Hapus" berfungsi: transaksi yang dihapus langsung hilang dari layar dan dari localStorage.
 */

/**
 * TODO [Skilled]:
 * Tombol "Edit" berfungsi: saat ditekan, formulir (#transactionForm) secara otomatis terisi dengan data transaksi yang dipilih.
 *  - Pengguna dapat mengubah data lalu menyimpan perubahan.
 *  - Formulir kembali ke mode "Tambah" setelah pembaruan selesai.
 */

/**
 * TODO [Advanced]:
 * Gunakan Custom Event sebagai penghubung antara perubahan data dan pembaruan tampilan:
 *  - Kirim sinyal dengan document.dispatchEvent(new Event('transaction:updated')) setiap kali data berubah
 *  - Pasang satu listener untuk event tersebut yang memanggil fungsi render dan update dasbor
 */

document.addEventListener("transaction:updated", function () {
  renderTransaksi();
  updateDashboard();
});

/**
 * ========================================================
 * Kriteria 3: Fitur Interaktif (Pindah Kategori dan Pencarian)
 * ========================================================
 */
/**
 * TODO [Basic]:
 * Tambahkan tombol "Ubah Tipe" pada setiap kartu transaksi:
 *  - Saat diklik, ubah tipe transaksi: 'income' → 'expense' atau 'expense' → 'income'
 *  - Simpan perubahan ke localStorage dan perbarui tampilan
 */

/**
 * TODO [Skilled]:
 * Tambahkan event listener 'input' pada kolom pencarian:
 *  - Filter array transaksi berdasarkan kecocokan kata kunci dengan judul transaksi
 *  - Tampilkan hanya transaksi yang judulnya mengandung kata kunci tersebut
 */

/**
 * TODO [Advanced]:
 * Pastikan fitur pencarian berjalan dengan baik di semua kondisi:
 *  - Saat kolom pencarian dikosongkan, tampilkan kembali seluruh daftar transaksi
 */

// pencarian secara langsung ketika user mengetik
const searchInput = document.getElementById("searchTransactionFormTitleInput");

searchInput.addEventListener("input", function () {
  const keyword = searchInput.value.toLowerCase();

  const filterData = transactions.filter((transaksi) =>
    transaksi.title.toLowerCase().includes(keyword),
  );

  renderTransaksi(filterData);
});
