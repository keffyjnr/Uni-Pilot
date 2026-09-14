/* =========================
   MOBILE MENU
========================= */

const menuBtn = document.getElementById("menuBtn");

const navLinks = document.getElementById("navLinks");

const menuOverlay = document.getElementById("menuOverlay");


function openMenu() {

  if (!navLinks || !menuOverlay) return;

  navLinks.classList.add("active");

  menuOverlay.classList.add("active");

}


function closeMenu() {

  if (!navLinks || !menuOverlay) return;

  navLinks.classList.remove("active");

  menuOverlay.classList.remove("active");

}


if (menuBtn && navLinks) {

  menuBtn.addEventListener(
    "click",
    () => {

      if (
        navLinks.classList.contains(
          "active"
        )
      ) {

        closeMenu();

      } else {

        openMenu();

      }

    }
  );

}


if (menuOverlay) {

  menuOverlay.addEventListener(
    "click",
    closeMenu
  );

}


if (navLinks) {

  navLinks.querySelectorAll("a").forEach(
    link => {

      link.addEventListener(
        "click",
        closeMenu
      );

    }
  );

}


/* =========================
   TOOL MODAL
========================= */

const toolModal =
  document.getElementById(
    "toolModal"
  );

const toolModalClose =
  document.getElementById(
    "toolModalClose"
  );

const toolContent =
  document.getElementById(
    "toolContent"
  );


let countdownInterval = null;


/* =========================
   OPEN TOOL
========================= */

function openTool(content) {

  if (
    !toolModal ||
    !toolContent
  ) {
    return;
  }


  toolContent.innerHTML =
    content;


  toolModal.classList.add(
    "active"
  );

}


/* =========================
   CLOSE TOOL
========================= */

function closeTool() {

  if (!toolModal) return;


  toolModal.classList.remove(
    "active"
  );


  if (countdownInterval) {

    clearInterval(
      countdownInterval
    );

    countdownInterval =
      null;

  }

}


if (toolModalClose) {

  toolModalClose.addEventListener(
    "click",
    closeTool
  );

}


if (toolModal) {

  toolModal.addEventListener(
    "click",
    event => {

      if (
        event.target === toolModal
      ) {

        closeTool();

      }

    }
  );

}


/* =========================
   TOOL CARDS
========================= */

document
  .querySelectorAll(
    ".tool-card"
  )
  .forEach(
    card => {

      card.addEventListener(
        "click",
        () => {

          const tool =
            card.dataset.tool;


          if (tool === "gpa") {

            openGpaCalculator();

          }


          if (tool === "cgpa") {

            openCgpaCalculator();

          }


          if (tool === "units") {

            openUnitsCalculator();

          }


          if (tool === "age") {

            openAgeCalculator();

          }


          if (tool === "countdown") {

            openCountdown();

          }

        }
      );

    }
  );


/* =========================
   GPA CALCULATOR
========================= */

