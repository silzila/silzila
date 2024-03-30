import usaJson from './USMapData.json';
import worldJSON from './WorldData.json';
import indiaJSON from './IndiaMapData.json';
import brazilJSON from './BrazilMapData.json';
import chinaJSON from './ChinaMapData.json';
import franceJSON from './FranceMapData.json';
import germanyJSON from './GermanyMapData.json';
import japanMapJSON from './JapanMapData.json';
import australiaJSON from './AustraliaMapData.json';
import southAfricaJSON from './SouthAfricaMapData.json';
import ukJSON from './UKMapData.json';
import nigeriaJSON from './NigeriaMapData.json';


export const getGeoJSON = (name:string) =>{
    let mapJSON:any = {};

    switch (name) {
		case 'usa':
			mapJSON = usaJson;
			break;
		case 'world':
			mapJSON = worldJSON;
			break;
		case 'india':
			mapJSON = indiaJSON;
			break;
		case 'brazil':
			mapJSON = brazilJSON;
			break;
		case 'china':
			mapJSON = chinaJSON;
			break;
		case 'france':
			mapJSON = franceJSON;
			break;
		case 'germany':
			mapJSON = germanyJSON;
			break;
		case 'nigeria':
			mapJSON = nigeriaJSON;
			break;
		case 'japan':
			mapJSON = japanMapJSON;
			break;
		case 'australia':			
			mapJSON = australiaJSON;
			break;
		case 'southAfrica':
			mapJSON = southAfricaJSON;
			break;
		case 'uk':
			mapJSON = ukJSON;
			break;
		default:
			mapJSON = worldJSON;
			break;
	}
    
    return mapJSON;
}

export const getMismachedLocationArray = (chartData:any, columnName:string, mapJSONName:any, matchType:string)=>{
	let mapJSON = getGeoJSON(mapJSONName);
	let misMatchArray:any = [];

	chartData.forEach((data:any)=>{
		let isMatched = false;

		mapJSON.features.forEach((item:any)=>{
			if(item.properties[matchType] === data[columnName]){
				isMatched = true;
			}
		})

		if(!isMatched){
			data.selectedKey = "";
			misMatchArray.push(data);
		}
	});

	return misMatchArray;
}