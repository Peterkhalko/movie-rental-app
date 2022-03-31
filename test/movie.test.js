const { getAuthToken } = require("../models/userModel");
describe("jwt token authentication", () => {
  it("should validate the jwt token", () => {
    const token = getAuthToken();
    expect(token).toBe(
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE2NDg2MzE2MDJ9.zPx5Nnw0MxfeOuwv2jWYbE_fesQQ1QWnDHl8rSgWTyo"
    );
  });
});
