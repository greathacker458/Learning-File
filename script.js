
document.addEventListener("DOMContentLoaded", function () {

    document.querySelectorAll(".current-year").forEach(function (element) {
        element.textContent = new Date().getFullYear();
    });

    const searchBox = document.getElementById("destinationSearch");
    const categoryBox = document.getElementById("categoryFilter");
    const destinationCards = document.querySelectorAll(".destination-item");
    const resultCount = document.getElementById("resultCount");
    const noResults = document.getElementById("noResults");
    const clearButton = document.getElementById("clearFilters");

    function searchDestinations() {
        if (!destinationCards.length) return;

        const searchText = searchBox ? searchBox.value.trim().toLowerCase() : "";
        const selectedCategory = categoryBox ? categoryBox.value : "all";
        let visibleCards = 0;

        destinationCards.forEach(function (card) {
            const cardText = (card.dataset.search || "").toLowerCase();
            const cardCategory = card.dataset.category || "all";

            const matchesText = cardText.includes(searchText);
            const matchesCategory =
                selectedCategory === "all" ||
                cardCategory === selectedCategory;

            const isVisible = matchesText && matchesCategory;

            card.classList.toggle("d-none", !isVisible);

            if (isVisible) visibleCards++;
        });

        if (resultCount) {
            resultCount.textContent =
                "Showing " + visibleCards + " of " +
                destinationCards.length + " destinations";
        }

        if (noResults) {
            noResults.classList.toggle("d-none", visibleCards > 0);
        }
    }

    if (searchBox) {
        searchBox.addEventListener("input", searchDestinations);
    }

    if (categoryBox) {
        categoryBox.addEventListener("change", searchDestinations);
    }

    if (clearButton) {
        clearButton.addEventListener("click", function () {
            if (searchBox) searchBox.value = "";
            if (categoryBox) categoryBox.value = "all";
            searchDestinations();
        });
    }

    searchDestinations();

    const destinationModal = document.getElementById("destinationModal");

    if (destinationModal) {
        destinationModal.addEventListener("show.bs.modal", function (event) {
            const button = event.relatedTarget;

            if (!button) return;

            const title = document.getElementById("destinationModalTitle");
            const body = document.getElementById("destinationModalBody");

            if (title) title.textContent = button.dataset.title || "";
            if (body) body.textContent = button.dataset.description || "";
        });
    }

    const galleryButtons = document.querySelectorAll(".gallery-thumb");
    const galleryModalElement = document.getElementById("galleryModal");

    if (galleryButtons.length && galleryModalElement && window.bootstrap) {
        const galleryModal = new bootstrap.Modal(galleryModalElement);
        const previewImage = document.getElementById("galleryPreview");
        const imageCaption = document.getElementById("galleryCaption");

        let currentImage = 0;

        function showImage(index) {
            currentImage = (index + galleryButtons.length) % galleryButtons.length;

            const button = galleryButtons[currentImage];
            const thumbnail = button.querySelector("img");

            if (previewImage) {
                previewImage.src = button.dataset.image || "";
                previewImage.alt = thumbnail ? thumbnail.alt : "";
            }

            if (imageCaption) {
                imageCaption.textContent = button.dataset.caption || "";
            }
        }

        galleryButtons.forEach(function (button, index) {
            button.addEventListener("click", function () {
                showImage(index);
                galleryModal.show();
            });
        });

        const previousButton = document.getElementById("galleryPrev");
        const nextButton = document.getElementById("galleryNext");

        if (previousButton) {
            previousButton.addEventListener("click", function () {
                showImage(currentImage - 1);
            });
        }

        if (nextButton) {
            nextButton.addEventListener("click", function () {
                showImage(currentImage + 1);
            });
        }
    }

    const peopleInput = document.getElementById("people");
    const totalDisplay = document.getElementById("bookingTotal");
    const calculateButton = document.getElementById("calculateBooking");
    const pricePerPerson = 350;

    function calculateBookingCost() {
        if (!peopleInput || !totalDisplay) return;

        let people = Number(peopleInput.value);

        if (!Number.isFinite(people) || people < 1) people = 1;
        if (people > 30) people = 30;

        totalDisplay.textContent =
            "M" + (people * pricePerPerson).toFixed(2);
    }

    if (peopleInput) {
        peopleInput.addEventListener("input", calculateBookingCost);
    }

    if (calculateButton) {
        calculateButton.addEventListener("click", calculateBookingCost);
    }

    calculateBookingCost();

    const bookingForm = document.getElementById("bookingForm");

    if (bookingForm) {
        bookingForm.addEventListener("submit", function (event) {
            event.preventDefault();

            const dateInput = document.getElementById("bookingDate");
            const bookingMessage = document.getElementById("bookingMessage");

            if (dateInput && dateInput.value) {
                const today = new Date();
                today.setHours(0, 0, 0, 0);

                const chosenDate = new Date(dateInput.value + "T00:00:00");

                dateInput.setCustomValidity(
                    chosenDate < today
                        ? "Please choose today or a future date."
                        : ""
                );
            }

            bookingForm.classList.add("was-validated");

            if (!bookingForm.checkValidity()) {
                if (bookingMessage) {
                    bookingMessage.innerHTML =
                        '<div class="alert alert-danger">Please check the form and correct the highlighted details.</div>';
                }
                return;
            }

            const bookingDetails = {
                name: document.getElementById("bookingName").value.trim(),
                email: document.getElementById("bookingEmail").value.trim(),
                phone: document.getElementById("bookingPhone").value.trim(),
                destination: document.getElementById("bookingDestination").value,
                date: dateInput ? dateInput.value : "",
                people: peopleInput ? Number(peopleInput.value) : 1,
                estimatedCost: totalDisplay ? totalDisplay.textContent : "",
                notes: document.getElementById("bookingNotes").value.trim()
            };

            localStorage.setItem(
                "lastTourismEnquiry",
                JSON.stringify(bookingDetails)
            );

            if (bookingMessage) {
                bookingMessage.innerHTML =
                    '<div class="alert alert-success">Thank you! Your sample booking enquiry has been saved in this browser. It has not been sent to a real tourism office.</div>';
            }

            bookingForm.reset();
            bookingForm.classList.remove("was-validated");
            calculateBookingCost();
        });
    }

    const registrationForm = document.getElementById("registrationForm");

    if (registrationForm) {
        registrationForm.addEventListener("submit", function (event) {
            event.preventDefault();

            const password = document.getElementById("regPassword");
            const confirmPassword = document.getElementById("regConfirm");
            const registrationMessage = document.getElementById("registrationMessage");

            confirmPassword.setCustomValidity(
                password.value !== confirmPassword.value
                    ? "The passwords do not match."
                    : ""
            );

            registrationForm.classList.add("was-validated");

            if (!registrationForm.checkValidity()) {
                if (registrationMessage) {
                    registrationMessage.innerHTML =
                        '<div class="alert alert-danger">Please correct the details and make sure the passwords match.</div>';
                }
                return;
            }

            const visitorDetails = {
                name: document.getElementById("regName").value.trim(),
                email: document.getElementById("regEmail").value.trim(),
                phone: document.getElementById("regPhone").value.trim(),
                gender: document.getElementById("regGender").value
            };

            localStorage.setItem(
                "lesothoVisitorProfile",
                JSON.stringify(visitorDetails)
            );

            if (registrationMessage) {
                registrationMessage.innerHTML =
                    '<div class="alert alert-success">Thank you for registering! Your sample profile has been saved on this device.</div>';
            }

            registrationForm.reset();
            registrationForm.classList.remove("was-validated");
        });
    }

});
