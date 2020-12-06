interface Package {
    name: string;
    location: string;
    rule: object;
    FBase: number;
    salary: number;
    bonus: number;
    HBase: number;
    HPercent: number;
    month: number;
    subsidy: SUBSIDY;
    YRange: number[] | number;
    YBase: number;
    result: RESULT;
}
declare type SUBSIDY = {
    [property: string]: number;
};
declare type RESULT = {
    [property: string]: any;
};
declare class Package {
    constructor(options: Package);
    getBase(): void;
    getBonus(): void;
    getHPF(): void;
    getInsurance(): void;
    getSubsidy(): void;
    getYEA(): void;
    calc(): void;
    getTax(): void;
    getCash(): void;
    getPackage(): void;
}
export default Package;
