const Package = require('../dist/index')

var test1 = new Package({
  name: 'test1',
  location: 'SZ',
  salary: 20000,
  bonus: 0,
  FBase: 2700,
  HBase: 20000,
  HPercent: 0.05,
  subsidy: {
    something: 150
  },
  YRange: [2, 3],
  YBase: 20000
})
test1.calc()

var test2 = new Package({
  name: 'test2',
  location: 'HZ',
  salary: 16000,
  bonus: 0,
  FBase: 2200,
  HBase: 2200,
  HPercent: 0.05,
  subsidy: {},
  YRange: 1,
  YBase: 16000
})

test2.calc()