function openGpaCalculator() {

  openTool(`
    <div class="tool-modal-header">

      <h2>
        🧮 GPA Calculator
      </h2>

      <p>
        Add your courses, credit units and grades.
        This calculator uses a 5.0 grading scale.
      </p>

    </div>


    <div id="gpaCourses">

      <div class="course-row">

        <input
          class="tool-input course-name"
          type="text"
          placeholder="Course"
        >

        <input
          class="tool-input course-unit"
          type="number"
          min="1"
          max="10"
          placeholder="Units"
        >

        <select class="tool-select course-grade">

          <option value="">
            Grade
          </option>

          <option value="5">
            A
          </option>

          <option value="4">
            B
          </option>

          <option value="3">
            C
          </option>

          <option value="2">
            D
          </option>

          <option value="1">
            E
          </option>

          <option value="0">
            F
          </option>

        </select>


        <button
          class="remove-course"
          type="button"
        >
          ×
        </button>

      </div>

    </div>


    <div class="tool-actions">

      <button
        class="tool-btn secondary"
        type="button"
        id="addCourseBtn"
      >
        + Add Course
      </button>


      <button
        class="tool-btn"
        type="button"
        id="calculateGpaBtn"
      >
        Calculate GPA
      </button>

    </div>


    <div class="calculator-result">

      <small>
        Your GPA
      </small>

      <strong id="gpaResult">
        0.00
      </strong>

    </div>
  `);


  const coursesContainer =
    document.getElementById(
      "gpaCourses"
    );


  const addCourseBtn =
    document.getElementById(
      "addCourseBtn"
    );


  const calculateGpaBtn =
    document.getElementById(
      "calculateGpaBtn"
    );


  function addCourse() {

    if (!coursesContainer) return;


    const row =
      document.createElement(
        "div"
      );


    row.className =
      "course-row";


    row.innerHTML = `

      <input
        class="tool-input course-name"
        type="text"
        placeholder="Course"
      >

      <input
        class="tool-input course-unit"
        type="number"
        min="1"
        max="10"
        placeholder="Units"
      >

      <select class="tool-select course-grade">

        <option value="">
          Grade
        </option>

        <option value="5">
          A
        </option>

        <option value="4">
          B
        </option>

        <option value="3">
          C
        </option>

        <option value="2">
          D
        </option>

        <option value="1">
          E
        </option>

        <option value="0">
          F
        </option>

      </select>


      <button
        class="remove-course"
        type="button"
      >
        ×
      </button>

    `;


    coursesContainer.appendChild(
      row
    );

  }


  if (addCourseBtn) {

    addCourseBtn.addEventListener(
      "click",
      addCourse
    );

  }


  if (coursesContainer) {

    coursesContainer.addEventListener(
      "click",
      event => {

        if (
          event.target.classList.contains(
            "remove-course"
          )
        ) {

          const rows =
            coursesContainer.querySelectorAll(
              ".course-row"
            );


          if (
            rows.length > 1
          ) {

            const row =
              event.target.closest(
                ".course-row"
              );


            if (row) {

              row.remove();

            }

          }

        }

      }
    );

  }


  if (
    calculateGpaBtn &&
    coursesContainer
  ) {

    calculateGpaBtn.addEventListener(
      "click",
      () => {

        const rows =
          coursesContainer.querySelectorAll(
            ".course-row"
          );


        let totalQualityPoints =
          0;

        let totalUnits =
          0;


        rows.forEach(
          row => {

            const unitInput =
              row.querySelector(
                ".course-unit"
              );


            const gradeInput =
              row.querySelector(
                ".course-grade"
              );


            const units =
              Number(
                unitInput.value
              );


            const grade =
              gradeInput.value;


            if (
              units > 0 &&
              grade !== ""
            ) {

              totalQualityPoints +=
                units *
                Number(grade);


              totalUnits +=
                units;

            }

          }
        );


        const result =
          document.getElementById(
            "gpaResult"
          );


        if (!result) return;


        if (
          totalUnits === 0
        ) {

          result.textContent =
            "0.00";

          return;

        }


        const gpa =
          totalQualityPoints /
          totalUnits;


        result.textContent =
          gpa.toFixed(2);

      }
    );

  }

}


/* =========================
   CGPA CALCULATOR
========================= */

