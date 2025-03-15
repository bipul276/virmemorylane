const bcrypt = require("bcryptjs");
const hash = "$2b$10$bimvY.P6eaZbab8yWSDGve7YqAF0ReBeBVcP7yNORNsU.bRyN6P1S";

bcrypt.compare("9155602198", hash)
  .then(result => {
    console.log("Password match:", result);
  })
  .catch(console.error);
