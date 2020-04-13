const generator = (response) => {
  const { data, impact, severeImpact } = response;
  const {
    region: {
      name, avgAge, avgDailyIncomeInUSD, avgDailyIncomePopulation
    },
    periodType,
    reportedCases,
    totalHospitalBeds,
    population,
    timeToElapse
  } = data;
  const xml = `
    <?xml version="1.0" encoding="UTF-8" ?>
    <root>
      <data>
        <region> 
          <name>${name}</name>
          <avgAge>${avgAge}</avgAge>
          <avgDailyIncomeInUSD>${avgDailyIncomeInUSD}</avgDailyIncomeInUSD>
          <avgDailyIncomePopulation>${avgDailyIncomePopulation}</avgDailyIncomePopulation>
        </region>
        <periodType>${periodType}</periodType>
        <timeToElapse>${timeToElapse}</timeToElapse>
        <reportedCases>${reportedCases}</reportedCases>
        <population>${population}</population>
        <totalHospitalBeds>${totalHospitalBeds}</totalHospitalBeds>
      </data>
      <impact>
        <currentlyInfected>${impact.currentlyInfected}</currentlyInfected>
        <infectionsByRequestedTime>${impact.infectionsByRequestedTime}</infectionsByRequestedTime>
        <severeCasesByRequestedTime>${impact.severeCasesByRequestedTime}</severeCasesByRequestedTime>
        <hospitalBedsByRequestedTime>${impact.hospitalBedsByRequestedTime}</hospitalBedsByRequestedTime>
        <casesForICUByRequestedTime>${impact.casesForICUByRequestedTime}</casesForICUByRequestedTime>
        <casesForVentilatorsByRequestedTime>${impact.casesForVentilatorsByRequestedTime}</casesForVentilatorsByRequestedTime>
        <dollarsInFlight>${impact.dollarsInFlight}</dollarsInFlight>
      </impact>
      <severeImpact>
        <currentlyInfected>${severeImpact.currentlyInfected}</currentlyInfected>
        <infectionsByRequestedTime>${severeImpact.infectionsByRequestedTime}</infectionsByRequestedTime>
        <severeCasesByRequestedTime>${severeImpact.severeCasesByRequestedTime}</severeCasesByRequestedTime>
        <hospitalBedsByRequestedTime>${severeImpact.hospitalBedsByRequestedTime}</hospitalBedsByRequestedTime>
        <casesForICUByRequestedTime>${severeImpact.casesForICUByRequestedTime}</casesForICUByRequestedTime>
        <casesForVentilatorsByRequestedTime>${severeImpact.casesForVentilatorsByRequestedTime}</casesForVentilatorsByRequestedTime>
        <dollarsInFlight>${severeImpact.dollarsInFlight}</dollarsInFlight>
      </severeImpact>
    </root>`;
  return xml;
};
module.exports = generator;