function openCgpaCalculator() {

  openTool(`

    <div class="tool-modal-header">

      <h2>
        🎓 CGPA Calculator
      </h2>

      <p>
        Enter your previous CGPA and units,
        then add your current semester GPA and units.
      </p>

    </div>


    <div class="tool-form-group">

      <label for="previousCgpa">
        Previous CGPA
      </label>

      <input
        class="tool-input"
        id="previousCgpa"
        type="number"
        min="0"
        max="5"
        step="0.01"
        placeholder="e.g. 3.45"
      >

    </div>


    <div class="tool-form-group">

      <label for="previousUnits">
        Previous Total Units
      </label>

      <input
        class="tool-input"
        id="previousUnits"
        type="number"
        min="0"
        placeholder="e.g. 24"
      >

    </div>


    <div class="tool-form-group">

      <label for="currentGpa">
        Current Semester GPA
      </label>

      <input
        class="tool-input"
        id="currentGpa"
        type="number"
        min="0"
        max="5"
        step="0.01"
        placeholder="e.g. 4.20"
      >

    </div>


    <div class="tool-form-group">

      <label for="currentUnits">
        Current Semester Units
      </label>

      <input
        class="tool-input"
        id="currentUnits"
        type="number"
        min="0"
        placeholder="e.g. 18"
      >

    </div>


    <div class="tool-actions">

      <button
        class="tool-btn"
        type="button"
        id="calculateCgpaBtn"
      >
        Calculate CGPA
      </button>


      <button
        class="tool-btn secondary"
        type="button"
        id="clearCgpaBtn"
      >
        Clear
      </button>

    </div>


    <div class="calculator-result">

      <small>
        Your CGPA
      </small>

      <strong id="cgpaResult">
        0.00
      </strong>

    </div>

  `);


  const calculateCgpaBtn =
    document.getElementById(
      "calculateCgpaBtn"
    );


  const clearCgpaBtn =
    document.getElementById(
      "clearCgpaBtn"
    );


  if (calculateCgpaBtn) {

    calculateCgpaBtn.addEventListener(
      "click",
      () => {

        const previousCgpa =
          Number(
            document.getElementById(
              "previousCgpa"
            ).value
          );


        const previousUnits =
          Number(
            document.getElementById(
              "previousUnits"
            ).value
          );


        const currentGpa =
          Number(
            document.getElementById(
              "currentGpa"
            ).value
          );


        const currentUnits =
          Number(
            document.getElementById(
              "currentUnits"
            ).value
          );


        const result =
          document.getElementById(
            "cgpaResult"
          );


        const totalUnits =
          previousUnits +
          currentUnits;


        if (
          !result ||
          totalUnits <= 0 ||
          previousCgpa < 0 ||
          previousCgpa > 5 ||
          currentGpa < 0 ||
          currentGpa > 5
        ) {

          if (result) {

            result.textContent =
              "0.00";

          }

          return;

        }


        const cgpa =
          (
            previousCgpa *
            previousUnits +

            currentGpa *
            currentUnits
          ) /
          totalUnits;


        result.textContent =
          cgpa.toFixed(2);

      }
    );

  }


  if (clearCgpaBtn) {

    clearCgpaBtn.addEventListener(
      "click",
      () => {

        [
          "previousCgpa",
          "previousUnits",
          "currentGpa",
          "currentUnits"
        ].forEach(
          id => {

            const input =
              document.getElementById(
                id
              );


            if (input) {

              input.value =
                "";

            }

          }
        );


        const result =
          document.getElementById(
            "cgpaResult"
          );


        if (result) {

          result.textContent =
            "0.00";

        }

      }
    );

  }

}


/* =========================
   COURSE UNITS CALCULATOR
========================= */

function openUnitsCalculator() {

  openTool(`

    <div class="tool-modal-header">

      <h2>
        📚 Course Units
      </h2>

      <p>
        Add your courses and calculate your total credit units.
      </p>

    </div>


    <div id="unitCourses">

      <div class="course-row">

        <input
          class="tool-input unit-course-name"
          type="text"
          placeholder="Course"
        >

        <input
          class="tool-input unit-course-value"
          type="number"
          min="1"
          placeholder="Units"
        >

        <span></span>


        <button
          class="remove-course"
          type="button"
        >
          ×
        </button>

      </div>

    </div>


    <div class="tool-actions">

      <button
        class="tool-btn secondary"
        type="button"
        id="addUnitCourseBtn"
      >
        + Add Course
      </button>


      <button
        class="tool-btn"
        type="button"
        id="calculateUnitsBtn"
      >
        Calculate Total
      </button>

    </div>


    <div class="calculator-result">

      <small>
        Total Credit Units
      </small>

      <strong id="unitsResult">
        0
      </strong>

    </div>

  `);


  const unitCourses =
    document.getElementById(
      "unitCourses"
    );


  const addUnitCourseBtn =
    document.getElementById(
      "addUnitCourseBtn"
    );


  const calculateUnitsBtn =
    document.getElementById(
      "calculateUnitsBtn"
    );


  if (
    addUnitCourseBtn &&
    unitCourses
  ) {

    addUnitCourseBtn.addEventListener(
      "click",
      () => {

        const row =
          document.createElement(
            "div"
          );


        row.className =
          "course-row";


        row.innerHTML = `

          <input
            class="tool-input unit-course-name"
            type="text"
            placeholder="Course"
          >

          <input
            class="tool-input unit-course-value"
            type="number"
            min="1"
            placeholder="Units"
          >

          <span></span>


          <button
            class="remove-course"
            type="button"
          >
            ×
          </button>

        `;


        unitCourses.appendChild(
          row
        );

      }
    );

  }


  if (unitCourses) {

    unitCourses.addEventListener(
      "click",
      event => {

        if (
          event.target.classList.contains(
            "remove-course"
          )
        ) {

          const rows =
            unitCourses.querySelectorAll(
              ".course-row"
            );


          if (
            rows.length > 1
          ) {

            const row =
              event.target.closest(
                ".course-row"
              );


            if (row) {

              row.remove();

            }

          }

        }

      }
    );

  }


  if (
    calculateUnitsBtn &&
    unitCourses
  ) {

    calculateUnitsBtn.addEventListener(
      "click",
      () => {

        const inputs =
          unitCourses.querySelectorAll(
            ".unit-course-value"
          );


        let total =
          0;


        inputs.forEach(
          input => {

            const value =
              Number(
                input.value
              );


            if (value > 0) {

              total +=
                value;

            }

          }
        );


        const result =
          document.getElementById(
            "unitsResult"
          );


        if (result) {

          result.textContent =
            total;

        }

      }
    );

  }

}


