const { getAuthToken } = require("../models/userModel");
describe("jwt token authentication", () => {
  it("should validate the jwt token", () => {
    const token = getAuthToken();
  });
});
