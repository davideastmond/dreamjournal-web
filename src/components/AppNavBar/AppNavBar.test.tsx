import { render, screen, fireEvent } from "../../utils/test-utils/test-utils";
import { BrowserRouter as Router } from "react-router-dom";
import AppNavBar from "./AppNavBar";
describe("AppNavBar tests", () => {
  describe("UI Elements are visible when there is a session", () => {
    test("AppNav bar renders - search bar is not visible", () => {
      render(
        <Router>
          <AppNavBar hasSession={false} />
        </Router>
      );

      const missingSearchBar = screen.queryByRole("textbox", {
        name: /search/i,
      });
      const missingProfileMenuIcon = screen.queryByRole("combobox", {
        name: /account of current user/i,
      });
      expect(missingSearchBar).not.toBeInTheDocument();
      expect(missingProfileMenuIcon).not.toBeInTheDocument();
    });

    test("AppNav bar - search bar and menu popup icons are showing", () => {
      render(
        <Router>
          <AppNavBar hasSession={true} />
        </Router>
      );
      const missingSearchBar = screen.queryByRole("textbox", {
        name: /search/i,
      });
      const missingProfileMenuIcon = screen.getByText(/settings/i);
      expect(missingSearchBar).toBeInTheDocument();
      expect(missingProfileMenuIcon).toBeInTheDocument();
    });

    test("context menu item appears when clicking the icon", () => {
      render(
        <Router>
          <AppNavBar hasSession={true} />
        </Router>
      );
      const popUpMenuIconTrigger = screen.getByRole("generic", {
        name: "accountPopupMenu",
      });
      fireEvent.click(popUpMenuIconTrigger);
      const analyticsMenuItem = screen.getByText("Analytics");
      const logOutMenuItem = screen.getByText(/log out/i);
      expect(analyticsMenuItem).toBeInTheDocument();
      expect(logOutMenuItem).toBeInTheDocument();
    });
  });
});
