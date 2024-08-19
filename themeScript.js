/**
 * based on:
 * https://dev.to/whitep4nth3r/the-best-lightdark-mode-theme-toggle-in-javascript-368f
 */
function calculateSettingAsThemeString({ localStorageTheme, systemSettingDark }) {
  if (localStorageTheme !== null) {
    return localStorageTheme;
  }

  if (systemSettingDark.matches) {
    return "dark";
  }

  return "light";
}

function updateThemeOnHtmlEl({ theme }) {
  document.querySelector("html").setAttribute("data-theme", theme);
}


document.addEventListener("DOMContentLoaded", function() {
  const button = document.getElementById("theme-toggle-case")
  const localStorageTheme = localStorage.getItem("theme");
  const systemSettingDark = window.matchMedia("(prefers-color-scheme: dark)");

// get current Theme
  let currentThemeSetting = calculateSettingAsThemeString({ localStorageTheme, systemSettingDark });

// Update the theme setting and button text accoridng to current settings
  updateThemeOnHtmlEl({ theme: currentThemeSetting });

  if (button) {
    button.addEventListener("click", () => {
      const newTheme = currentThemeSetting === "dark" ? "light" : "dark";
      localStorage.setItem("theme", newTheme);
      updateThemeOnHtmlEl({ theme: newTheme });
      currentThemeSetting = newTheme;
    });
  }
});