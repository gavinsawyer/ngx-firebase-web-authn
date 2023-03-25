const { gitDescribeSync } = require("git-describe");
const { writeFileSync }   = require("fs");


writeFileSync(".git-version.json", JSON.stringify(gitDescribeSync()));
