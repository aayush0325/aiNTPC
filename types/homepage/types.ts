export interface EnergyData {
    id: number;
    date: Date;
    production: number;
    maxtempC: number;
    mintempC: number;
    sunHour: number;
    cloudcover: number;
    tempC: number;
    humidity: number;
    windSpeedKmph: number;
    precipMM: number;
    weatherDesc: string;
}
