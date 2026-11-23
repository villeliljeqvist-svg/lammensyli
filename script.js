// Mobile navigation

const menuButton = document.getElementById("menuButton");
const mainNav = document.getElementById("mainNav");

menuButton.addEventListener("click", () => {

    const isOpen = mainNav.classList.toggle("open");

    menuButton.setAttribute("aria-expanded", isOpen);

});


mainNav.querySelectorAll("a").forEach(link => {

    link.addEventListener("click", () => {

        mainNav.classList.remove("open");

        menuButton.setAttribute("aria-expanded", "false");

    });

});


// Current year

document.getElementById("year").textContent =
    new Date().getFullYear();


// Image gallery modal

const modal = document.getElementById("imageModal");
const modalImage = document.getElementById("modalImage");
const modalClose = document.getElementById("modalClose");


document
    .querySelectorAll(".gallery-item")
    .forEach(item => {

        item.addEventListener("click", () => {

            const image = item.dataset.image;

            modalImage.src = image;

            modal.classList.add("open");

            modal.setAttribute(
                "aria-hidden",
                "false"
            );

            document.body.style.overflow = "hidden";

        });

    });


function closeModal() {

    modal.classList.remove("open");

    modal.setAttribute(
        "aria-hidden",
        "true"
    );

    modalImage.src = "";

    document.body.style.overflow = "";

}


modalClose.addEventListener(
    "click",
    closeModal
);


modal.addEventListener("click", event => {

    if (event.target === modal) {
        closeModal();
    }

});


document.addEventListener("keydown", event => {

    if (
        event.key === "Escape" &&
        modal.classList.contains("open")
    ) {

        closeModal();

    }

});
