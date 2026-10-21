const searchInput = document.getElementById("searchInput");
const cards = [...document.querySelectorAll(".card")];
const filterButtons = [...document.querySelectorAll(".filter-btn")];

let activeFilter = "all";

function filterCards() {
  const query = searchInput.value.trim().toLowerCase();

  cards.forEach((card) => {
    const difficulty = card.dataset.difficulty;
    const os = card.dataset.os;
    const name = card.dataset.name.toLowerCase();
    const matchesFilter =
      activeFilter === "all" ||
      difficulty === activeFilter ||
      os === activeFilter;

    const matchesSearch =
      name.includes(query) || card.textContent.toLowerCase().includes(query);

    card.classList.toggle("hidden", !(matchesFilter && matchesSearch));
  });
}

searchInput.addEventListener("input", filterCards);

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    filterButtons.forEach((btn) => btn.classList.remove("active"));
    button.classList.add("active");
    activeFilter = button.dataset.filter;
    filterCards();
  });
});
