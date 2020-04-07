const covid19ImpactEstimator = (data) => {
  console.log(data);
  const {
    periodType,
    reportedCases,
    timeToElapse
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
    let multiplier;
    switch (periodType) {
      case 'days':
        t *= 1;
        multiplier = 2 ** (t / 3);
        break;
      case 'weeks':
        t *= 7;
        multiplier = 2 ** (t / 3);
        break;
      case 'months':
        t *= 31;
        multiplier = 2 ** (t / 3);
        break;
      default:
        break;
    }
    return multiplier;
  };
  result.impact.currentlyInfected = currentlyInfected(10);
  result.severeImpact.currentlyInfected = currentlyInfected(50);
  result.impact.infectionsByRequestedTime = (
    currentlyInfected(10) * infectionsByRequestedTime(timeToElapse)
  );
  result.severeImpact.infectionsByRequestedTime = (
    currentlyInfected(50) * infectionsByRequestedTime(timeToElapse)
  );
  console.log(result);
  return result;
};

export default covid19ImpactEstimator;