/* =========================
   AGE CALCULATOR
========================= */

function openAgeCalculator() {

  openTool(`

    <div class="tool-modal-header">

      <h2>
        📅 Age Calculator
      </h2>

      <p>
        Select your date of birth to calculate your age.
      </p>

    </div>


    <div class="tool-form-group">

      <label for="birthDate">
        Date of Birth
      </label>


      <input
        class="tool-input"
        id="birthDate"
        type="date"
      >

    </div>


    <div class="tool-actions">

      <button
        class="tool-btn"
        type="button"
        id="calculateAgeBtn"
      >
        Calculate Age
      </button>

    </div>


    <div class="calculator-result">

      <small>
        Your Age
      </small>


      <strong id="ageResult">
        0 years
      </strong>

    </div>

  `);


  const calculateAgeBtn =
    document.getElementById(
      "calculateAgeBtn"
    );


  if (calculateAgeBtn) {

    calculateAgeBtn.addEventListener(
      "click",
      () => {

        const birthDateInput =
          document.getElementById(
            "birthDate"
          );


        const result =
          document.getElementById(
            "ageResult"
          );


        if (
          !birthDateInput ||
          !result ||
          !birthDateInput.value
        ) {

          return;

        }


        const birthDate =
          new Date(
            birthDateInput.value
          );


        const today =
          new Date();


        if (
          birthDate > today
        ) {

          result.textContent =
            "Invalid date";

          return;

        }


        let years =
          today.getFullYear() -
          birthDate.getFullYear();


        let months =
          today.getMonth() -
          birthDate.getMonth();


        let days =
          today.getDate() -
          birthDate.getDate();


        if (days < 0) {

          months--;


          const previousMonth =
            new Date(
              today.getFullYear(),
              today.getMonth(),
              0
            );


          days +=
            previousMonth.getDate();

        }


        if (months < 0) {

          years--;

          months += 12;

        }


        result.textContent =
          `${years} years, ${months} months, ${days} days`;

      }
    );

  }

}


/* =========================
   COUNTDOWN
========================= */

