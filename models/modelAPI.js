const fs = require('fs').promises

exports.fetchAll = () => {
    return fs.readFile("./endpoints.json", "utf-8")
}