describe("Log in, create new group/channel, send message to group and log out", () => {
  
  before("Log in as super", () => {
    cy.visit("https://localhost:4200/login");
    cy.get("#email").type("super@mail.com");
    cy.get("#password").type("superpass");
    cy.get("#submit").click();
  });


  it("Create new group/channel, send message to channel and log out", () => {
    // navigate to admin panel and create group
    cy.get("li").contains("Admin Panel").click();

    // navigate to admin panel and create group
    cy.get("li").contains("Admin Panel").click();
    cy.get("a").contains("Groups").click();
    cy.get("#groupname").type("e2e_test_group");
    cy.get("button").contains("Create Group").click();

    // navigate back to chat component and open group
    // cy.visit("https://localhost:4200/chat");
    cy.get("li").contains("Chat").click();
    cy.get("#e2e_test_group").click();

    // open group settings and create channel
    cy.get("#groupsettings").click();
    cy.get("#channelname").type("e2e_test_channel");
    cy.get("#createchannel").click();
    cy.get("#groupsettings_exit").click();

    // navigate back and send message to channel
    cy.get("textarea").type("e2e test message {enter}");

    // log out
    cy.get("button").contains("logout").click();
  });


});
