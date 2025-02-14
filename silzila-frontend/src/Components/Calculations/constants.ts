import Condition from "./Conditions/Condition/Condition";

type FunctionDefinitionType = {
    [key: string]: {
        fieldName: string,
        definition: string,
        flowName?: string
    }[];
};

export const functionDefinitions: FunctionDefinitionType = {
    All: [

        { fieldName: "Absolute", flowName: "absolute", definition: "Returns the absolute value of a number" },
        { fieldName: "Addition", flowName: "addition", definition: "Adds two or more numbers together" },
        { fieldName: "Ceiling", flowName: "ceiling", definition: "Returns the smallest integer greater than or equal to a number" },
        { fieldName: "Floor", flowName: "floor", definition: "Returns the largest integer less than or equal to a number" },
        { fieldName: "Division", flowName: "division", definition: "Divides one number by another" },
        // { fieldName: "Power", flowName: "power", definition: "Raises a number to the specified power" },
        { fieldName: "Log", flowName: "log", definition: "Returns the logarithm of a number" },
        { fieldName: "Min", flowName: "min", definition: "Returns the smallest value from a set of numbers" },
        { fieldName: "Max", flowName: "max", definition: "Returns the largest value from a set of numbers" },
        { fieldName: "Multiplication", flowName: "multiplication", definition: "Multiplies two or more numbers together" },
        { fieldName: "Subtraction", flowName: "subtraction", definition: "Subtracts one number from another" },

        // Condition Functions
        { fieldName: "IfElse", definition: "Executes different code blocks based on specified conditions" },

        { fieldName: "Lowercase", flowName: "lowercase", definition: "Converts to Lower Case" },
        { fieldName: "Uppercase", flowName: "uppercase", definition: "Converts to Upper Case" },
        { fieldName: "Propercase", flowName: "propercase", definition: "Returns first letter of every word as Upper case" },
        { fieldName: "Trim", flowName: "trim", definition: "Trims white spaces on both the sides" },
        { fieldName: "Substring Right", flowName: "substringright", definition: "Returns n characters or all except n characters from right side of a text or column" },
        { fieldName: "Substring Left", flowName: "substringleft", definition: "Returns n characters or all except n characters from left side of a text or column" },
        { fieldName: "Length", flowName: "length", definition: "Returns number of characters of a text or column" },
        { fieldName: "Left Trim", flowName: "ltrim", definition: "Trims white spaces on the left side of a string" },
        { fieldName: "Right Trim", flowName: "rtrim", definition: "Trims white spaces on the right side of a string" },
        { fieldName: "Replace", flowName: "replace", definition: "Finds and replaces a substring for every occurence in a text or column" },
        { fieldName: "Split", flowName: "split", definition: "splits the text into list of items based on delimiter and returns the specific item from the list" },
        /**
         * Date fns
         */
        { fieldName: "String to Date", definition: "Converts String to Date", flowName: 'stringToDate' },
        { fieldName: "Date Add", definition: "Adds date interval (days, months, etc) to date", flowName: 'addDateInterval' },
        { fieldName: "Date Difference", definition: "Returns number of date parts (weeks, years, etc) between two dates", flowName: 'dateInterval' },
        { fieldName: "Date Name", definition: "Returns name of the date part of a date", flowName: 'datePartName' },
        { fieldName: "Date Number", definition: "Returns number of the date part of a date", flowName: 'datePartNumber' },
        { fieldName: "Date Truncate", definition: "Truncates a date to the desired date part", flowName: 'truncateDate' },
        // { fieldName: "Today", definition: "Returns current date", flowName: 'currentDate' },
        // { fieldName: "Now", definition: "Returns current timestamp", flowName: 'currentTimestamp' },
        { fieldName: "Min Date", definition: "Min of a date column", flowName: 'minDate' },
        { fieldName: "Max Date", definition: "Max of a date column", flowName: 'maxDate' }
    ],
    Number: [
        { fieldName: "Absolute", flowName: "absolute", definition: "Returns the absolute value of a number" },
        { fieldName: "Addition", flowName: "addition", definition: "Adds two or more numbers together" },
        { fieldName: "Ceiling", flowName: "ceiling", definition: "Returns the smallest integer greater than or equal to a number" },
        { fieldName: "Floor", flowName: "floor", definition: "Returns the largest integer less than or equal to a number" },
        { fieldName: "Division", flowName: "division", definition: "Divides one number by another" },
        // { fieldName: "Power", flowName: "power", definition: "Raises a number to the specified power" },
        { fieldName: "Log", flowName: "log", definition: "Returns the logarithm of a number" },
        { fieldName: "Min", flowName: "min", definition: "Returns the smallest value from a set of numbers" },
        { fieldName: "Max", flowName: "max", definition: "Returns the largest value from a set of numbers" },
        { fieldName: "Multiplication", flowName: "multiplication", definition: "Multiplies two or more numbers together" },
        { fieldName: "Subtraction", flowName: "subtraction", definition: "Subtracts one number from another" },
    ],
    String: [
        { fieldName: "Lowercase", flowName: "lowercase", definition: "Converts to Lower Case" },
        { fieldName: "Uppercase", flowName: "uppercase", definition: "Converts to Upper Case" },
        { fieldName: "Propercase", flowName: "propercase", definition: "Returns first letter of every word as Upper case" },
        { fieldName: "Trim", flowName: "trim", definition: "Trims white spaces on both the sides" },
        { fieldName: "Substring Right", flowName: "substringright", definition: "Returns n characters or all except n characters from right side of a text or column" },
        { fieldName: "Substring Left", flowName: "substringleft", definition: "Returns n characters or all except n characters from left side of a text or column" },
        { fieldName: "Length", flowName: "length", definition: "Returns number of characters of a text or column" },
        { fieldName: "Left Trim", flowName: "ltrim", definition: "Trims white spaces on the left side of a string" },
        { fieldName: "Right Trim", flowName: "rtrim", definition: "Trims white spaces on the right side of a string" },
        { fieldName: "Replace", flowName: "replace", definition: "Finds and replaces a substring for every occurence in a text or column" },
        { fieldName: "Split", flowName: "split", definition: "splits the text into list of items based on delimiter and returns the specific item from the list" },
    ],
    Date: [
        { fieldName: "String to Date", definition: "Converts String to Date", flowName: 'stringToDate' },
        { fieldName: "Date Add", definition: "Adds date interval (days, months, etc) to date", flowName: 'addDateInterval' },
        { fieldName: "Date Difference", definition: "Returns number of date parts (weeks, years, etc) between two dates", flowName: 'dateInterval' },
        { fieldName: "Date Name", definition: "Returns name of the date part of a date", flowName: 'datePartName' },
        { fieldName: "Date Number", definition: "Returns number of the date part of a date", flowName: 'datePartNumber' },
        { fieldName: "Date Truncate", definition: "Truncates a date to the desired date part", flowName: 'truncateDate' },
        // { fieldName: "Today", definition: "Returns current date", flowName: 'currentDate' },
        // { fieldName: "Now", definition: "Returns current timestamp", flowName: 'currentTimestamp' },
        { fieldName: "Min Date", definition: "Min of a date column", flowName: 'minDate' },
        { fieldName: "Max Date", definition: "Max of a date column", flowName: 'maxDate' }
    ],
    Condition: [
        { fieldName: "IfElse", definition: "Executes different code blocks based on specified conditions" },
    ],
    // Aggregation: [
    //     { fieldName: "Aggregation", definition: "Performs calculations on a set of values to return a single value" }
    // ]
};

