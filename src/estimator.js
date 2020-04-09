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
//     avgDailyIncomeInUSD: 3,
//     avgDailyIncomePopulation: 0.87
//   },
//   reportedCases: 2819,
//   population: 40001971,
//   totalHospitalBeds: 2751722,
//   timeToElapse: 5,
//   periodType: 'months'
// });

export default covid19ImpactEstimator;
