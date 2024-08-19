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

  const metaThemeColor = document.querySelector('meta[name="theme-color"]');
  if (theme === "dark") {
    metaThemeColor.setAttribute("content", "#000000");
  } else {
    metaThemeColor.setAttribute("content", "#FAEBD7");
  }
}

document.addEventListener("DOMContentLoaded", function() {
  const button = document.getElementById("theme-toggle-case");
  const localStorageTheme = localStorage.getItem("theme");
  const systemSettingDark = window.matchMedia("(prefers-color-scheme: dark)");

  // Get current theme
  let currentThemeSetting = calculateSettingAsThemeString({ localStorageTheme, systemSettingDark });

  // Update the theme setting and button text according to current settings
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