// below sources don't represent the source in redux but the fields. Basically split can have multiple sources like one field, one index and one delimiter etc but we are storing the limits for field in below
export const categorizedOperationsCount = {
    singleSource: ["absolute", "ceiling", "floor", "log", "replace", "split", "substringleft", "substringright", "uppercase", "lowercase", "propercase", "length", "ltrim", "trim", "rtrim", "power",],
    // reCAPTCHA solved, allow signInWithPhoneNumber.
    twoSources: ["division", "subtraction"],
    multipleSources: ["addition", "multiplication", "min", "max"],
}

// TODO: depricate the following and use minMax instead
export const categorizedOperationsForFlowWarning = {
    minimumSingleSource: [
        "absolute",
        "ceiling",
        "floor",
        "log",
        "lowercase",
        "propercase",
        "replace",
        "split",
        "substringleft",
        "substringright",
        "uppercase",
        "length",
        "ltrim",
        "trim",
        "rtrim",
    ],
    minimumTwoSources: [
        "division",
        "power",
        "subtraction",
        "addition",
        "multiplication",
        "min",
        "max"
    ],
}

export const minMax: {
    [key: string]: {
        [key: string]: {
            min: number,
            max: number
        }
    }
} = {
    Number: {
        absolute: { min: 1, max: 1 },
        addition: { min: 2, max: 8 },
        ceiling: { min: 1, max: 1 },
        floor: { min: 1, max: 1 },
        division: { min: 2, max: 2 },
        power: { min: 1, max: 1 },
        log: { min: 1, max: 1 },
        min: { min: 2, max: 8 },
        max: { min: 2, max: 8 },
        multiplication: { min: 2, max: 8 },
        subtraction: { min: 2, max: 2 }
    },
    String: {
        lowercase: { min: 1, max: 1 },
        uppercase: { min: 1, max: 1 },
        propercase: { min: 1, max: 1 },
        trim: { min: 1, max: 1 },
        substringleft: { min: 1, max: 1 },
        substringright: { min: 1, max: 1 },
        length: { min: 1, max: 1 },
        ltrim: { min: 1, max: 1 },
        rtrim: { min: 1, max: 1 },
        replace: { min: 1, max: 1 },
        split: { min: 1, max: 1 },
    },
    Date: {
        stringToDate: { min: 1, max: 1 },
        addDateInterval: { min: 1, max: 1 },
        dateInterval: { min: 2, max: 2 },
        datePartName: { min: 1, max: 1 },
        datePartNumber: { min: 1, max: 1 },
        truncateDate: { min: 1, max: 1 },
        currentDate: { min: 0, max: 0 },
        currentTimestamp: { min: 0, max: 0 },
        minDate: { min: 1, max: 1 },
        maxDate: { min: 1, max: 1 }
    },
    Condition: {
        IfElse: { min: 1, max: 1 },
    }
}