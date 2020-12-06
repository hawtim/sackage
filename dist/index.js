"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function calculateTax(income, insure) {
    var baseLine = 5000;
    var taxableIncome = income - insure - baseLine;
    if (taxableIncome <= 0) {
        console.log("您无需缴纳个人所得税!");
        return;
    }
    var rate, quick;
    var I = Math.floor(taxableIncome);
    if (I <= 3000) {
        rate = 0.03;
        quick = 0;
    }
    else if (I > 3000 && I <= 12000) {
        rate = 0.1;
        quick = 210;
    }
    else if (I > 12000 && I <= 25000) {
        rate = 0.2;
        quick = 1410;
    }
    else if (I > 25000 && I <= 35000) {
        rate = 0.25;
        quick = 2660;
    }
    else if (I > 35000 && I <= 55000) {
        rate = 0.3;
        quick = 4410;
    }
    else if (I > 55000 && I <= 80000) {
        rate = 0.35;
        quick = 7160;
    }
    else {
        rate = 0.45;
        quick = 15160;
    }
    var tax = taxableIncome * rate - quick;
    tax = Math.round(tax * 100) / 100;
    var realIncome = income - insure - tax;
    realIncome = Math.round(realIncome * 100) / 100;
    var result = {
        'numberForTax': taxableIncome,
        'ratePercent': rate * 100,
        'quick': quick,
        'tax': tax,
        'incomeAfterTax': realIncome
    };
    return result;
}
var Package = (function () {
    function Package(options) {
        var name = options.name, location = options.location, subsidy = options.subsidy, salary = options.salary, bonus = options.bonus, FBase = options.FBase, HBase = options.HBase, HPercent = options.HPercent, YRange = options.YRange, YBase = options.YBase;
        this.name = name;
        this.location = location || 'SZ';
        this.rule = require('./' + location + '.json');
        this.salary = salary;
        this.bonus = bonus;
        this.FBase = FBase;
        this.HBase = HBase;
        this.HPercent = HPercent;
        this.month = 12;
        this.subsidy = subsidy;
        this.YRange = YRange;
        this.YBase = YBase;
        this.result = {};
    }
    Package.prototype.getBase = function () {
        this.result['basic'] = this.salary * this.month;
    };
    Package.prototype.getBonus = function () {
        this.result['bonus'] = this.bonus * this.month;
    };
    Package.prototype.getHPF = function () {
        this.result['companyHPF'] = this.HBase * this.HPercent * this.month;
        this.result['personHPF'] = this.HBase * this.HPercent * this.month;
    };
    Package.prototype.getInsurance = function () {
        var _this = this;
        var temp = 0;
        Object.keys(this.rule).forEach(function (item) {
            _this.result['five'][item] = Math.ceil(_this.FBase * _this.rule[item]);
            temp += _this.rule[item];
        });
        this.result['five']['total'] = this.FBase * temp;
        this.result['fiveTotal'] = this.FBase * temp * this.month;
    };
    Package.prototype.getSubsidy = function () {
        var _this = this;
        var temp = 0;
        Object.keys(this.subsidy).forEach(function (item) {
            temp += _this.subsidy[item];
        });
        this.result['subsidy'] = temp * this.month;
    };
    Package.prototype.getYEA = function () {
        var _this = this;
        if (typeof this.YRange == 'number') {
            this.result['yea'] = this.YBase * this.YRange;
        }
        if (Array.isArray(this.YRange)) {
            this.result['yeaRange'] = this.YRange.map(function (item) { return item * _this.YBase; });
        }
    };
    Package.prototype.calc = function () {
        this.result[this.name] = this.name;
        this.result['five'] = {};
        this.getBase();
        this.getBonus();
        this.getInsurance();
        this.getTax();
        this.getHPF();
        this.getSubsidy();
        this.getYEA();
        this.getPackage();
        this.getCash();
        console.log(this.result);
    };
    Package.prototype.getTax = function () {
        this.result['tax'] = calculateTax(this.salary, this.result.five.total);
    };
    Package.prototype.getCash = function () {
        var _a = this.result, basic = _a.basic, subsidy = _a.subsidy, fiveTotal = _a.fiveTotal, personHPF = _a.personHPF, yea = _a.yea, yeaRange = _a.yeaRange;
        var stable = basic + subsidy - fiveTotal - personHPF;
        if (yea) {
            this.result['cash'] = stable + yea;
        }
        if (yeaRange) {
            this.result['cashRange'] = yeaRange.map(function (item) { return item + stable; });
        }
    };
    Package.prototype.getPackage = function () {
        var _a = this.result, basic = _a.basic, subsidy = _a.subsidy, companyHPF = _a.companyHPF, yea = _a.yea, yeaRange = _a.yeaRange, bonus = _a.bonus;
        var pkg = basic + subsidy + companyHPF + bonus;
        if (yea) {
            this.result['pkg'] = pkg + yea;
        }
        if (yeaRange) {
            this.result['pkgRange'] = yeaRange.map(function (item) { return item + pkg; });
        }
    };
    return Package;
}());
module.exports = Package;
exports.default = Package;
