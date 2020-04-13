const covid19ImpactEstimator = (data) => {
  const {
    reportedCases,
    timeToElapse,
    periodType,
    totalHospitalBeds,
    region
  } = data;
  const result = {
    data,
    impact: {},
    severeImpact: {}
  };


  // calculate the number of currently infected for both impact and severe impact
  const currentlyInfected = (factor) => reportedCases * factor;
  const infectionsByRequestedTime = (time) => {
    let t = time;
    switch (periodType) {
      case 'days':
        t *= 1;
        break;
      case 'weeks':
        t *= 7;
        break;
      case 'months':
        t *= 30;
        break;
      default:
        break;
    }
    const dollarMultiplierTIme = t;
    const multiplier = 2 ** Math.trunc(t / 3);
    return { multiplier, dollarMultiplierTIme };
  };
  result.impact.currentlyInfected = currentlyInfected(10);
  result.severeImpact.currentlyInfected = currentlyInfected(50);
  result.impact.infectionsByRequestedTime = (
    result.impact.currentlyInfected * infectionsByRequestedTime(timeToElapse).multiplier
  );
  result.severeImpact.infectionsByRequestedTime = (
    result.severeImpact.currentlyInfected * infectionsByRequestedTime(timeToElapse).multiplier
  );
  result.impact.severeCasesByRequestedTime = Math.trunc(
    result.impact.infectionsByRequestedTime * 0.15
  );
  result.severeImpact.severeCasesByRequestedTime = Math.trunc(
    result.severeImpact.infectionsByRequestedTime * 0.15
  );
  result.impact.hospitalBedsByRequestedTime = Math.trunc(
    Math.trunc(0.35 * totalHospitalBeds) - result.impact.severeCasesByRequestedTime
  );
  result.severeImpact.hospitalBedsByRequestedTime = Math.trunc(
    Math.trunc(0.35 * totalHospitalBeds) - result.severeImpact.severeCasesByRequestedTime
  );
  result.impact.casesForICUByRequestedTime = Math.trunc(
    result.impact.infectionsByRequestedTime * 0.05
  );
  result.severeImpact.casesForICUByRequestedTime = Math.trunc(
    result.severeImpact.infectionsByRequestedTime * 0.05
  );
  result.impact.casesForVentilatorsByRequestedTime = (
    Math.trunc(result.impact.infectionsByRequestedTime * 0.02)
  );
  result.severeImpact.casesForVentilatorsByRequestedTime = (
    Math.trunc(result.severeImpact.infectionsByRequestedTime * 0.02)
  );
  result.impact.dollarsInFlight = Math.trunc(
    (result.impact.infectionsByRequestedTime * region.avgDailyIncomePopulation
      * region.avgDailyIncomeInUSD) / infectionsByRequestedTime(timeToElapse).dollarMultiplierTIme
  );
  result.severeImpact.dollarsInFlight = Math.trunc(
    (result.severeImpact.infectionsByRequestedTime * region.avgDailyIncomePopulation
        * region.avgDailyIncomeInUSD) / infectionsByRequestedTime(timeToElapse).dollarMultiplierTIme
  );
  // console.log(result);
  return result;
};

// covid19ImpactEstimator({
//   region: {
//     name: 'Africa',
//     avgAge: 19.7,
//     avgDailyIncomeInUSD: 1,
//     avgDailyIncomePopulation: 0.65
//   },
//   reportedCases: 633,
//   population: 8843395,
//   totalHospitalBeds: 83349,
//   timeToElapse: 36,
//   periodType: 'days'
// });
// covid19ImpactEstimator({
//   region: {
//     name: 'Africa',
//     avgAge: 19.7,
//     avgDailyIncomeInUSD: 3,
//     avgDailyIncomePopulation: 0.58
//   },
//   reportedCases: 613,
//   population: 6661572,
//   totalHospitalBeds: 142057,
//   timeToElapse: 12,
//   periodType: 'weeks'
// });

module.exports = covid19ImpactEstimator;
