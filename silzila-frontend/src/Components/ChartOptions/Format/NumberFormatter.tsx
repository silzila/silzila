import Decimal from 'decimal.js';

// Helper function to format number

// Given a number this function returns an abbreviated number
// Eg 1000000 will be returned as 1M
export const formatNumberWithAbbrev = (value: any, digits: any) => {

	let multipyWithOne = value > 0 ? 1 : -1;

	let curValue = Math.abs(Number(value)) >= 1.0e9
		? ((Math.abs(Number(value)) / 1.0e9) * multipyWithOne).toFixed(digits) + "B"
		: // Six Zeroes for Millions
		Math.abs(Number(value)) >= 1.0e6
			? ((Math.abs(Number(value)) / 1.0e6) * multipyWithOne).toFixed(digits) + "M"
			: // Three Zeroes for Thousands
			Math.abs(Number(value)) >= 1.0e3
				? ((Math.abs(Number(value)) / 1.0e3) * multipyWithOne).toFixed(digits) + "K"
				: Math.abs(Number(value)) < 1 ? Number(value).toFixed(digits) : Number(value);

	return curValue;
};

// Given a number this function returns comma separated number
// Eg 1000000 will be returned as 1,000,000
export const formatNumberWithComma = (value: any) => {
	var commas = value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
	return commas;
};

// Function that formats numbers in labels for a chart
// Rounding off digits, adding commas or abbreviations, add a currency Symbol, etc
export const formatChartLabelValue = (chartControl: any, value: any) => {
	// If Rounding enabled, returns a rounded value
	if (chartControl.formatOptions.labelFormats.enableRounding) {
		value = Number(value).toFixed(chartControl.formatOptions.labelFormats.roundingDigits);
	}

	// Returns an appreviated value along with required rounding off
	if (chartControl.formatOptions.labelFormats.numberSeparator === "Abbrev") {
		var text = value.toString();
		var index = text.indexOf(".");
		if ((index = -1)) {
		}
		var roundOriginalDigits = text.length - index - 1;

		value = formatNumberWithAbbrev(
			value,
			chartControl.formatOptions.labelFormats.enableRounding
				? chartControl.formatOptions.labelFormats.roundingDigits
				: roundOriginalDigits
		);
	}

	// Returns a comma separated value of number
	if (chartControl.formatOptions.labelFormats.numberSeparator === "Comma") {
		value = formatNumberWithComma(value);
	}

	// Returns value with currency symbol of user's choice
	if (chartControl.formatOptions.labelFormats.formatValue === "Currency")
		value = `${chartControl.formatOptions.labelFormats.currencySymbol} ${value}`;

	// Retuns value with a % suffix
	if (chartControl.formatOptions.labelFormats.formatValue === "Percent") value = `${value} %`;

	return value;
};

export const formatChartLabelValueForSelectedMeasure = (
	chartControl: any,
	chartProperties: any,
	value: any,
	columnName: string, // this is the displayname of the measure
) => {

	const measureAxis = chartProperties.chartAxes.find((item: any) => item.name === 'Measure');
	if (!measureAxis) {
		console.warn('Measure axis not found');
		return value;
	}

	const field = measureAxis.fields.find((val: any) => val?.displayname === columnName);
	if (!field) {
		console.warn(`Field with displayname "${columnName}" not found`);
		return value;
	}

	const uId = field.uId;
	const measureFormat = chartControl.formatOptions.labelFormats?.measureFormats[uId];

	if (!measureFormat) {
		return value;
	}

	if (!(columnName.length > 0)) {
		return value;
	}

	// value = removeTrailingZeros(value);

	if (measureFormat.percentageCalculate) {	
		
		value = new Decimal(value).times(100);
	}

	if (measureFormat.enableRounding) {
		value = Number(value).toFixed(measureFormat.roundingDigits);
	}

	if (measureFormat.numberSeparator === "Abbrev") {
		const valueTemp = value

		var text = valueTemp.toString();
		var index = text.indexOf(".");
		if ((index = -1)) {
		}
		var roundOriginalDigits = text.length - index - 1;

		value = formatNumberWithAbbrev(
			value,
			measureFormat.enableRounding
				? measureFormat.roundingDigits
				: roundOriginalDigits
		);
	}

	if (measureFormat.numberSeparator === "Comma") {
		value = formatNumberWithComma(value);
	}

	if (measureFormat.formatValue === "Currency") {
		value = `${measureFormat.currencySymbol} ${value}`;
	}

	if (measureFormat.formatValue === "Percent") {
		value = `${value} %`;
	}

	return value;
}

