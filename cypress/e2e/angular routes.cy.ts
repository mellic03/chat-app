describe('Accessing application without being logged in should redirect user to login component', () => {

  it("/chat", () => {
    cy.visit("https://localhost:4200/chat");
    cy.contains("Login");
  });

  it("/chat/chatwindow", () => {
    cy.visit("https://localhost:4200/chat/chatwindow/somegroup/somechannel");
    cy.contains("Login");
  });

  it("/chat/groupsettings", () => {
    cy.visit("https://localhost:4200/chat/groupsettings/somegroup/somechannel");
    cy.contains("Login");
  });

  it("/settings", () => {
    cy.visit("https://localhost:4200/settings");
    cy.contains("Login");
  });
  
  it("/settings/account", () => {
    cy.visit("https://localhost:4200/settings/account");
    cy.contains("Login");
  });

  it("/settings/preferences", () => {
    cy.visit("https://localhost:4200/settings/preferences");
    cy.contains("Login");
  });

  it("/adminpanel", () => {
    cy.visit("https://localhost:4200/adminpanel");
    cy.contains("Login");
  });

  it("/adminpanel/userpanel", () => {
    cy.visit("https://localhost:4200/adminpanel/userpanel");
    cy.contains("Login");
  });

  it("/adminpanel/grouppanel", () => {
    cy.visit("https://localhost:4200/adminpanel/grouppanel");
    cy.contains("Login");
  });
})

describe("Accessing admin panel should be impossible if role < 2", () => {

  before("Log in with role < 2", () => {
    cy.visit("https://localhost:4200/login");
    cy.get("#email").type("michael@mail.com");
    cy.get("#password").type("mpass");
    cy.get("#submit").click();
  });

  it("Visit /adminpanel", () => {
    cy.visit("https://localhost:4200/adminpanel");
    cy.get('p').contains("Admin Panel").should('not.exist');
  });
});

