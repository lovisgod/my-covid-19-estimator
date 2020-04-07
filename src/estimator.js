const covid19ImpactEstimator = (data) => {
  console.log(data);
  const {
    reportedCases,
    timeToElapse,
    periodType
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
    currentlyInfected(10) * infectionsByRequestedTime(timeToElapse)
  );
  result.severeImpact.infectionsByRequestedTime = (
    currentlyInfected(50) * infectionsByRequestedTime(timeToElapse)
  );
  console.log(result);
  return result;
};

export default covid19ImpactEstimator;
