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
        t *= 31;
        break;
      default:
        break;
    }
    const multiplier = 2 ** Math.floor(time / 3);
    return multiplier;
  };
  result.impact.currentlyInfected = currentlyInfected(10);
  result.severeImpact.currentlyInfected = currentlyInfected(50);
  result.impact.infectionsByRequestedTime = (
    result.impact.currentlyInfected * infectionsByRequestedTime(timeToElapse)
  );
  result.severeImpact.infectionsByRequestedTime = (
    result.severeImpact.currentlyInfected * infectionsByRequestedTime(timeToElapse)
  );
  result.impact.severeCasesByRequestedTime = result.impact.infectionsByRequestedTime * 0.15;
  result.severeImpact.severeCasesByRequestedTime = (
    result.severeImpact.infectionsByRequestedTime * 0.15
  );
  result.impact.hospitalBedsByRequestedTime = (
    (0.35 * totalHospitalBeds) - result.impact.severeCasesByRequestedTime
  );
  result.severeImpact.hospitalBedsByRequestedTime = (
    (0.35 * totalHospitalBeds) - result.severeImpact.severeCasesByRequestedTime
  );
  result.impact.casesForICUByRequestedTime = (
    result.impact.infectionsByRequestedTime * 0.05
  );
  result.severeImpact.casesForICUByRequestedTime = (
    result.severeImpact.infectionsByRequestedTime * 0.05
  );
  result.impact.casesForVentilatorsByRequestedTime = (
    result.impact.infectionsByRequestedTime * 0.02
  );
  result.severeImpact.casesForVentilatorsByRequestedTime = (
    result.severeImpact.infectionsByRequestedTime * 0.02
  );
//   result.impact.dollarsInFlight = (
//     (
//       result.impact.infectionsByRequestedTime * region.avgDailyIncomePopulation)
//       * region.avgDailyIncomeInUSD * t
//   );
//   result.severeImpact.dollarsInFlight = (
//     (
//       result.severeImpact.infectionsByRequestedTime * region.avgDailyIncomePopulation)
//       * region.avgDailyIncomeInUSD * t
//   );
  console.log(result);
  return result;
};

// covid19ImpactEstimator({
//   region: {
//     name: 'Africa',
//     avgAge: 19.7,
//     avgDailyIncomeInUSD: 4,
//     avgDailyIncomePopulation: 0.73
//   },
//   reportedCases: 4582,
//   population: 75302818,
//   totalHospitalBeds: 1881636,
//   timeToElapse: 3,
//   periodType: 'months'
// });

export default covid19ImpactEstimator;
