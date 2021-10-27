const form = document.querySelector("#form-add-quote");
const petInput = document.querySelector("#pet");
const ownerInput = document.querySelector("#owner");
const phoneInput = document.querySelector("#phone");
const dateInput = document.querySelector("#date");
const timeInput = document.querySelector("#time");
const symptomsInput = document.querySelector("#symptoms");
const appointmentsContainer = document.querySelector("#appointments-container");

let modeEdit;

eventListeners();

function eventListeners() {
	petInput.addEventListener("input", dataQuote);
	ownerInput.addEventListener("input", dataQuote);
	phoneInput.addEventListener("input", dataQuote);
	dateInput.addEventListener("input", dataQuote);
	timeInput.addEventListener("input", dataQuote);
	symptomsInput.addEventListener("input", dataQuote);

	form.addEventListener("submit", addQuote);
}

class Appointments {
	constructor() {
		this.appointments = [];
	}

	addQuote(quote) {
		this.appointments.push(quote);
	}

	deleteQuote(id) {
		this.appointments = this.appointments.filter((quote) => quote.id !== id);
	}

	updateQuote(quoteUpdated) {
		this.appointments = this.appointments.map((quote) =>
			quote.id === quoteUpdated.id ? quoteUpdated : quote
		);
	}
}

class UI {
	showMessage(message, type = "error") {
		const title = document.querySelector(".header__title");
		title.textContent = message;

		if (type !== "success") {
			title.style.color = "#d31225";
		}

		setTimeout(() => {
			title.textContent = "Veterinary appointments";
			title.style.color = null;
		}, 1500);
	}

	showQuotes({ appointments }) {
		appointmentsContainer.innerHTML = "";
		appointments.forEach((appointment) => {
			const article = document.createElement("article");
			article.className = "quote-card";
			article.innerHTML = `<p class="quote-card__subtitle pet">${appointment.pet}</p>
			<p class="quote-card__subtitle"><strong>Owner: </strong><span>${appointment.owner}</span></p>
			<p class="quote-card__subtitle"><strong>Phone: </strong><span>${appointment.phone}</span></p>
			<p class="quote-card__subtitle"><strong>Date: </strong><span>${appointment.date}</span></p>
			<p class="quote-card__subtitle"><strong>Time: </strong><span>${appointment.time}</span></p>
			<p class="quote-card__subtitle"><strong>Symptoms: </strong><span>${appointment.symptoms}</span></p>
			<button class="quote-card__btn-delete" onclick="deleteQuote(${appointment.id})">Delete <i class="bi bi-x-circle"></i></button>`;

			const btnEdit = document.createElement("button");
			btnEdit.className = "quote-card__btn-edit";
			btnEdit.onclick = () => loadDataQuote(appointment);
			btnEdit.innerHTML = 'Edit <i class="bi bi-pencil"></i>';

			article.insertBefore(btnEdit, article.lastChild);

			appointmentsContainer.appendChild(article);
		});
	}
}

const ui = new UI();
const manageAppointments = new Appointments();

const quoteObj = {
	pet: "",
	owner: "",
	phone: "",
	date: "",
	time: "",
	symptoms: "",
};

function dataQuote(e) {
	quoteObj[e.target.name] = e.target.value;
}

function addQuote(e) {
	e.preventDefault();

	const { pet, owner, phone, date, time, symptoms } = quoteObj;

	// Validate
	if (
		pet === "" ||
		owner === "" ||
		phone === "" ||
		date === "" ||
		time === "" ||
		symptoms === ""
	) {
		ui.showMessage("Please fill in all the fields");
		return;
	}

	if (modeEdit) {
		manageAppointments.updateQuote({ ...quoteObj });

		// Delete mode edit
		form.querySelector("button").innerHTML =
			'<i class="bi bi-plus-circle-fill"></i> Add quote';
		modeEdit = false;
	} else {
		// Generate id
		quoteObj.id = Date.now();

		// Add quote
		manageAppointments.addQuote({ ...quoteObj });
	}

	refreshObj();
	form.reset();

	ui.showQuotes(manageAppointments);
}

function refreshObj() {
	quoteObj.pet = "";
	quoteObj.owner = "";
	quoteObj.phone = "";
	quoteObj.date = "";
	quoteObj.time = "";
	quoteObj.symptoms = "";
}

function deleteQuote(id) {
	manageAppointments.deleteQuote(id);

	ui.showQuotes(manageAppointments);
}

function loadDataQuote(quote) {
	const { id, pet, owner, phone, date, time, symptoms } = quote;

	petInput.value = pet;
	ownerInput.value = owner;
	phoneInput.value = phone;
	dateInput.value = date;
	timeInput.value = time;
	symptomsInput.textContent = symptoms;

	form.querySelector("button").innerHTML =
		'<i class="bi bi-save2-fill"></i> Update quote';

	quoteObj.id = id;
	quoteObj.pet = pet;
	quoteObj.owner = owner;
	quoteObj.phone = phone;
	quoteObj.date = date;
	quoteObj.time = time;
	quoteObj.symptoms = symptoms;

	modeEdit = true;
}
