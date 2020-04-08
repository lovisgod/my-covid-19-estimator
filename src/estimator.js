const covid19ImpactEstimator = (data) => {
  const {
    reportedCases,
    timeToElapse,
    periodType,
    totalHospitalBeds
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
    const multiplier = 2 ** Math.floor(t / 3);
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
    (0.35 * totalHospitalBeds) - result.impact.infectionsByRequestedTime
  );
  result.severeImpact.hospitalBedsByRequestedTime = (
    (0.35 * totalHospitalBeds) - result.severeImpact.infectionsByRequestedTime
  );
  console.log(result);
  return result;
};

// covid19ImpactEstimator({
//   reportedCases: 1273,
//   population: 87001496,
//   totalHospitalBeds: 1158542,
//   timeToElapse: 152,
//   periodType: 'days'
// });

export default covid19ImpactEstimator;