function openCountdown() {

  openTool(`

    <div class="tool-modal-header">

      <h2>
        ⏳ Countdown
      </h2>

      <p>
        Set a countdown for exams, events,
        deadlines and more.
      </p>

    </div>


    <div class="tool-form-group">

      <label for="countdownDate">
        Event Date and Time
      </label>


      <input
        class="tool-input"
        id="countdownDate"
        type="datetime-local"
      >

    </div>


    <div class="tool-actions">

      <button
        class="tool-btn"
        type="button"
        id="startCountdownBtn"
      >
        Start Countdown
      </button>

    </div>


    <div class="countdown-display">

      <div class="countdown-box">

        <strong id="countdownDays">
          0
        </strong>

        <span>
          DAYS
        </span>

      </div>


      <div class="countdown-box">

        <strong id="countdownHours">
          0
        </strong>

        <span>
          HOURS
        </span>

      </div>


      <div class="countdown-box">

        <strong id="countdownMinutes">
          0
        </strong>

        <span>
          MINUTES
        </span>

      </div>


      <div class="countdown-box">

        <strong id="countdownSeconds">
          0
        </strong>

        <span>
          SECONDS
        </span>

      </div>

    </div>


    <p
      class="countdown-message"
      id="countdownMessage"
    >
      Choose a date to begin.
    </p>

  `);


  const startCountdownBtn =
    document.getElementById(
      "startCountdownBtn"
    );


  if (startCountdownBtn) {

    startCountdownBtn.addEventListener(
      "click",
      () => {

        const dateInput =
          document.getElementById(
            "countdownDate"
          );


        const message =
          document.getElementById(
            "countdownMessage"
          );


        if (
          !dateInput ||
          !dateInput.value
        ) {

          if (message) {

            message.textContent =
              "Please choose a date.";

          }

          return;

        }


        const targetDate =
          new Date(
            dateInput.value
          ).getTime();


        if (countdownInterval) {

          clearInterval(
            countdownInterval
          );

        }


        function updateCountdown() {

          const now =
            Date.now();


          const distance =
            targetDate - now;


          if (distance <= 0) {

            clearInterval(
              countdownInterval
            );


            countdownInterval =
              null;


            document.getElementById(
              "countdownDays"
            ).textContent =
              "0";


            document.getElementById(
              "countdownHours"
            ).textContent =
              "0";


            document.getElementById(
              "countdownMinutes"
            ).textContent =
              "0";


            document.getElementById(
              "countdownSeconds"
            ).textContent =
              "0";


            if (message) {

              message.textContent =
                "The countdown has ended!";

            }

            return;

          }


          const days =
            Math.floor(
              distance /
              (
                1000 *
                60 *
                60 *
                24
              )
            );


          const hours =
            Math.floor(
              (
                distance %
                (
                  1000 *
                  60 *
                  60 *
                  24
                )
              ) /
              (
                1000 *
                60 *
                60
              )
            );


          const minutes =
            Math.floor(
              (
                distance %
                (
                  1000 *
                  60 *
                  60
                )
              ) /
              (
                1000 *
                60
              )
            );


          const seconds =
            Math.floor(
              (
                distance %
                (
                  1000 *
                  60
                )
              ) /
              1000
            );


          document.getElementById(
            "countdownDays"
          ).textContent =
            days;


          document.getElementById(
            "countdownHours"
          ).textContent =
            String(
              hours
            ).padStart(
              2,
              "0"
            );


          document.getElementById(
            "countdownMinutes"
          ).textContent =
            String(
              minutes
            ).padStart(
              2,
              "0"
            );


          document.getElementById(
            "countdownSeconds"
          ).textContent =
            String(
              seconds
            ).padStart(
              2,
              "0"
            );


          if (message) {

            message.textContent =
              "Countdown in progress.";

          }

        }


        updateCountdown();


        countdownInterval =
          setInterval(
            updateCountdown,
            1000
          );

      }
    );

  }

}


/* =========================
   ESCAPE KEY
========================= */

document.addEventListener(
  "keydown",
  event => {

    if (
      event.key === "Escape"
    ) {

      closeTool();

    }

  }
);

/* =========================
   GLOBAL ACCOUNT BUTTON
========================= */

document.addEventListener(
  "DOMContentLoaded",
  () => {

    const navActions =
      document.querySelector(
        ".nav-actions"
      );


    if (!navActions) return;


    /* Get logged-in user */

    const user =
      JSON.parse(
        localStorage.getItem(
          "uniPilotUser"
        )
      );


    if (!user) return;


    /* Check if account button already exists */

    if (
      document.getElementById(
        "accountBtn"
      )
    ) {

      return;

    }


    /* Create account button */

    const accountBtn =
      document.createElement(
        "button"
      );


    accountBtn.className =
      "account-btn";


    accountBtn.id =
      "accountBtn";


    accountBtn.innerHTML =
      `👤 <span>${user.name}</span> ▾`;


    /* Add button before menu button */

    const menuButton =
      document.getElementById(
        "menuBtn"
      );


    if (menuButton) {

      navActions.insertBefore(
        accountBtn,
        menuButton
      );

    } else {

      navActions.appendChild(
        accountBtn
      );

    }

  }
);
