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
    const multiplier = 2 ** Math.floor(t / 3);
    return { multiplier, dollarMultiplierTIme };
  };
  result.impact.currentlyInfected = Math.floor(currentlyInfected(10));
  result.severeImpact.currentlyInfected = Math.floor(currentlyInfected(50));
  result.impact.infectionsByRequestedTime = (
    result.impact.currentlyInfected * infectionsByRequestedTime(timeToElapse).multiplier
  );
  result.severeImpact.infectionsByRequestedTime = (
    result.severeImpact.currentlyInfected * infectionsByRequestedTime(timeToElapse).multiplier
  );
  result.impact.severeCasesByRequestedTime = result.impact.infectionsByRequestedTime * 0.15;
  result.severeImpact.severeCasesByRequestedTime = (
    result.severeImpact.infectionsByRequestedTime * 0.15
  );
  result.impact.hospitalBedsByRequestedTime = (
    Math.round(0.35 * totalHospitalBeds) - result.impact.severeCasesByRequestedTime
  );
  result.severeImpact.hospitalBedsByRequestedTime = (
    Math.round(0.35 * totalHospitalBeds) - result.severeImpact.severeCasesByRequestedTime
  );
  result.impact.casesForICUByRequestedTime = (
    result.impact.infectionsByRequestedTime * 0.05
  );
  result.severeImpact.casesForICUByRequestedTime = (
    result.severeImpact.infectionsByRequestedTime * 0.05
  );
  result.impact.casesForVentilatorsByRequestedTime = (
    Math.floor(result.impact.infectionsByRequestedTime * 0.02)
  );
  result.severeImpact.casesForVentilatorsByRequestedTime = (
    Math.floor(result.severeImpact.infectionsByRequestedTime * 0.02)
  );
  result.impact.dollarsInFlight = (
    (
      result.impact.infectionsByRequestedTime * region.avgDailyIncomePopulation)
        * region.avgDailyIncomeInUSD * infectionsByRequestedTime(timeToElapse).dollarMultiplierTIme
  );
  result.severeImpact.dollarsInFlight = (
    (
      result.severeImpact.infectionsByRequestedTime * region.avgDailyIncomePopulation)
        * region.avgDailyIncomeInUSD * infectionsByRequestedTime(timeToElapse).dollarMultiplierTIme
  );
  console.log(result);
  return result;
};

// covid19ImpactEstimator({
//   region: {
//     name: 'Africa',
//     avgAge: 19.7,
//     avgDailyIncomeInUSD: 5,
//     avgDailyIncomePopulation: 0.81
//   },
//   reportedCases: 2970,
//   population: 134637126,
//   totalHospitalBeds: 2268216,
//   timeToElapse: 12,
//   periodType: 'weeks'
// });
// covid19ImpactEstimator({
//   region: {
//     name: 'Africa',
//     avgAge: 19.7,
//     avgDailyIncomeInUSD: 4,
//     avgDailyIncomePopulation: 0.79
//   },
//   reportedCases: 2626,
//   population: 165641621,
//   totalHospitalBeds: 2992324,
//   timeToElapse: 3,
//   periodType: 'months'
// });

module.exports = covid19ImpactEstimator;