export const formatChartYAxisValueForSelectedMeasure = (
	chartControl: any,
	chartProperties: any,
	value: any,
	columnName: string, // this is the displayname of the measure
) => {

}

// Similar to above function. But formatting done for Y axis values in a chart
export const formatChartYAxisValue = (chartControl: any, value: any) => {
	// If Rounding enabled, returns a rounded value
	if (chartControl.formatOptions.yAxisFormats.enableRounding) {
		value = Number(value).toFixed(chartControl.formatOptions.yAxisFormats.roundingDigits);
	}

	// Returns an appreviated value along with required rounding off
	if (chartControl.formatOptions.yAxisFormats.numberSeparator === "Abbrev") {
		var text = value.toString();
		var index = text.indexOf(".");
		if ((index = -1)) {
		}
		var roundOriginalDigits = text.length - index - 1;

		value = formatNumberWithAbbrev(
			value,
			chartControl.formatOptions.yAxisFormats.enableRounding
				? chartControl.formatOptions.yAxisFormats.roundingDigits
				: roundOriginalDigits
		);
	}

	// Returns a comma separated value of number
	if (chartControl.formatOptions.yAxisFormats.numberSeparator === "Comma") {
		value = formatNumberWithComma(value);
	}

	// Returns value with currency symbol of user's choice
	if (chartControl.formatOptions.labelFormats.formatValue === "Currency") {
		value = `${chartControl.formatOptions.labelFormats.currencySymbol} ${value}`;
	}

	// Retuns value with a % suffix
	if (chartControl.formatOptions.labelFormats.formatValue === "Percent") {
		value = `${value} %`;
	}

	return value;
};

// Similar to above function. But formatting done for X axis values in a chart
export const formatChartXAxisValue = (chartControl: any, value: any) => {
	// If Rounding enabled, returns a rounded value
	if (chartControl.formatOptions.xAxisFormats.enableRounding) {
		value = Number(value).toFixed(chartControl.formatOptions.xAxisFormats.roundingDigits);
	}

	// Returns an appreviated value along with required rounding off
	if (chartControl.formatOptions.xAxisFormats.numberSeparator === "Abbrev") {
		var text = value.toString();
		var index = text.indexOf(".");
		if ((index = -1)) {
		}
		var roundOriginalDigits = text.length - index - 1;

		value = formatNumberWithAbbrev(
			value,
			chartControl.formatOptions.xAxisFormats.enableRounding
				? chartControl.formatOptions.xAxisFormats.roundingDigits
				: roundOriginalDigits
		);
	}

	// Returns a comma separated value of number
	if (chartControl.formatOptions.xAxisFormats.numberSeparator === "Comma") {
		value = formatNumberWithComma(value);
	}

	// Returns value with currency symbol of user's choice
	if (chartControl.formatOptions.labelFormats.formatValue === "Currency") {
		value = `${chartControl.formatOptions.labelFormats.currencySymbol} ${value}`;
	}

	// Retuns value with a % suffix
	if (chartControl.formatOptions.labelFormats.formatValue === "Percent") {
		value = `${value} %`;
	}

	return value;
};

function removeTrailingZeros(number: number) {
	return number.toString().replace(/\.0+$/, '');
}