let APPp_URL = "https://127.0.0.1:4200";


describe('Accessing application without being logged in should redirect user to login component', () => {

  it("/chat", () => {
    cy.visit(APPp_URL + "/chat");
    cy.contains("Login");
  });

  it("/chat/chatwindow", () => {
    cy.visit(APPp_URL + "/chat/chatwindow/somegroup/somechannel");
    cy.contains("Login");
  });

  it("/chat/groupsettings", () => {
    cy.visit(APPp_URL + "/chat/groupsettings/somegroup/somechannel");
    cy.contains("Login");
  });

  it("/settings", () => {
    cy.visit(APPp_URL + "/settings");
    cy.contains("Login");
  });
  
  it("/settings/account", () => {
    cy.visit(APPp_URL + "/settings/account");
    cy.contains("Login");
  });

  it("/settings/preferences", () => {
    cy.visit(APPp_URL + "/settings/preferences");
    cy.contains("Login");
  });

  it("/adminpanel", () => {
    cy.visit(APPp_URL + "/adminpanel");
    cy.contains("Login");
  });

  it("/adminpanel/userpanel", () => {
    cy.visit(APPp_URL + "/adminpanel/userpanel");
    cy.contains("Login");
  });

  it("/adminpanel/grouppanel", () => {
    cy.visit(APPp_URL + "/adminpanel/grouppanel");
    cy.contains("Login");
  });
})

describe("Accessing admin panel should be impossible if role < 2", () => {

  before("Log in with role < 2", () => {
    cy.visit(APPp_URL + "/login");
    cy.get("#email").type("michael@mail.com");
    cy.get("#password").type("mpass");
    cy.get("#submit").click();
  });

  it("Visit /adminpanel", () => {
    cy.visit(APPp_URL + "/adminpanel");
    cy.contains("Admin Panel").should('not.exist');
  });

  it("Visit /adminpanel/userpanel", () => {
    cy.visit(APPp_URL + "/adminpanel/userpanel");
    cy.contains("Admin Panel").should('not.exist');
  });

  it("Visit /adminpanel/grouppanel", () => {
    cy.visit(APPp_URL + "/adminpanel/grouppanel");
    cy.contains("Admin Panel").should('not.exist');
  });
});
