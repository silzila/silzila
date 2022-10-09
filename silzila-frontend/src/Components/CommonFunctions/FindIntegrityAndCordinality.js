// export const FindCardinality = (showHead, showTail) => {
// 	if (showHead === true && showTail === true) {
// 		return "many to many";
// 	}
// 	if (showHead === false && showTail === false) {
// 		return "one to one";
// 	}
// 	if (showHead === true && showTail === false) {
// 		return "one to many";
// 	}
// 	if (showHead === false && showTail === true) {
// 		return "many to one";
// 	}
// };

export const FindRowMatchId = (ity) => {
	switch (ity) {
		case "full":
			return { rowMatchId1: 1, rowMatchId2: 1 };
		case "inner":
			return { rowMatchId1: 2, rowMatchId2: 2 };
		case "left":
			return { rowMatchId1: 1, rowMatchId2: 2 };
		case "right":
			return { rowMatchId1: 2, rowMatchId2: 1 };
		default:
			return null;
	}
};

export const FindIntegrity = (Id1, Id2) => {
	if (parseInt(Id1) === 1 && parseInt(Id2) === 1) {
		return "full";
	}
	if (parseInt(Id1) === 2 && parseInt(Id2) === 2) {
		return "inner";
	}
	if (parseInt(Id1) === 1 && parseInt(Id2) === 2) {
		return "left";
	}
	if (parseInt(Id1) === 2 && parseInt(Id2) === 1) {
		return "right";
	}
};

export const FindRowUniqueId = (cty) => {
	switch (cty) {
		case "one to one":
			return { rowUniqueId1: 1, rowUniqueId2: 1 };
		case "one to many":
			return { rowUniqueId1: 1, rowUniqueId2: 2 };
		case "many to one":
			return { rowUniqueId1: 2, rowUniqueId2: 1 };
		case "many to many":
			return { rowUniqueId1: 2, rowUniqueId2: 2 };
		default:
			return null;
	}
};

export const FindCardinality = (Id1, Id2) => {
	if (parseInt(Id1) === 1 && parseInt(Id2) === 1) {
		return "one to one";
	}
	if (parseInt(Id1) === 2 && parseInt(Id2) === 2) {
		return "many to many";
	}
	if (parseInt(Id1) === 1 && parseInt(Id2) === 2) {
		return "one to many";
	}
	if (parseInt(Id1) === 2 && parseInt(Id2) === 1) {
		return "many to one";
	}
};

export const FindShowHeadAndShowTail = (cardinality) => {
	switch (cardinality) {
		case "one to one":
			return { showHead: false, showTail: false };
		case "one to many":
			return { showHead: true, showTail: false };
		case "many to one":
			return { showHead: false, showTail: true };
		case "many to many":
			return { showHead: true, showTail: true };
		default:
			return null;
	}
};
