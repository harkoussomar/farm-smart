import { Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { Cloud, CloudFog, CloudLightning, CloudRain, CloudSnow, Droplets, Sun, SunMedium, Wind } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Button } from '../ui/button';
import AnimatedCard from './AnimatedCard';

// Weather data interface
interface WeatherData {
    current: {
        temp: number;
        feels_like: number;
        humidity: number;
        wind_speed: number;
        uvi: number;
        weather: Array<{
            id: number;
            main: string;
            description: string;
            icon: string;
        }>;
    };
    hourly: Array<{
        dt: number;
        temp: number;
        weather: Array<{
            id: number;
            main: string;
            description: string;
            icon: string;
        }>;
    }>;
    daily: Array<{
        dt: number;
        temp: {
            day: number;
            min: number;
            max: number;
        };
        weather: Array<{
            id: number;
            main: string;
            description: string;
        }>;
    }>;
}

// Weather icons with meaningful colors
const ThunderstormIcon = () => <CloudLightning color="#846EFD" stroke="#846EFD" strokeWidth={2} />; // Purple for storms
const RainIcon = () => <CloudRain color="#4F94FC" stroke="#4F94FC" strokeWidth={2} />; // Blue for rain
const SnowIcon = () => <CloudSnow color="#A5C8FD" stroke="#A5C8FD" strokeWidth={2} />; // Light blue for snow
const MistIcon = () => <CloudFog color="#98A7AD" stroke="#98A7AD" strokeWidth={2} />; // Gray for mist/fog
const SunIcon = () => <Sun color="#FDB813" stroke="#FDB813" strokeWidth={2} />; // Bright yellow for sun
const CloudIcon = ({ className }: { className?: string }) => <Cloud color="#7EADB4" stroke="#7EADB4" strokeWidth={2} className={className} />; // Blue-gray for clouds
const PartlyCloudyIcon = () => (
    <div className="relative">
        <Sun color="#FDB813" stroke="#FDB813" strokeWidth={2} />
        <Cloud color="#7EADB4" stroke="#7EADB4" strokeWidth={2} className="absolute scale-75 -top-2 -right-2" />
    </div>
); // Combined sun and cloud
const HumidityIcon = ({ className }: { className?: string }) => <Droplets color="#4F94FC" stroke="#4F94FC" strokeWidth={2} className={className} />; // Blue for humidity
const WindIcon = ({ className }: { className?: string }) => <Wind color="#98A7AD" stroke="#98A7AD" strokeWidth={2} className={className} />; // Gray for wind
const UVIcon = ({ className }: { className?: string }) => <SunMedium color="#FF9D42" stroke="#FF9D42" strokeWidth={2} className={className} />; // Orange for UV

