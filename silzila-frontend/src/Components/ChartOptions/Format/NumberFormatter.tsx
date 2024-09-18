// Helper function to format number

// Given a number this function returns an abbreviated number
// Eg 1000000 will be returned as 1M
export const formatNumberWithAbbrev = (value: any, digits: any) => {
	let multipyWithOne = value > 0 ? 1 : -1;

	let curValue = Math.abs(Number(value)) >= 1.0e9
		? ((Math.abs(Number(value)) / 1.0e9) * multipyWithOne).toFixed(digits)  + "B"
		: // Six Zeroes for Millions
		Math.abs(Number(value)) >= 1.0e6
		? ((Math.abs(Number(value)) / 1.0e6) * multipyWithOne).toFixed(digits) + "M"
		: // Three Zeroes for Thousands
		Math.abs(Number(value)) >= 1.0e3
		? ((Math.abs(Number(value)) / 1.0e3) * multipyWithOne).toFixed(digits) + "K"
		: (Math.abs(Number(value)) * multipyWithOne);	

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

export const formatChartLabelValueForSelectedMeasure = (chartControl: any, value: any, columnName: string) => {

	// everything same as formatChartLabelValue but for a selected measure

	if (chartControl.formatOptions.labelFormats?.measureFormats[columnName]?.enableRounding) {
		value = Number(value).toFixed(chartControl.formatOptions.labelFormats?.measureFormats[columnName]?.roundingDigits);
	}

	if (
		chartControl.formatOptions?.labelFormats.measureFormats[columnName]?.numberSeparator === "Abbrev"
	) {
	
		var text = value.toString();
		var index = text.indexOf(".");
		if ((index = -1)) {
		}
		var roundOriginalDigits = text.length - index - 1;

		value = formatNumberWithAbbrev(
			value,
			chartControl.formatOptions.labelFormats?.measureFormats[columnName]?.enableRounding
				? chartControl.formatOptions.labelFormats.measureFormats[columnName]?.roundingDigits
				: roundOriginalDigits
		);
	}

	if (chartControl.formatOptions.labelFormats?.measureFormats[columnName]?.numberSeparator === "Comma") {
		value = formatNumberWithComma(value);
	}

	// Returns value with currency symbol of user's choice
	if (chartControl.formatOptions.labelFormats?.measureFormats[columnName]?.formatValue === "Currency")
		value = `${chartControl.formatOptions.labelFormats?.measureFormats[columnName]?.currencySymbol} ${value}`;

	// Retuns value with a % suffix
	if (chartControl.formatOptions.labelFormats?.measureFormats[columnName]?.formatValue === "Percent") value = `${value} %`;

	return value;

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
