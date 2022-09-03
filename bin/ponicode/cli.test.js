const rewire = require("rewire")
const cli = rewire("../cli")
const loadConfiguration = cli.__get__("loadConfiguration")
// @ponicode
describe("loadConfiguration", () => {
    test("0", () => {
        let result = loadConfiguration({ "configuration": "skelo-config.json" })
        expect(result).toEqual({ autoFolder: true, autoOverview: { active: true, options: { label: "Overview", title: "{{{category-label}}}", titleCase: "sentence" } } })
    })
})
