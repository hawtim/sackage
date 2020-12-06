/**
 * 薪资相关参数
 * - HPF(Housing Provident Fund) 住房公积金
 * - YEA(Year-end Awards) 年终奖
 * - ===============
 * - name 公司名称
 * - location 公司所在城市
 * - rule 五险一金的规则（基于 location 使用对应的规则）
 * - FBase 五险系数
 * - salary 基础薪资
 * - bonus 奖金
 * - HBase 公积金基数
 * - HPercent 公积金百分比
 * - month 12 个月，一年
 * - subsidy 补贴数值
 * - YRange 年终月数范围
 * - YBase 年终基数
 * - result 计算结果
 */
interface Package {
  name: string
  location: string,
  rule: object,
  FBase: number
  salary: number
  bonus: number
  HBase: number
  HPercent: number
  month: number
  subsidy: SUBSIDY
  YRange: number[] | number
  YBase: number
  result: RESULT
}

/**
 * 补贴 Subsidy
 */
type SUBSIDY = {
  [property: string]: number;
}
/**
 * 结果表
 */
type RESULT = {
  [property: string]: any;
}

/**
 * 税率计算
 * - numberForTax 应交税金额
 * - ratePercent 适用税率
 * - quick 速算扣除数
 * - tax 应缴税款
 * - incomeAfterTax 税后工资
 */
type TAX = {
  numberForTax: number
  ratePercent: number
  quick: number
  tax: number
  incomeAfterTax: number
}

// 计算所得税
function calculateTax(income: number, insure: number) {
  const baseLine = 5000
  const taxableIncome = income - insure - baseLine;

  if (taxableIncome <= 0) {
    console.log("您无需缴纳个人所得税!");
    return;
  }

  let rate, quick;
  const I = Math.floor(taxableIncome);

  if (I <= 3000) {
    rate = 0.03;
    quick = 0;
  } else if (I > 3000 && I <= 12000) {
    rate = 0.1;
    quick = 210;
  } else if (I > 12000 && I <= 25000) {
    rate = 0.2;
    quick = 1410;
  } else if (I > 25000 && I <= 35000) {
    rate = 0.25;
    quick = 2660;
  } else if (I > 35000 && I <= 55000) {
    rate = 0.3;
    quick = 4410;
  } else if (I > 55000 && I <= 80000) {
    rate = 0.35;
    quick = 7160;
  } else {
    rate = 0.45;
    quick = 15160;
  }

  let tax = taxableIncome * rate - quick;
  tax = Math.round(tax * 100) / 100;
  let realIncome = income - insure - tax;
  realIncome = Math.round(realIncome * 100) / 100;

  const result: TAX = {
    'numberForTax': taxableIncome,
    'ratePercent': rate * 100,
    'quick': quick,
    'tax': tax,
    'incomeAfterTax': realIncome
  }
  return result
}

class Package {
  constructor(options: Package) {
    const { name, location, subsidy, salary, bonus, FBase, HBase, HPercent, YRange, YBase } = options
    this.name = name
    // location default shenzhen
    this.location = location || 'SZ'
    // load the five insurance rules base on the location
    this.rule = require('./' + location + '.json')
    this.salary = salary
    this.bonus = bonus
    this.FBase = FBase
    this.HBase = HBase
    this.HPercent = HPercent
    this.month = 12
    this.subsidy = subsidy
    this.YRange = YRange
    this.YBase = YBase
    this.result = {}
  }
  getBase() {
    this.result['basic'] = this.salary * this.month
  }
  getBonus() {
    this.result['bonus'] = this.bonus * this.month
  }
  getHPF() {
    this.result['companyHPF'] = this.HBase * this.HPercent * this.month
    this.result['personHPF'] = this.HBase * this.HPercent * this.month
  }
  getInsurance() {
    let temp = 0
    Object.keys(this.rule).forEach(item => {
      this.result['five'][item] = Math.ceil(this.FBase * this.rule[item])
      temp += this.rule[item]
    })
    this.result['five']['total'] = this.FBase * temp
    this.result['fiveTotal'] = this.FBase * temp * this.month
  }
  getSubsidy() {
    let temp = 0
    Object.keys(this.subsidy).forEach(item => {
      temp += this.subsidy[item]
    })
    this.result['subsidy'] = temp * this.month
  }
  getYEA() {
    if (typeof this.YRange == 'number') {
      this.result['yea'] = this.YBase * this.YRange
    }
    if (Array.isArray(this.YRange)) {
      this.result['yeaRange'] = this.YRange.map(item => item * this.YBase)
    }
  }
  calc() {
    this.result['name'] = this.name
    this.result['five'] = {}
    this.getBase()
    this.getBonus()
    this.getInsurance()
    this.getTax()
    this.getHPF()
    this.getSubsidy()
    this.getYEA()
    this.getPackage()
    this.getCash()
    console.log(this.result)
  }
  getTax() {
    this.result['tax'] = calculateTax(this.salary, this.result.five.total)
  }
  getCash() {
    const { basic, subsidy, fiveTotal, personHPF, yea, yeaRange } = this.result
    const stable = basic + subsidy - fiveTotal - personHPF
    if (yea) {
      this.result['cash'] = stable + yea
    }
    if (yeaRange) {
      this.result['cashRange'] = yeaRange.map((item: number) => item + stable)
    }
  }
  getPackage() {
    const { basic, subsidy, companyHPF, yea, yeaRange, bonus } = this.result
    const pkg = basic + subsidy + companyHPF + bonus
    if (yea) {
      this.result['pkg'] = pkg + yea
    }
    if (yeaRange) {
      this.result['pkgRange'] = yeaRange.map((item: number) => item + pkg)
    }
  }
}

module.exports = Package

export default Package

