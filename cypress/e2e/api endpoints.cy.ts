let API_URL = "https://127.0.0.1:3000";

describe("Each POST endpoint should respond", () => {
  
  it("api/auth", () => {
    cy.request("post", API_URL + "/api/auth").as("response");
    cy.get("@response");
  });
  
  it("/api/groups/:group_name/update_photo", () => {
    cy.request("post", API_URL + "/api/groups/somegroup/update_photo").as("response");
    cy.get("@response");
  });

  it("/api/update_profile_photo", () => {
    cy.request("post", API_URL + "/api/update_profile_photo").as("response");
    cy.get("@response");
  });
});

describe("Each GET endpoint should respond", () => {

  it("/api/users", () => {
    cy.request("get", API_URL + "/api/users").as("response");
    cy.get("@response");
  });

  it("/api/users/super", () => {
    cy.request("get", API_URL + "/api/users/super").as("response");
    cy.get("@response");
  });

  it("/api/users/super/groups", () => {
    cy.request("get", API_URL + "/api/users/super/groups").as("response");
    cy.get("@response");
  });

  it("/api/groups/group_names", () => {
    cy.request("get", API_URL + "/api/groups/group_names").as("response");
    cy.get("@response");
  });

  it("/api/groups/e2e_test_group/users", () => {
    cy.request("get", API_URL + "/api/groups/e2e_test_group/users").as("response");
    cy.get("@response");
  });

  it("/api/groups/e2e_test_group", () => {
    cy.request("get", API_URL + "/api/groups/e2e_test_group").as("response");
    cy.get("@response");
  });

  it("/api/groups/e2e_test_group/channels", () => {
    cy.request("get", API_URL + "/api/groups/e2e_test_group/channels").as("response");
    cy.get("@response");
  });

});

