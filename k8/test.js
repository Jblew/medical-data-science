const { makeK8ConfigFiles } = require("./make-k8.js");
makeK8ConfigFiles({
  context: {
    repo: { owner: "jblew", repo: "medical-data-science" },
  },
});