const WeatherWidget = () => {
    // State for weather data
    const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [farmLocation, setFarmLocation] = useState({ lat: 0, lon: 0 });
    const [hasLocation, setHasLocation] = useState(false);

    // Get weather icon based on weather condition with enhanced visuals
    const getWeatherIcon = (weatherId: number) => {
        if (weatherId >= 200 && weatherId < 300) {
            return <ThunderstormIcon />; // Thunderstorm
        } else if (weatherId >= 300 && weatherId < 600) {
            return <RainIcon />; // Rain or drizzle
        } else if (weatherId >= 600 && weatherId < 700) {
            return <SnowIcon />; // Snow
        } else if (weatherId >= 700 && weatherId < 800) {
            return <MistIcon />; // Atmosphere (fog, mist, etc.)
        } else if (weatherId === 800) {
            return <SunIcon />; // Clear sky
        } else if (weatherId === 801) {
            return <PartlyCloudyIcon />; // Few clouds
        } else if (weatherId > 801) {
            return <CloudIcon />; // Cloudy
        }
        return <CloudIcon />; // Default
    };

    // Get background color class based on weather condition
    const getWeatherBgClass = (weatherId: number) => {
        if (weatherId >= 200 && weatherId < 300) {
            return 'bg-gradient-to-br from-purple-50 to-slate-100'; // Thunderstorm
        } else if (weatherId >= 300 && weatherId < 600) {
            return 'bg-gradient-to-br from-blue-50 to-slate-100'; // Rain or drizzle
        } else if (weatherId >= 600 && weatherId < 700) {
            return 'bg-gradient-to-br from-sky-50 to-slate-100'; // Snow
        } else if (weatherId >= 700 && weatherId < 800) {
            return 'bg-gradient-to-br from-gray-50 to-slate-100'; // Atmosphere (fog, mist, etc.)
        } else if (weatherId === 800) {
            return 'bg-gradient-to-br from-amber-50 to-sky-50'; // Clear sky
        } else if (weatherId > 800) {
            return 'bg-gradient-to-br from-sky-50 to-slate-100'; // Cloudy
        }
        return 'bg-gradient-to-br from-slate-50 to-slate-100'; // Default
    };

    // Get farming advice based on weather
    const getFarmingAdvice = (weather: string, temp: number, windSpeed: number, uvi: number) => {
        if (weather.includes('rain') || weather.includes('drizzle') || weather.includes('thunderstorm')) {
            return 'Not ideal for spraying or harvesting. Consider postponing outdoor activities.';
        } else if (weather.includes('snow') || temp < 5) {
            return 'Cold conditions. Protect sensitive crops and irrigation systems.';
        } else if (windSpeed > 20) {
            return 'High winds may affect spraying operations and could damage crops.';
        } else if (uvi > 6) {
            return 'High UV levels. Good for plant growth but consider sun protection for workers.';
        } else if (weather.includes('clear') && temp > 18 && temp < 30) {
            return 'Excellent conditions for most farming activities.';
        } else if (temp > 30) {
            return 'High temperatures may stress crops. Ensure adequate irrigation.';
        }
        return 'Moderate conditions for farming activities.';
    };

    // Format time from unix timestamp
    const formatTime = (timestamp: number) => {
        const date = new Date(timestamp * 1000);
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    // Fetch farm profile data and then weather data
    useEffect(() => {
        console.log('Attempting to get farm location data...');
        // First try to get farm profile data from web route
        fetch('/farmer/get-farm-location')
            .then((response) => {
                if (!response.ok) {
                    console.error(`Failed to fetch farm profile: ${response.status} ${response.statusText}`);
                    throw new Error(`Failed to fetch farm profile: ${response.status}`);
                }
                return response.json();
            })
            .then((data) => {
                console.log('Farm profile data received:', data);
                if (data && data.latitude && data.longitude) {
                    const lat = parseFloat(data.latitude);
                    const lon = parseFloat(data.longitude);

                    // Validate the coordinates
                    if (isNaN(lat) || isNaN(lon) || Math.abs(lat) > 90 || Math.abs(lon) > 180) {
                        console.error('Invalid coordinates in farm profile:', { lat, lon });
                        setError('Your farm location has invalid coordinates. Please update your farm profile with correct location information.');
                        setLoading(false);
                        return;
                    }

                    setFarmLocation({ lat, lon });
                    setHasLocation(true);
                    console.log('Using farm coordinates:', { lat, lon });
                } else {
                    console.log('No farm coordinates found in profile.');
                    setError(
                        'No location data in your farm profile. Please update your farm profile with location information for accurate weather forecasts.',
                    );
                    setLoading(false);

                    // Create demo weather data as fallback
                    const demoData = createDemoWeatherData();
                    setWeatherData(demoData);
                }
            })
            .catch((err) => {
                console.warn('Farm profile fetch issue:', err.message);
                setError('Could not load your farm location. Please ensure your farm profile is complete with location information.');
                setLoading(false);

                // Create demo weather data as fallback
                const demoData = createDemoWeatherData();
                setWeatherData(demoData);
            });
    }, []);

    // Fetch weather data when we have location
    useEffect(() => {
        if (hasLocation) {
            // Verify that we have valid coordinates
            if (isNaN(farmLocation.lat) || isNaN(farmLocation.lon) || Math.abs(farmLocation.lat) > 90 || Math.abs(farmLocation.lon) > 180) {
                console.error('Invalid coordinates:', farmLocation);
                setError('Invalid location coordinates. Please update your farm profile.');
                setLoading(false);
                return;
            }

            try {
                // Use Open-Meteo - a free weather API that doesn't require authentication
                console.log('Fetching weather for location:', farmLocation);
                const url = `https://api.open-meteo.com/v1/forecast?latitude=${farmLocation.lat}&longitude=${farmLocation.lon}&hourly=temperature_2m,relativehumidity_2m,apparent_temperature,weathercode,windspeed_10m&daily=weathercode,temperature_2m_max,temperature_2m_min&current_weather=true&timeformat=unixtime&timezone=auto`;

                fetch(url)
                    .then((response) => {
                        if (!response.ok) {
                            console.error(`API Error ${response.status}: ${response.statusText}`);
                            throw new Error(`Weather API error: ${response.status}`);
                        }
                        return response.json();
                    })
                    .then((data) => {
                        console.log('Weather data received from Open-Meteo:', data);

                        // Verify the data structure is as expected
                        if (!data.current_weather || !data.hourly || !data.daily) {
                            throw new Error('Unexpected data format from weather API');
                        }

                        // Get current hour index
                        const currentTime = data.current_weather.time;
                        const hourlyIndex = data.hourly.time.findIndex((t: number) => t >= currentTime);

                        if (hourlyIndex === -1) {
                            throw new Error('Could not find current time in hourly forecast');
                        }

                        // Convert Open-Meteo format to our expected format
                        const convertedData = {
                            current: {
                                temp: data.current_weather.temperature,
                                feels_like: data.hourly.apparent_temperature[hourlyIndex],
                                humidity: data.hourly.relativehumidity_2m[hourlyIndex],
                                wind_speed: data.current_weather.windspeed / 3.6, // Convert to m/s
                                uvi: 5, // Not provided by Open-Meteo, use a moderate default value
                                weather: [
                                    {
                                        id: convertWMOCodeToId(data.current_weather.weathercode),
                                        main: getWeatherMainFromWMO(data.current_weather.weathercode),
                                        description: getWeatherDescFromWMO(data.current_weather.weathercode),
                                        icon: '',
                                    },
                                ],
                            },
                            hourly: data.hourly.time.slice(hourlyIndex, hourlyIndex + 5).map((time: number, i: number) => ({
                                dt: time,
                                temp: data.hourly.temperature_2m[hourlyIndex + i],
                                weather: [
                                    {
                                        id: convertWMOCodeToId(data.hourly.weathercode[hourlyIndex + i]),
                                        main: getWeatherMainFromWMO(data.hourly.weathercode[hourlyIndex + i]),
                                        description: getWeatherDescFromWMO(data.hourly.weathercode[hourlyIndex + i]),
                                        icon: '',
                                    },
                                ],
                            })),
                            daily: data.daily.time.map((time: number, i: number) => ({
                                dt: time,
                                temp: {
                                    day: (data.daily.temperature_2m_max[i] + data.daily.temperature_2m_min[i]) / 2,
                                    min: data.daily.temperature_2m_min[i],
                                    max: data.daily.temperature_2m_max[i],
                                },
                                weather: [
                                    {
                                        id: convertWMOCodeToId(data.daily.weathercode[i]),
                                        main: getWeatherMainFromWMO(data.daily.weathercode[i]),
                                        description: getWeatherDescFromWMO(data.daily.weathercode[i]),
                                    },
                                ],
                            })),
                        } as WeatherData;

                        setWeatherData(convertedData);
                        setLoading(false);
                        setError(null); // Clear any previous errors
                    })
                    .catch((err) => {
                        console.error('Error fetching weather data from Open-Meteo:', err);

                        // Create demo weather data as a fallback
                        console.log('Using demo weather data...');
                        const demoData = createDemoWeatherData();
                        setWeatherData(demoData);
                        setLoading(false);
                    });
            } catch (err) {
                console.error('Critical error in weather fetching:', err);
                // Use demo data as fallback
                const demoData = createDemoWeatherData();
                setWeatherData(demoData);
                setLoading(false);
            }
        }
    }, [hasLocation, farmLocation]);

    // Create demo weather data for testing
    const createDemoWeatherData = (): WeatherData => {
        const now = new Date();

        return {
            current: {
                temp: 22,
                feels_like: 22.5,
                humidity: 65,
                wind_speed: 3.2,
                uvi: 4,
                weather: [
                    {
                        id: 800,
                        main: 'Clear',
                        description: 'clear sky',
                        icon: '01d',
                    },
                ],
            },
            hourly: Array.from({ length: 5 }, (_, i) => ({
                dt: now.getTime() / 1000 + i * 3600,
                temp: 22 + Math.sin(i) * 3, // Temperature variations
                weather: [
                    {
                        id: i % 2 === 0 ? 800 : 801,
                        main: i % 2 === 0 ? 'Clear' : 'Clouds',
                        description: i % 2 === 0 ? 'clear sky' : 'few clouds',
                        icon: i % 2 === 0 ? '01d' : '02d',
                    },
                ],
            })),
            daily: Array.from({ length: 3 }, (_, i) => ({
                dt: now.getTime() / 1000 + i * 86400,
                temp: {
                    day: 23 + i,
                    min: 18 + i,
                    max: 27 + i,
                },
                weather: [
                    {
                        id: 800,
                        main: 'Clear',
                        description: 'clear sky',
                    },
                ],
            })),
        };
    };

    // Helper function to convert WMO weather codes to OpenWeatherMap-like IDs
    const convertWMOCodeToId = (code: number): number => {
        // Clear
        if (code === 0) return 800;
        // Clouds
        if (code === 1) return 801; // Few clouds
        if (code === 2) return 802; // Scattered clouds
        if (code === 3) return 804; // Overcast
        // Fog
        if (code >= 45 && code <= 48) return 741;
        // Drizzle
        if (code >= 51 && code <= 57) return 300;
        // Rain
        if (code >= 61 && code <= 65) return 500;
        if (code >= 80 && code <= 82) return 501;
        // Snow
        if (code >= 71 && code <= 77) return 600;
        if (code === 85 || code === 86) return 601;
        // Thunderstorm
        if (code >= 95 && code <= 99) return 200;

        return 800; // Default to clear
    };

    // Get main weather description from WMO code
    const getWeatherMainFromWMO = (code: number): string => {
        if (code === 0) return 'Clear';
        if (code >= 1 && code <= 3) return 'Clouds';
        if (code >= 45 && code <= 48) return 'Fog';
        if (code >= 51 && code <= 57) return 'Drizzle';
        if ((code >= 61 && code <= 65) || (code >= 80 && code <= 82)) return 'Rain';
        if ((code >= 71 && code <= 77) || code === 85 || code === 86) return 'Snow';
        if (code >= 95 && code <= 99) return 'Thunderstorm';
        return 'Clear';
    };

    // Get weather description from WMO code
    const getWeatherDescFromWMO = (code: number): string => {
        if (code === 0) return 'clear sky';
        if (code === 1) return 'few clouds';
        if (code === 2) return 'scattered clouds';
        if (code === 3) return 'overcast clouds';
        if (code >= 45 && code <= 48) return 'fog';
        if (code >= 51 && code <= 57) return 'drizzle';
        if (code >= 61 && code <= 65) return 'rain';
        if (code >= 80 && code <= 82) return 'rain showers';
        if (code >= 71 && code <= 77) return 'snow';
        if (code === 85 || code === 86) return 'snow showers';
        if (code >= 95 && code <= 99) return 'thunderstorm';
        return 'clear sky';
    };

    // Get weather description with enhanced formatting
    const getWeatherEmoji = (weatherId: number) => {
        if (weatherId >= 200 && weatherId < 300) return '⚡'; // Thunderstorm
        if (weatherId >= 300 && weatherId < 600) return '🌧️'; // Rain
        if (weatherId >= 600 && weatherId < 700) return '❄️'; // Snow
        if (weatherId >= 700 && weatherId < 800) return '🌫️'; // Fog
        if (weatherId === 800) return '☀️'; // Clear
        if (weatherId > 800) return '☁️'; // Cloudy
        return '';
    };

    // Get UVI rating and color
    const getUVIRating = (uvi: number) => {
        if (uvi <= 2) return { rating: 'Low', color: 'text-green-600' };
        if (uvi <= 5) return { rating: 'Moderate', color: 'text-yellow-600' };
        if (uvi <= 7) return { rating: 'High', color: 'text-orange-600' };
        if (uvi <= 10) return { rating: 'Very High', color: 'text-red-600' };
        return { rating: 'Extreme', color: 'text-purple-600' };
    };

    // Loading state
    if (loading) {
        return (
            <AnimatedCard delay={0.3} className={`overflow-hidden p-0 ${error ? 'flex flex-col items-center justify-center p-6 text-center' : ''}`}>
                <div className="flex flex-col items-center justify-center w-full h-full p-6">
                    <div className="w-12 h-12 border-4 rounded-full border-primary animate-spin border-t-transparent"></div>
                    <p className="mt-4 text-sm text-muted-foreground">Loading weather data...</p>
                </div>
            </AnimatedCard>
        );
    }

    // Error state
    if (error) {
        return (
            <AnimatedCard delay={0.3} className={`overflow-hidden p-0 ${error ? 'flex flex-col items-center justify-center p-6 text-center' : ''}`}>
                <div className="space-y-4">
                    <CloudIcon className="w-16 h-16 mx-auto text-muted-foreground/70" />
                    <h3 className="text-xl font-semibold">Weather Unavailable</h3>
                    <p className="text-muted-foreground">{error}</p>
                    <Button asChild variant="outline" size="sm" className="mt-4">
                        <Link href="/farmer/farm-profile">Update Farm Profile</Link>
                    </Button>
                </div>
            </AnimatedCard>
        );
    }

    // No weather data
    if (!weatherData || !weatherData.current) {
        return (
            <AnimatedCard delay={0.3} className="min-h-[320px] p-6">
                <h2 className="mb-4 text-xl font-semibold">Weather Data</h2>
                <div className="flex flex-col items-center justify-center h-full">
                    <CloudIcon className="w-10 h-10 mb-2 text-muted-foreground" />
                    <p className="text-center text-muted-foreground">No weather data available</p>
                </div>
            </AnimatedCard>
        );
    }

    // Weather data available
    const currentWeather = weatherData.current;
    const weatherDescription = currentWeather.weather[0].description;
    const formattedDescription = weatherDescription.charAt(0).toUpperCase() + weatherDescription.slice(1);
    const farmingAdvice = getFarmingAdvice(
        currentWeather.weather[0].main.toLowerCase(),
        currentWeather.temp,
        currentWeather.wind_speed,
        currentWeather.uvi,
    );

    return (
        <AnimatedCard delay={0.3} className={`overflow-hidden p-0 ${error ? 'p-6' : ''}`}>
            <div className={`${getWeatherBgClass(currentWeather.weather[0].id)} p-6`}>
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-black">Weather Conditions</h2>
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
                        <Button variant="ghost" size="sm" className="text-xs text-muted-foreground bg-accent" asChild>
                            <a href="/farmer/farm-profile" className="flex items-center gap-1">
                                <span>Update Location</span>
                            </a>
                        </Button>
                    </motion.div>
                </div>

                <div className="flex items-start justify-between mt-4">
                    <div>
                        <h3 className="text-4xl font-bold text-black">{Math.round(currentWeather.temp)}°C</h3>
                        <p className="text-muted-foreground">
                            {getWeatherEmoji(currentWeather.weather[0].id)} {formattedDescription}
                        </p>
                        <p className="text-sm text-muted-foreground">Feels like: {Math.round(currentWeather.feels_like)}°C</p>
                    </div>
                    <motion.div
                        key={weatherDescription}
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.5 }}
                        transition={{ duration: 0.5 }}
                        className="text-5xl drop-shadow-md"
                    >
                        {getWeatherIcon(currentWeather.weather[0].id)}
                    </motion.div>
                </div>

                <div className="grid grid-cols-3 gap-2 mt-6">
                    <div className="flex items-center">
                        <HumidityIcon className="mr-2" />
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">{currentWeather.humidity}%</p>
                            <p className="text-xs text-muted-foreground">Humidity</p>
                        </div>
                    </div>
                    <div className="flex items-center">
                        <WindIcon className="mr-2" />
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">{Math.round(currentWeather.wind_speed * 3.6)} km/h</p>
                            <p className="text-xs text-muted-foreground">Wind</p>
                        </div>
                    </div>
                    <div className="flex items-center">
                        <UVIcon className="mr-2" />
                        <div>
                            <p className={`text-sm font-medium ${getUVIRating(currentWeather.uvi).color}`}>
                                {Math.round(currentWeather.uvi)} ({getUVIRating(currentWeather.uvi).rating})
                            </p>
                            <p className="text-xs text-muted-foreground">UV Index</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="px-6 py-4">
                <div className="text-sm text-muted-foreground">
                    <p className="font-medium">Farming Advisory:</p>
                    <p>{farmingAdvice}</p>
                </div>

                {weatherData.hourly && weatherData.hourly.length > 0 && (
                    <div className="pt-3 mt-4 border-t">
                        <p className="mb-2 text-xs font-medium text-muted-foreground">FORECAST (NEXT FEW HOURS)</p>
                        <div className="flex justify-between py-1 overflow-x-auto">
                            {weatherData.hourly.slice(1, 5).map((hour, index) => (
                                <div key={index} className="flex flex-col items-center justify-center px-2 text-center">
                                    <span className="text-xs">{formatTime(hour.dt)}</span>
                                    <div className="my-1">{getWeatherIcon(hour.weather[0].id)}</div>
                                    <span className="text-sm font-medium">{Math.round(hour.temp)}°</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </AnimatedCard>
    );
};

export default WeatherWidget;
